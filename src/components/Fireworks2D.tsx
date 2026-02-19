import { useEffect, useRef, memo } from 'react';
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
  type: 'chrysanthemum' | 'willow' | 'palm' | 'ring' | 'burst' | 'heart' | 'star' | 'spiral' | 'double-ring' | 'wave' | 
        'diamond' | 'butterfly' | 'crescent' | 'crosshair' | 'flower' | 'helix' | 'saturn' | 'smile' | 'infinity' | 'lightning' |
        'happy-new-year' | '2026';
  brightness: number;
  trail: { x: number; y: number }[];
}

export const Fireworks2D = memo(function Fireworks2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rockets: Rocket[] = [];
    const hues = [340, 0, 45, 60, 280, 320, 200, 180, 50];
    
    // Optimize for mobile
    const isMobile = window.innerWidth < 768;
    const particleMultiplier = isMobile ? 0.6 : 1;
    const frequencyMultiplier = isMobile ? 1.5 : 1;

    let lastRocketTime = 0;

    const createRocket = () => {
      const types: Rocket['type'][] = [
        'chrysanthemum', 'willow', 'palm', 'ring', 'burst', 
        'heart', 'star', 'spiral', 'double-ring', 'wave',
        'diamond', 'butterfly', 'crescent', 'crosshair', 'flower',
        'helix', 'saturn', 'smile', 'infinity', 'lightning',
        'happy-new-year', '2026'
      ];
      // Launch from left or right side - spread more to the edges
      const fromLeft = Math.random() < 0.5;
      const xStart = fromLeft ? canvas.width * (0.02 + Math.random() * 0.15) : canvas.width * (0.83 + Math.random() * 0.15);
      const targetX = fromLeft ? canvas.width * (0.1 + Math.random() * 0.25) : canvas.width * (0.65 + Math.random() * 0.25);
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

    // Helper function to create text patterns
    const getTextPattern = (text: string): { x: number; y: number }[] => {
      const points: { x: number; y: number }[] = [];
      const canvas2d = document.createElement('canvas');
      const ctx2d = canvas2d.getContext('2d');
      if (!ctx2d) return points;
      
      // Optimized canvas size for text
      canvas2d.width = 600;
      canvas2d.height = 150;
      
      // Use bold font for better definition
      ctx2d.font = 'bold 60px Arial';
      ctx2d.fillStyle = 'white';
      ctx2d.textAlign = 'center';
      ctx2d.textBaseline = 'middle';
      
      // Center the text properly
      ctx2d.fillText(text, 300, 75);
      
      const imageData = ctx2d.getImageData(0, 0, canvas2d.width, canvas2d.height);
      const step = 6; // Larger step for less dense text
      
      for (let y = 0; y < canvas2d.height; y += step) {
        for (let x = 0; x < canvas2d.width; x += step) {
          const index = (y * canvas2d.width + x) * 4;
          if (imageData.data[index + 3] > 128) { // Check alpha
            points.push({
              x: (x - 300) * 0.2, // Larger scale for bigger fireworks text
              y: (y - 75) * 0.2
            });
          }
        }
      }
      
      return points;
    };

    const createExplosion = (rocket: Rocket) => {
      const baseCount = rocket.type === 'burst' ? 150 : 
                       (rocket.type === 'heart' || rocket.type === 'star') ? 80 : 
                       (rocket.type === 'happy-new-year' || rocket.type === '2026') ? 300 : 100;
      const particleCount = Math.floor(baseCount * particleMultiplier);
      
      // Pre-generate text patterns for text-based fireworks
      let textPattern: { x: number; y: number }[] = [];
      if (rocket.type === 'happy-new-year') {
        textPattern = getTextPattern('HAPPY NEW YEAR');
      } else if (rocket.type === '2026') {
        textPattern = getTextPattern('2026');
      }
      
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
            
          case 'heart':
            // Heart shape using parametric equations
            const t = (i / particleCount) * Math.PI * 2;
            const heartX = 16 * Math.pow(Math.sin(t), 3);
            const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            const scale = 0.15 + Math.random() * 0.1;
            vx = heartX * scale;
            vy = heartY * scale;
            break;
            
          case 'star':
            // 5-pointed star
            const starAngle = (i / particleCount) * Math.PI * 2;
            const isPoint = Math.floor(i / (particleCount / 10)) % 2 === 0;
            const starRadius = isPoint ? 4 + Math.random() : 2 + Math.random();
            vx = Math.cos(starAngle) * starRadius;
            vy = Math.sin(starAngle) * starRadius;
            break;
            
          case 'spiral':
            // Spiral galaxy effect
            const spiralAngle = (i / particleCount) * Math.PI * 4;
            const spiralRadius = (i / particleCount) * 5;
            vx = Math.cos(spiralAngle) * spiralRadius;
            vy = Math.sin(spiralAngle) * spiralRadius;
            break;
            
          case 'double-ring':
            // Two concentric rings
            angle = (Math.PI * 2 * i) / particleCount;
            const isOuter = i % 2 === 0;
            const ringRadius = isOuter ? 4 : 2.5;
            vx = Math.cos(angle) * ringRadius;
            vy = Math.sin(angle) * ringRadius;
            break;
            
          case 'wave':
            // Wave pattern
            angle = (Math.PI * 2 * i) / particleCount;
            const waveAmplitude = Math.sin(angle * 3) * 2;
            speed = 3 + Math.random();
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed + waveAmplitude;
            break;
            
          case 'diamond':
            // Diamond/rhombus shape
            const diamondT = (i / particleCount) * 4;
            if (diamondT < 1) {
              vx = diamondT * 4;
              vy = diamondT * 2;
            } else if (diamondT < 2) {
              vx = (2 - diamondT) * 4;
              vy = diamondT * 2;
            } else if (diamondT < 3) {
              vx = (diamondT - 2) * -4;
              vy = (4 - diamondT) * 2;
            } else {
              vx = (4 - diamondT) * -4;
              vy = (4 - diamondT) * 2;
            }
            break;
            
          case 'butterfly':
            // Butterfly wings
            const butterflyT = (i / particleCount) * Math.PI * 2;
            const r = Math.sin(butterflyT * 2) * 3;
            vx = r * Math.cos(butterflyT);
            vy = r * Math.sin(butterflyT);
            break;
            
          case 'crescent':
            // Crescent moon
            const crescentAngle = (i / particleCount) * Math.PI * 1.5 - Math.PI * 0.75;
            const crescentR = 3 + Math.cos(crescentAngle) * 1.5;
            vx = Math.cos(crescentAngle) * crescentR;
            vy = Math.sin(crescentAngle) * crescentR;
            break;
            
          case 'crosshair':
            // Plus/cross pattern
            const crossSection = Math.floor((i / particleCount) * 4);
            const crossPos = (i % (particleCount / 4)) / (particleCount / 4) * 5;
            if (crossSection === 0) { vx = crossPos; vy = 0; }
            else if (crossSection === 1) { vx = -crossPos; vy = 0; }
            else if (crossSection === 2) { vx = 0; vy = crossPos; }
            else { vx = 0; vy = -crossPos; }
            break;
            
          case 'flower':
            // Flower petals (rose pattern)
            const flowerT = (i / particleCount) * Math.PI * 2;
            const flowerR = 3 * Math.cos(flowerT * 5);
            vx = flowerR * Math.cos(flowerT);
            vy = flowerR * Math.sin(flowerT);
            break;
            
          case 'helix':
            // DNA helix / double spiral
            const helixAngle = (i / particleCount) * Math.PI * 6;
            const helixRadius = 2 + Math.sin(helixAngle) * 1.5;
            const helixHeight = (i / particleCount) * 8 - 4;
            vx = Math.cos(helixAngle) * helixRadius;
            vy = helixHeight;
            break;
            
          case 'saturn':
            // Saturn with rings
            angle = (Math.PI * 2 * i) / particleCount;
            const isSaturnRing = Math.abs(Math.sin(angle)) < 0.3;
            const saturnR = isSaturnRing ? 4 + Math.random() : 2 + Math.random();
            vx = Math.cos(angle) * saturnR;
            vy = Math.sin(angle) * saturnR * (isSaturnRing ? 0.3 : 1);
            break;
            
          case 'smile':
            // Smiley face
            const smileT = (i / particleCount) * Math.PI * 2;
            const isSmile = smileT > Math.PI * 0.2 && smileT < Math.PI * 0.8;
            const smileR = isSmile ? 3 + Math.sin((smileT - Math.PI * 0.2) * 3) * 0.5 : 3.5;
            vx = Math.cos(smileT) * smileR;
            vy = Math.sin(smileT) * smileR + (isSmile ? 1 : 0);
            break;
            
          case 'infinity':
            // Infinity symbol (lemniscate)
            const infT = (i / particleCount) * Math.PI * 2;
            const infScale = 3 / (1 + Math.sin(infT) * Math.sin(infT));
            vx = infScale * Math.cos(infT);
            vy = infScale * Math.sin(infT) * Math.cos(infT);
            break;
            
          case 'lightning':
            // Lightning bolt zigzag
            const ltSegment = Math.floor((i / particleCount) * 8);
            const ltPos = (i % (particleCount / 8)) / (particleCount / 8);
            const ltZig = (ltSegment % 2 === 0 ? 1 : -1) * 2;
            vx = ltZig + (Math.random() - 0.5) * 0.5;
            vy = -4 + ltSegment * 0.8 + ltPos * 0.8;
            break;
            
          case 'happy-new-year':
            // Text: HAPPY NEW YEAR
            if (i < textPattern.length) {
              const point = textPattern[i];
              vx = point.x * 0.35;
              vy = point.y * 0.35;
            } else {
              // Fill with random particles if we need more
              angle = Math.random() * Math.PI * 2;
              speed = Math.random() * 2;
              vx = Math.cos(angle) * speed;
              vy = Math.sin(angle) * speed;
            }
            break;
            
          case '2026':
            // Text: 2026
            if (i < textPattern.length) {
              const point = textPattern[i];
              vx = point.x * 0.35;
              vy = point.y * 0.35;
            } else {
              angle = Math.random() * Math.PI * 2;
              speed = Math.random() * 2;
              vx = Math.cos(angle) * speed;
              vy = Math.sin(angle) * speed;
            }
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
          gravity: rocket.type === 'willow' ? 0.15 : 
                   rocket.type === 'palm' ? 0.2 : 
                   (rocket.type === 'happy-new-year' || rocket.type === '2026') ? 0.02 : 0.1,
          friction: rocket.type === 'willow' ? 0.96 : 
                   (rocket.type === 'happy-new-year' || rocket.type === '2026') ? 0.99 : 0.98,
          hue: hueVariation,
        };
        
        rocket.particles.push(particle);
      }
      
      rocket.exploded = true;
    };

    const animate = (currentTime: number) => {
      ctx.fillStyle = 'rgba(26, 10, 31, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new rockets (less frequent on mobile)
      const minInterval = 400 * frequencyMultiplier;
      const maxInterval = 600 * frequencyMultiplier;
      if (currentTime - lastRocketTime > minInterval + Math.random() * maxInterval) {
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
              particle.alpha -= 0.012;

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

    // Debounced resize handler
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return <canvas ref={canvasRef} className="fireworks-2d-canvas" />;
});
