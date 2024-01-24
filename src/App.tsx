import './App.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Splat } from './Splat';

function App() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [-1.5, 1, 5.5], fov: 45, near: 1, far: 20 }}
      eventSource={document.getElementById('root')!}
      eventPrefix="client">
      <Scene />
    </Canvas>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#171720']} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Splat
        src="https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_Ichiban_Living.splat"
        position={[0, 0, 0]}
      />
      {/* <Splat src="https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_church.splat" /> */}
    </>
  );
}

export default App;
