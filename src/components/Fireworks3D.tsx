import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FireworkParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  life: number;
  maxLife: number;
  gravity: number;
  friction: number;
}

interface Firework {
  particles: FireworkParticle[];
  exploded: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  life: number;
  type: 'chrysanthemum' | 'willow' | 'palm' | 'ring' | 'burst';
}

export function Fireworks3D() {
  const pointsRef = useRef<THREE.Points>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const nextFireworkTime = useRef(0);

  const colors = useMemo(() => [
    new THREE.Color(0xff6b9d), // Pink
    new THREE.Color(0xffb7d5), // Light pink
    new THREE.Color(0xffd700), // Gold
    new THREE.Color(0xff69b4), // Hot pink
    new THREE.Color(0xff1493), // Deep pink
    new THREE.Color(0xffffff), // White
    new THREE.Color(0xffa500), // Orange
    new THREE.Color(0xff4500), // Red-orange
  ], []);

  const maxParticles = 2000;
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      map: createStripeTexture(),
    });
  }, []);

  function createStripeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 4;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 32, 0);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 4);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  const createFirework = () => {
    const types: Firework['type'][] = ['chrysanthemum', 'willow', 'palm', 'ring', 'burst'];
    // Launch from left or right side - spread more to the edges
    const fromLeft = Math.random() < 0.5;
    const xStart = fromLeft ? -18 - Math.random() * 6 : 18 + Math.random() * 6;
    const xTarget = fromLeft ? -8 + Math.random() * 8 : 8 - Math.random() * 8;
    const vx = (xTarget - xStart) / 100;
    
    const firework: Firework = {
      particles: [],
      exploded: false,
      position: new THREE.Vector3(
        xStart,
        -5,
        (Math.random() - 0.5) * 12
      ),
      velocity: new THREE.Vector3(
        vx,
        0.15 + Math.random() * 0.1,
        (Math.random() - 0.5) * 0.3
      ),
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      type: types[Math.floor(Math.random() * types.length)],
    };
    return firework;
  };

  const explodeFirework = (firework: Firework) => {
    const particleCount = firework.type === 'burst' ? 150 : 100;

    for (let i = 0; i < particleCount; i++) {
      let theta, phi, speed;
      
      switch (firework.type) {
        case 'chrysanthemum':
          // Perfect sphere
          theta = Math.random() * Math.PI * 2;
          phi = Math.random() * Math.PI;
          speed = 0.1 + Math.random() * 0.15;
          break;
          
        case 'willow':
          // Drooping effect - more downward
          theta = Math.random() * Math.PI * 2;
          phi = Math.random() * Math.PI * 0.6 + Math.PI * 0.4; // Bias to bottom half
          speed = 0.08 + Math.random() * 0.12;
          break;
          
        case 'palm':
          // Upward then falling
          theta = Math.random() * Math.PI * 2;
          phi = Math.random() * Math.PI * 0.5; // Bias to top half
          speed = 0.08 + Math.random() * 0.12;
          break;
          
        case 'ring':
          // Horizontal ring
          theta = Math.random() * Math.PI * 2;
          phi = Math.PI / 2 + (Math.random() - 0.5) * 0.3; // Near horizontal
          speed = 0.12 + Math.random() * 0.15;
          break;
          
        case 'burst':
          // Random explosive
          theta = Math.random() * Math.PI * 2;
          phi = Math.random() * Math.PI;
          speed = Math.random() * 0.2;
          break;
          
        default:
          theta = Math.random() * Math.PI * 2;
          phi = Math.random() * Math.PI;
          speed = 0.1 + Math.random() * 0.15;
      }

      const velocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      );

      // Each particle gets a random color from the palette
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const maxLife = firework.type === 'willow' ? 2 : 1 + Math.random() * 0.5;
      const gravity = firework.type === 'willow' ? 0.008 : firework.type === 'palm' ? 0.01 : 0.005;
      const friction = firework.type === 'willow' ? 0.96 : 0.98;

      firework.particles.push({
        position: firework.position.clone(),
        velocity: velocity,
        color: randomColor.clone(),
        life: 1,
        maxLife: maxLife,
        gravity: gravity,
        friction: friction,
      });
    }

    firework.exploded = true;
  };

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Create new fireworks
    if (time > nextFireworkTime.current) {
      fireworksRef.current.push(createFirework());
      nextFireworkTime.current = time + 0.6 + Math.random() * 1.0;
    }

    // Update fireworks
    let particleIndex = 0;
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    const sizes = geometry.attributes.size.array as Float32Array;

    for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
      const firework = fireworksRef.current[i];

      if (!firework.exploded) {
        // Update rocket position
        firework.position.add(firework.velocity.clone().multiplyScalar(delta * 60));
        firework.velocity.y -= 0.002; // Gravity
        firework.life -= delta * 0.5;

        // Check if rocket should explode
        if (firework.velocity.y < 0.02 || firework.life <= 0) {
          explodeFirework(firework);
        }

        // Draw rocket
        if (particleIndex < maxParticles) {
          positions[particleIndex * 3] = firework.position.x;
          positions[particleIndex * 3 + 1] = firework.position.y;
          positions[particleIndex * 3 + 2] = firework.position.z;
          colors[particleIndex * 3] = firework.color.r;
          colors[particleIndex * 3 + 1] = firework.color.g;
          colors[particleIndex * 3 + 2] = firework.color.b;
          sizes[particleIndex] = 15;
          particleIndex++;
        }
      } else {
        // Update particles
        for (let j = firework.particles.length - 1; j >= 0; j--) {
          const particle = firework.particles[j];
          
          particle.position.add(particle.velocity.clone().multiplyScalar(delta * 60));
          particle.velocity.y -= particle.gravity; // Gravity per particle
          particle.velocity.multiplyScalar(particle.friction); // Air resistance per particle
          particle.life -= delta / particle.maxLife * 1.5; // Fade faster

          // Only render particles with sufficient alpha to avoid smoke effect
          if (particle.life > 0.15 && particleIndex < maxParticles) {
            positions[particleIndex * 3] = particle.position.x;
            positions[particleIndex * 3 + 1] = particle.position.y;
            positions[particleIndex * 3 + 2] = particle.position.z;
            colors[particleIndex * 3] = particle.color.r;
            colors[particleIndex * 3 + 1] = particle.color.g;
            colors[particleIndex * 3 + 2] = particle.color.b;
            sizes[particleIndex] = 15 * particle.life;
            particleIndex++;
          } else {
            firework.particles.splice(j, 1);
          }
        }

        // Remove empty fireworks
        if (firework.particles.length === 0) {
          fireworksRef.current.splice(i, 1);
        }
      }
    }

    // Clear remaining particles
    for (let i = particleIndex; i < maxParticles; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -1000;
      positions[i * 3 + 2] = 0;
      sizes[i] = 0;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
