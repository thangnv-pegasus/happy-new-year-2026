import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PetalProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

function Petal({ position, rotation, scale }: PetalProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y -= 0.01;
      meshRef.current.rotation.z += 0.01;
      
      // Reset position when falling below the screen
      if (meshRef.current.position.y < -10) {
        meshRef.current.position.y = 10;
        meshRef.current.position.x = (Math.random() - 0.5) * 20;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[0.3, 0.4]} />
      <meshStandardMaterial
        color="#ffb7d5"
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

export function PeachBlossoms() {
  const petals = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      key: i,
      position: [
        (Math.random() - 0.5) * 20,
        Math.random() * 20 - 5,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  return (
    <>
      {petals.map((petal) => (
        <Petal
          key={petal.key}
          position={petal.position}
          rotation={petal.rotation}
          scale={petal.scale}
        />
      ))}
    </>
  );
}

interface BlossomTreeProps {
  position: [number, number, number];
}

export function BlossomTree({ position }: BlossomTreeProps) {
  const branchRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (branchRef.current) {
      branchRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={branchRef} position={position}>
      {/* Tree branch */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.05, 3, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Blossoms on branch */}
      {Array.from({ length: 15 }, (_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 0.5 + Math.random() * 0.5;
        const height = (i / 15) * 2.5 - 1;
        
        return (
          <group key={i} position={[
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          ]}>
            {/* Blossom cluster */}
            {Array.from({ length: 5 }, (_, j) => {
              const blossomAngle = (j / 5) * Math.PI * 2;
              const blossomRadius = 0.15;
              
              return (
                <mesh
                  key={j}
                  position={[
                    Math.cos(blossomAngle) * blossomRadius,
                    0,
                    Math.sin(blossomAngle) * blossomRadius
                  ]}
                >
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshStandardMaterial color="#ffb7d5" emissive="#ff69b4" emissiveIntensity={0.3} />
                </mesh>
              );
            })}
            {/* Yellow center */}
            <mesh>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#ffd700" emissive="#ffff00" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
