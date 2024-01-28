# Getting Creative with Gaussian Splatting

![3D scene with Gaussian splatting](/docs/creative-gaussian-splatting.webp)

This is a simple demo to provide some brief technical explanations and creative jumping off points for exploring Gaussian Splatting in your Three.js project.

### [Live Demo](https://lpalombo.github.io/creative-gaussian-splatting/)

### [Video recording of my accompanying presentation from Creative Coding Toronto, Jan 25th 2024](https://www.youtube.com/watch?v=TUVGNc1oZqY)

## Resources

- [Labs.Monks Report - Gaussian Splatting: Accessible High-End 3D](https://docs.google.com/presentation/d/e/2PACX-1vT0k0CEmh92UsNMsgWoKulaM8MY-x1JyE8Gd86Sr_ZQ-AOmJx2GPQVMkb_Te5O-O7cyJ7jQtnDwy40Y/pub?start=false&loop=false&delayms=3000&slide=id.g294c79dca5e_0_283)

  a great overview of the past, present, future of this technique

- [MrNeRF's "Awesome" 3D Gaussian Splatting Resources](https://github.com/MrNeRF/awesome-3D-gaussian-splatting)

  a curated list of resources for 3D Gaussian Splatting

- [Luma AI](https://lumalabs.ai/)

  Online platform to create a Gaussian Splatting model from a video or set of images

- [Polycam 3D Gaussian Splatting](https://poly.cam/tools/gaussian-splatting)

  alternative to Luma

- [Nerfstudio's Splatfacto](https://docs.nerf.studio/nerfology/methods/splat.html)

  compute a Gaussian Splatting model from a set of images locally

- [Alex Evan's Suggestions for Gaussian Splatting](https://twitter.com/mmalex/status/1709322082717196498)

  Alex Evans was one of the tech leads on the Media Molecule game "Dreams" which uses a similar technique to render 3D scenes to great effect. Check out his [Umbra Ignite talk about the rendering tech in Dreams](https://www.youtube.com/watch?v=u9KNtnCZDMI)

## Development

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Pnpm](https://pnpm.io/)

### Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

### Important Files

- [src/App.tsx](/src/App.tsx) - Main application entry point. Contains React Three Fiber scene and text dialog.
- [src/Splat.tsx](/src/Splat.tsx) - Clone of [@react-three/drei's Splat component](https://github.com/pmndrs/drei/blob/master/src/core/Splat.tsx) with some modifications to add custom materials.
- [src/materials/](/src/materials/) - Custom materials to demo interesting effects to use Gaussian Splatting. Any customizations from the base material are commented with `// CUSTOM` + `// END CUSTOM`.
