import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

export type SplatStylizedMaterialType = {
  alphaTest?: number;
  alphaHash?: boolean;
  centerAndScaleTexture?: THREE.DataTexture;
  covAndColorTexture?: THREE.DataTexture;
  viewport?: THREE.Vector2;
  focal?: number;
};

export const SplatStylizedMaterial = /* @__PURE__ */ shaderMaterial(
  {
    alphaTest: 0,
    viewport: /* @__PURE__ */ new THREE.Vector2(1980, 1080),
    focal: 1000.0,
    centerAndScaleTexture: null,
    covAndColorTexture: null,
  },
  /*glsl*/ `
    precision highp sampler2D;
    precision highp usampler2D;
    out vec4 vColor;
    out vec3 vPosition;
    uniform vec2 resolution;
    uniform vec2 viewport;
    uniform float focal;
    attribute uint splatIndex;
    uniform sampler2D centerAndScaleTexture;
    uniform usampler2D covAndColorTexture;

    vec2 unpackInt16(in uint value) {
      int v = int(value);
      int v0 = v >> 16;
      int v1 = (v & 0xFFFF);
      if((v & 0x8000) != 0)
        v1 |= 0xFFFF0000;
      return vec2(float(v1), float(v0));
    }

    void main () {
      ivec2 texSize = textureSize(centerAndScaleTexture, 0);
      ivec2 texPos = ivec2(splatIndex%uint(texSize.x), splatIndex/uint(texSize.x));
      vec4 centerAndScaleData = texelFetch(centerAndScaleTexture, texPos, 0);
      vec4 center = vec4(centerAndScaleData.xyz, 1);
      vec4 camspace = modelViewMatrix * center;
      vec4 pos2d = projectionMatrix * camspace;

      float bounds = 1.2 * pos2d.w;
      if (pos2d.z < -pos2d.w || pos2d.x < -bounds || pos2d.x > bounds
        || pos2d.y < -bounds || pos2d.y > bounds) {
        gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
        return;
      }

      // CUSTOM
      float scale = centerAndScaleData.w;
      scale *= 1.0;

      uvec4 covAndColorData = texelFetch(covAndColorTexture, texPos, 0);
      // vec2 cov3D_M11_M12 = unpackInt16(covAndColorData.x) * centerAndScaleData.w;
      // vec2 cov3D_M13_M22 = unpackInt16(covAndColorData.y) * centerAndScaleData.w;
      // vec2 cov3D_M23_M33 = unpackInt16(covAndColorData.z) * centerAndScaleData.w;
      vec2 cov3D_M11_M12 = unpackInt16(covAndColorData.x) * scale;
      vec2 cov3D_M13_M22 = unpackInt16(covAndColorData.y) * scale;
      vec2 cov3D_M23_M33 = unpackInt16(covAndColorData.z) * scale;
      // END CUSTOM

      mat3 Vrk = mat3(
        cov3D_M11_M12.x, cov3D_M11_M12.y, cov3D_M13_M22.x,
        cov3D_M11_M12.y, cov3D_M13_M22.y, cov3D_M23_M33.x,
        cov3D_M13_M22.x, cov3D_M23_M33.x, cov3D_M23_M33.y
      );

      mat3 J = mat3(
        focal / camspace.z, 0., -(focal * camspace.x) / (camspace.z * camspace.z),
        0., focal / camspace.z, -(focal * camspace.y) / (camspace.z * camspace.z),
        0., 0., 0.
      );

      mat3 W = transpose(mat3(modelViewMatrix));
      mat3 T = W * J;
      mat3 cov = transpose(T) * Vrk * T;
      vec2 vCenter = vec2(pos2d) / pos2d.w;
      float diagonal1 = cov[0][0] + 0.3;
      float offDiagonal = cov[0][1];
      float diagonal2 = cov[1][1] + 0.3;
      float mid = 0.5 * (diagonal1 + diagonal2);
      float radius = length(vec2((diagonal1 - diagonal2) / 2.0, offDiagonal));
      float lambda1 = mid + radius;
      float lambda2 = max(mid - radius, 0.1);
      vec2 diagonalVector = normalize(vec2(offDiagonal, lambda1 - diagonal1));
      vec2 v1 = min(sqrt(2.0 * lambda1), 1024.0) * diagonalVector;
      vec2 v2 = min(sqrt(2.0 * lambda2), 1024.0) * vec2(diagonalVector.y, -diagonalVector.x);
      uint colorUint = covAndColorData.w;
      vColor = vec4(
        float(colorUint & uint(0xFF)) / 255.0,
        float((colorUint >> uint(8)) & uint(0xFF)) / 255.0,
        float((colorUint >> uint(16)) & uint(0xFF)) / 255.0,
        float(colorUint >> uint(24)) / 255.0
      );
      vPosition = position;

      gl_Position = vec4(
        vCenter
          + position.x * v2 / viewport * 2.0
          + position.y * v1 / viewport * 2.0, pos2d.z / pos2d.w, 1.0);
    }
    `,
  /*glsl*/ `
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    in vec4 vColor;
    in vec3 vPosition;

    // CUSTOM
    // https://iquilezles.org/articles/distfunctions2d/
    float dot2( vec2 v ) { return dot(v,v); }
    float sdfCoolS( in vec2 p ){
        float six = (p.y<0.0) ? -p.x : p.x;
        p.x = abs(p.x);
        p.y = abs(p.y) - 0.2;
        float rex = p.x - min(round(p.x/0.4),0.4);
        float aby = abs(p.y-0.2)-0.6;

        float d = dot2(vec2(six,-p.y)-clamp(0.5*(six-p.y),0.0,0.2));
        d = min(d,dot2(vec2(p.x,-aby)-clamp(0.5*(p.x-aby),0.0,0.4)));
        d = min(d,dot2(vec2(rex,p.y  -clamp(p.y          ,0.0,0.4))));

        float s = 2.0*p.x + aby + abs(aby+0.4) - 0.4;
        return sqrt(d) * sign(s);
    }

    void main () {
      // float A = -dot(vPosition.xy, vPosition.xy);
      // if (A < -4.0) discard;
      // float B = exp(A) * vColor.a;

      float sdf = smoothstep(-0.01, -0.04, sdfCoolS(vPosition.xy)) + 0.02;
      vec3 col = sdf * vColor.rgb;
      float B = sdf * vColor.a;

      // vec4 diffuseColor = vec4(vColor.rgb, B);
      vec4 diffuseColor = vec4(col, B);
      // END CUSTOM

      #include <alphatest_fragment>
      #include <alphahash_fragment>
      gl_FragColor = diffuseColor;
      #include <tonemapping_fragment>
      #include <${
        parseInt(THREE.REVISION.replace(/\D+/g, '')) >= 154
          ? 'colorspace_fragment'
          : 'encodings_fragment'
      }>
    }
  `
);
