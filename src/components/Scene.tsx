import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { PeachBlossoms, BlossomTree } from './PeachBlossom';
import { Fireworks3D } from './Fireworks3D';

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 60 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    >
      <color attach="background" args={['#1a0a1f']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffb7d5" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff69b4" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#ffd700" />
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={8000} factor={6} saturation={0.3} fade speed={1} />
      
      {/* Fireworks */}
      <Fireworks3D />
      
      {/* Peach blossom trees */}
      <BlossomTree position={[-3, -2, -2]} />
      <BlossomTree position={[3, -2, -3]} />
      
      {/* Falling petals */}
      <PeachBlossoms />
      
      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </Canvas>
  );
}
