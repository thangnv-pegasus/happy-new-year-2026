import { useEffect, useRef } from 'react';
import './Fireworks2D.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  brightness: number;
  trail: { x: number; y: number; alpha: number }[];
  gravity: number;
  friction: number;
  hue: number;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  hue: number;
  exploded: boolean;
  particles: Particle[];
  type: 'chrysanthemum' | 'willow' | 'palm' | 'ring' | 'burst';
  brightness: number;
  trail: { x: number; y: number }[];
}

export function Fireworks2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rockets: Rocket[] = [];
    const hues = [340, 0, 45, 60, 280, 320, 200, 180, 50];

    let lastRocketTime = 0;

    const createRocket = () => {
      const types: Rocket['type'][] = ['chrysanthemum', 'willow', 'palm', 'ring', 'burst'];
      // Launch from left or right side - spread more to the edges
      const fromLeft = Math.random() < 0.5;
      const xStart = fromLeft ? canvas.width * (0.02 + Math.random() * 0.15) : canvas.width * (0.83 + Math.random() * 0.15);
      const targetX = fromLeft ? canvas.width * (0.15 + Math.random() * 0.35) : canvas.width * (0.5 + Math.random() * 0.35);
      const vx = (targetX - xStart) / 100;
      
      const rocket: Rocket = {
        x: xStart,
        y: canvas.height,
        vx: vx,
        vy: -(12 + Math.random() * 5),
        targetY: canvas.height * (0.1 + Math.random() * 0.3),
        hue: hues[Math.floor(Math.random() * hues.length)],
        exploded: false,
        particles: [],
        type: types[Math.floor(Math.random() * types.length)],
        brightness: 80 + Math.random() * 20,
        trail: [],
      };
      return rocket;
    };

    const createExplosion = (rocket: Rocket) => {
      const particleCount = rocket.type === 'burst' ? 150 : 100;
      
      for (let i = 0; i < particleCount; i++) {
        let angle, speed, vx, vy;
        
        switch (rocket.type) {
          case 'chrysanthemum':
            // Perfect sphere
            angle = (Math.PI * 2 * i) / particleCount;
            speed = 3 + Math.random() * 3;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            break;
            
          case 'willow':
            // Drooping effect
            angle = (Math.PI * 2 * i) / particleCount;
            speed = 2 + Math.random() * 2;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed - 1;
            break;
            
          case 'palm':
            // Upward burst then falling
            angle = (Math.PI * 2 * i) / particleCount;
            speed = 2 + Math.random() * 2;
            vx = Math.cos(angle) * speed * 0.5;
            vy = Math.sin(angle) * speed - 2;
            break;
            
          case 'ring':
            // Horizontal ring
            angle = (Math.PI * 2 * i) / particleCount;
            const radius = Math.abs(Math.sin(angle * 3));
            speed = 4 + Math.random() * 2;
            vx = Math.cos(angle) * speed * radius;
            vy = Math.sin(angle) * speed * radius;
            break;
            
          case 'burst':
            // Random explosive burst
            angle = Math.random() * Math.PI * 2;
            speed = Math.random() * 6;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            break;
            
          default:
            angle = (Math.PI * 2 * i) / particleCount;
            speed = 3 + Math.random() * 2;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
        }
        
        const hueVariation = rocket.hue + (Math.random() - 0.5) * 60;
        const particle: Particle = {
          x: rocket.x,
          y: rocket.y,
          vx: vx,
          vy: vy,
          alpha: 1,
          brightness: rocket.brightness,
          trail: [],
          gravity: rocket.type === 'willow' ? 0.15 : rocket.type === 'palm' ? 0.2 : 0.1,
          friction: rocket.type === 'willow' ? 0.96 : 0.98,
          hue: hueVariation,
        };
        
        rocket.particles.push(particle);
      }
      
      rocket.exploded = true;
    };

    const animate = (currentTime: number) => {
      ctx.fillStyle = 'rgba(26, 10, 31, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new rockets
      if (currentTime - lastRocketTime > 400 + Math.random() * 600) {
        rockets.push(createRocket());
        lastRocketTime = currentTime;
      }

      // Update and draw rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];

        if (!rocket.exploded) {
          // Update rocket position
          rocket.trail.push({ x: rocket.x, y: rocket.y });
          if (rocket.trail.length > 15) rocket.trail.shift();
          
          rocket.x += rocket.vx;
          rocket.y += rocket.vy;
          rocket.vy += 0.15; // Gravity

          // Draw rocket trail
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          for (let j = 0; j < rocket.trail.length; j++) {
            const point = rocket.trail[j];
            const alpha = j / rocket.trail.length;
            ctx.globalAlpha = alpha * 0.8;
            ctx.strokeStyle = `hsl(${rocket.hue}, 100%, ${rocket.brightness}%)`;
            if (j > 0) {
              const prev = rocket.trail[j - 1];
              ctx.beginPath();
              ctx.moveTo(prev.x, prev.y);
              ctx.lineTo(point.x, point.y);
              ctx.stroke();
            }
          }
          
          // Draw rocket head
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${rocket.hue}, 100%, ${rocket.brightness}%)`;
          ctx.fill();
          
          // Glow
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(rocket.x, rocket.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${rocket.hue}, 100%, ${rocket.brightness}%)`;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Check if rocket should explode
          if (rocket.y <= rocket.targetY || rocket.vy > 0) {
            createExplosion(rocket);
          }
        } else {
          // Update and draw particles
          let allDead = true;

          for (const particle of rocket.particles) {
            if (particle.alpha > 0) {
              allDead = false;

              // Store trail
              particle.trail.push({ x: particle.x, y: particle.y, alpha: particle.alpha });
              if (particle.trail.length > 5) particle.trail.shift();

              // Update particle
              particle.vx *= particle.friction;
              particle.vy *= particle.friction;
              particle.vy += particle.gravity;
              particle.x += particle.vx;
              particle.y += particle.vy;
              particle.alpha -= 0.025;

              // Draw particle trail
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              
              for (let j = 1; j < particle.trail.length; j++) {
                const prevPoint = particle.trail[j - 1];
                const point = particle.trail[j];
                const trailAlpha = (j / particle.trail.length) * point.alpha;
                
                // Skip very low alpha to avoid smoke effect
                if (trailAlpha < 0.05) continue;
                
                ctx.beginPath();
                ctx.moveTo(prevPoint.x, prevPoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.strokeStyle = `hsla(${particle.hue}, 100%, ${particle.brightness}%, ${trailAlpha})`;
                ctx.lineWidth = 2.5 * (j / particle.trail.length);
                ctx.stroke();
              }

              // Draw particle head (brighter)
              if (particle.alpha > 0.1) {
                ctx.globalAlpha = particle.alpha;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${particle.hue}, 100%, ${Math.min(particle.brightness + 20, 100)}%)`;
                ctx.fill();
                
                // Glow
                ctx.globalAlpha = particle.alpha * 0.3;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${particle.hue}, 100%, ${particle.brightness}%)`;
                ctx.fill();
                ctx.globalAlpha = 1;
              }
            }
          }

          if (allDead) {
            rockets.splice(i, 1);
          }
        }
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fireworks-2d-canvas" />;
}
