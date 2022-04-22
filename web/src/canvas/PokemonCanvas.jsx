import { PerspectiveCamera, OrbitControls, useGLTF, Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import LoadingIndicator from 'Components/LoadingIndicator';

const angleToRadians = (angleInDegree) => {
  return (Math.PI / 180) * angleInDegree;
};

const PokemonTeam = () => {
  const { nodes, scene } = useGLTF('/pokemonTeam/scene.gltf');
  return <primitive object={scene} scale={1.1} dispose={null}></primitive>;
};

useGLTF.preload('/pokemonTeam/scene.gltf');

export const PokemonCanvas = () => {
  return (
    <Canvas>
      <Suspense
        fallback={
          <Html position={[-0.4, 0.7, 0]}>
            <LoadingIndicator />
          </Html>
        }
      >
        <PerspectiveCamera makeDefault position={[4, 5, 10]} />
        <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
        <ambientLight args={['#ffffff', 0.25]} />
        <spotLight
          args={['#ffffff', 3, 50, angleToRadians(80), 0.4]}
          position={[-4, 2, 5]}
          castShadow
        />
        <PokemonTeam />
      </Suspense>
    </Canvas>
  );
};
