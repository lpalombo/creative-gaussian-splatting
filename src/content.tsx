import { ReactNode } from 'react';
import { SplatMaterialType } from './Splat';

export const content: {
  title: string;
  body: string | ReactNode;
  sceneProps: { mode?: SplatMaterialType | 'alphaTest' | 'alphaHash' | 'badSorting' };
}[] = [
  {
    title: 'Basic Rendering',
    body: (
      <>
        <p>
          This is the "out of the box" experience you get with a lot of the Three.js Gaussian
          Splatting libraries out there.
        </p>
        <p>
          For example with{' '}
          <a href="" target="_blank">
            React Three Fiber
          </a>
          , simply throw a <code>{'<Splat />'}</code> component from{' '}
          <a href="https://github.com/pmndrs/drei?tab=readme-ov-file#splat" target="_blank">
            Drei
          </a>{' '}
          as a child of your canvas component and you should be good to go.
        </p>
        <pre>
          <code>{`
<Canvas>
  <Splat src="https://example.com/my-splat-file.splat" />
</Canvas>
        `}</code>
        </pre>
      </>
    ),
    sceneProps: {
      mode: 'base',
    },
  },
  {
    title: 'Splat Transformations',
    body: (
      <>
        <p>
          Gaussian Splats are rendered as{' '}
          <a
            href="https://offscreencanvas.gumroad.com/l/mastering-threejs-instancing"
            target="_blank">
            instanced points
          </a>
          . As such they can be easily manipulated by modifying the vertex and fragment shader that
          renders them.
        </p>
        <p>
          In this scene, I've duplicated and modified the original material to add a line to it's
          vertex shader. For every point, the vertex shader collects some data about it's position
          from a texture. By adding a{' '}
          <a href="https://thebookofshaders.com/03/" target="_blank">
            new uniform to track time
          </a>
          , and manipulating that position with some math, we can make some fun new effects.
        </p>
        <pre>
          <code>
            {`
  // at the top of the shader
  uniform float time;

  // in the main function

  // centerAndScaleData has been sampled from a texture
  vec4 center = vec4(centerAndScaleData.xyz, 1);

  // add some time based movement to this vector
  center.xyz += vec3(
    0.0,
    sin(time + center.x) * 0.25,
    0.0
  );
      `}
          </code>
        </pre>
      </>
    ),
    sceneProps: {
      mode: 'wiggly',
    },
  },
  {
    title: 'Splat Shape Modifications',
    body: (
      <>
        <p>
          Each Gaussian Splat is in essence a circle rendered onto a rectangular plane. This results
          in a smooth realistic image when all the splats are blended together, but who cares about
          that?
        </p>
        <p>
          Here we've modified the fragment shader to render a{' '}
          <a href="https://www.shadertoy.com/view/clVXWc" target="_blank">
            Cool S
          </a>{' '}
          instead of a circle for each splat. Consider that in the vertex shader, the varying
          vPosition can be utilized much like a UV coordinate.
        </p>

        <pre>
          <code>
            {`
  // in the main function

  // sdfCoolS courtesy of
  // https://iquilezles.org/articles/distgradfunctions2d/
  float sdf = smoothstep(
    -0.01,
    -0.04,
    sdfCoolS(vPosition.xy)
  ) + 0.02;

  // use the sdf to modify the splat's color and alpha
  vec3 col = sdf * vColor.rgb;
  float B = sdf * vColor.a;

      `}
          </code>
        </pre>
        <p>
          Other possiblities in the fragment shader include modifying the splat's color by some{' '}
          <a href="https://lygia.xyz/color" target="_blank">
            using some helper functions
          </a>
          , or sampling a texture to add some detail to the splat.
        </p>
      </>
    ),
    sceneProps: {
      mode: 'stylized',
    },
  },
  {
    title: 'Considerations: Transparency Sorting',
    body: (
      <>
        <p>
          One of the most difficult parts of rendering Gaussian Splats is sorting them in a way that
          makes sense. In this scene, we've added a second model to the scene to demonstrate the
          problem.
        </p>
        <p>
          This is a largely unsolved problem for 3D rendering in general. The issue is{' '}
          <a href="https://obi.virtualmethodstudio.com/forum/thread-2899.html" target="_blank">
            that when rendering transparent objects, the order in which they are rendered matters.
          </a>{' '}
          To work around this, we'll need to use some tricks.
        </p>
      </>
    ),
    sceneProps: {
      mode: 'badSorting',
    },
  },
  {
    title: 'Considerations: Alpha Clipping (alphaTest)',
    body: (
      <>
        <p>
          One workaround is to use alpha clipping. This is a technique where we discard pixels that
          are below a certain alpha threshold. This solution can work ok if the brightness of the
          splat models are similar, but it can cause some ugly artifacts if the splats are too
          different.
        </p>
        <pre>
          <code>{`
<Canvas>
  <Splat
    src="https://example.com/my-splat-file.splat"
    alphaTest={0.1}
  />
</Canvas>
        `}</code>
        </pre>
      </>
    ),
    sceneProps: {
      mode: 'alphaTest',
    },
  },
  {
    title: 'Considerations: Alpha Hashing',
    body: (
      <>
        <p>
          Another workaround is to use alpha hashing. This is a technique where we add some noise to
          the alpha channel of the splat. This solution can work ok if you're willing to accept some
          amount of grain in your image.
        </p>
        <p>
          The output can be improved by using some post-processing to smooth out the noise. One
          common technique is to use Temporal Reprojection Anti-Aliasing (TRAA). But I haven't found
          a great way to do this in Three.js yet.
        </p>
        <pre>
          <code>{`
<Canvas>
  <Splat
    src="https://example.com/my-splat-file.splat"
    alphaHash={true}
  />
</Canvas>
        `}</code>
        </pre>
      </>
    ),
    sceneProps: {
      mode: 'alphaHash',
    },
  },
];
