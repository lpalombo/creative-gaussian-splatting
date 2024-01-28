import { ReactNode } from 'react';
import { SplatMaterialType } from './Splat';

export const content: {
  title: string;
  body: string | ReactNode;
  sceneProps: { mode?: SplatMaterialType | 'alphaTest' | 'alphaHash' };
}[] = [
  {
    title: 'Basic Rendering',
    body: 'This is a basic rendering of a gaussian splatting algorithm. It is not interactive, but it is a good starting point to understand the algorithm.',
    sceneProps: {
      mode: 'base',
    },
  },
  {
    title: 'Wiggly Rendering',
    body: (
      <>
        <p>a test</p>
        <code>{`
  center.xyz += vec3(
    0.0,
    sin(time + center.x) * 0.25,
    0.0
  );
      `}</code>
        <p>a test</p>
        <p>a test</p>
      </>
    ),
    sceneProps: {
      mode: 'wiggly',
    },
  },
];
