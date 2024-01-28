import './App.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Splat, SplatMaterialType } from './Splat';
import { ReactNode, useRef, useState } from 'react';
import { content } from './content';

function App() {
  const container = useRef<HTMLDivElement>(null!);
  const [step, setStep] = useState(0);
  return (
    <>
      <Dialog
        title={content[step].title}
        body={content[step].body}
        next={() => {
          setStep(Math.min(step + 1, content.length - 1));
        }}
        previous={() => {
          setStep(Math.max(step - 1, 0));
        }}
        prevDisabled={step === 0}
        nextDisabled={step === content.length - 1}
      />
      <div id="canvas-container" ref={container}>
        <Canvas
          dpr={[0.5, 1]}
          camera={{ position: [-3, 1, -5.5], fov: 45, near: 1, far: 100 }}
          eventSource={container}
          eventPrefix="client">
          <Scene {...content[step].sceneProps} />
        </Canvas>
      </div>
    </>
  );
}

function Dialog(props: {
  title: string;
  body: string | ReactNode;
  next: () => void;
  previous: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}) {
  const { title, body, next, previous, prevDisabled, nextDisabled } = props;
  return (
    <div className="dialog">
      <h1>Getting Creative with Gaussian Splatting</h1>
      <h2>{title}</h2>
      <div className="dialog__body">{typeof body === 'string' ? <p>{body}</p> : body}</div>
      <div className="dialog__button-container">
        <button onClick={previous} disabled={prevDisabled}>
          Previous
        </button>
        <button onClick={next} disabled={nextDisabled}>
          Next
        </button>
      </div>
    </div>
  );
}

function Scene(props: { mode?: SplatMaterialType | 'badSorting' | 'alphaTest' | 'alphaHash' }) {
  const { mode = 'base' } = props;
  const showSecondModel = mode === 'alphaTest' || mode === 'alphaHash' || mode === 'badSorting';
  const materialType = showSecondModel ? 'base' : mode;

  const group = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    group.current.position.y = Math.sin(clock.getElapsedTime() * 1) * 2;
  });

  return (
    <>
      <color attach="background" args={['#171720']} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Splat
        src="https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_Ichiban_Living.splat"
        position={[0, 0, 0]}
        materialType={materialType}
        alphaTest={mode === 'alphaTest' ? 0.1 : undefined}
        alphaHash={mode === 'alphaHash' ? true : false}
      />
      <group ref={group}>
        <Splat
          src="https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_church.splat"
          position={[1, 0, 0]}
          visible={showSecondModel}
          alphaTest={mode === 'alphaTest' ? 0.1 : undefined}
          alphaHash={mode === 'alphaHash' ? true : false}
        />
      </group>
    </>
  );
}

export default App;
