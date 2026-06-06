import { useEffect, useRef } from 'react';

export default function BlueyardNeuralBackground({ theme = "aqua" }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  // Map of static themes to specific color profiles matching the sections
  const themes = {
    aqua: {
      // Section 1: ProcessFlow (Aqua Blue & Mint)
      grad1: { r: 10, g: 30, b: 50 },      // Slate background depth
      grad2: { r: 0, g: 240, b: 255 },     // Electric Aqua
      grad3: { r: 167, g: 243, b: 208 },   // Mint green
      glow: { r: 0, g: 240, b: 255 }
    },
    teal: {
      // Section 2: ServicesPreview (Teal & Emerald)
      grad1: { r: 6, g: 24, b: 20 },
      grad2: { r: 16, g: 185, b: 129 },    // Emerald Green
      grad3: { r: 19, g: 78, b: 74 },      // Deep Teal
      glow: { r: 52, g: 211, b: 153 }
    },
    purple: {
      // Section 3: SpecialtyDivisions (Amethyst Purple & Rose Pink)
      grad1: { r: 24, g: 12, b: 36 },
      grad2: { r: 168, g: 85, b: 247 },    // Purple
      grad3: { r: 253, g: 164, b: 189 },   // Rose pink
      glow: { r: 216, g: 180, b: 254 }
    },
    gold: {
      // Section 4: CtaBanner (Amber Gold & Crimson)
      grad1: { r: 28, g: 10, b: 10 },
      grad2: { r: 245, g: 158, b: 11 },     // Amber Gold
      grad3: { r: 136, g: 19, b: 55 },     // Deep Crimson
      glow: { r: 252, g: 211, b: 77 }
    }
  };

  const activeColors = themes[theme] || themes.aqua;

  // Helper function to linearly interpolate (lerp) values
  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId;
    let time = 0;
    let particles = [];
    let isVisible = false;
    let isScrolling = false;
    let scrollTimer;

    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { isScrolling = false; }, 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Responsive sizing inside parent container
    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      init3DSystem();
    };

    // 3D projection setups
    const init3DSystem = () => {
      particles = [];
      const count = canvas.width < 768 ? 35 : 65;

      // Lower Sphere: plexus net nodes
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 130 + Math.random() * 25;

        particles.push({
          x3d: radius * Math.sin(phi) * Math.cos(theta),
          y3d: radius * Math.sin(phi) * Math.sin(theta) + 30, // shift slightly down
          z3d: radius * Math.cos(phi),
          type: 'plexus',
          size: 1 + Math.random() * 1.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.015 + Math.random() * 0.015
        });
      }

      // Upper Dome: neural fiber boundary nodes
      const fiberCount = canvas.width < 768 ? 12 : 22;
      for (let i = 0; i < fiberCount; i++) {
        const theta = (i / fiberCount) * Math.PI * 2;
        const radius = 160 + Math.random() * 20;

        particles.push({
          x3d: radius * Math.cos(theta),
          y3d: -Math.abs(radius * Math.sin(theta)) - 5, // shift up
          z3d: (Math.random() - 0.5) * 100,
          type: 'fiber',
          size: 1.3,
          angle: theta
        });
      }

      // Ambient space dust
      const dustCount = canvas.width < 768 ? 20 : 45;
      for (let i = 0; i < dustCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          type: 'dust',
          size: 0.7 + Math.random() * 1.1
        });
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.targetX = e.clientX - rect.left;
      mouse.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.current.targetX = -1000;
      mouse.current.targetY = -1000;
    };

    window.addEventListener('resize', resize);
    if (canvas.parentElement) {
      canvas.parentElement.addEventListener('mousemove', handleMouseMove);
      canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);
    }

    resize();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) rafId = requestAnimationFrame(draw);
      },
      { threshold: 0.01 }
    );
    visibilityObserver.observe(canvas);

    // Render loop
    const draw = () => {
      time += 0.006;

      if (isScrolling) {
        rafId = isVisible ? requestAnimationFrame(draw) : null;
        return;
      }

      // Lerp mouse coordinates
      mouse.current.x = lerp(mouse.current.x, mouse.current.targetX, 0.06);
      mouse.current.y = lerp(mouse.current.y, mouse.current.targetY, 0.06);

      // Clear with background color depth (grad1)
      const c1 = activeColors.grad1;
      ctx.fillStyle = `rgb(${c1.r}, ${c1.g}, ${c1.b})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw glowing fluid mesh background gradient bubbles
      const bubbleCenterX = canvas.width * 0.68; // offset right
      const bubbleCenterY = canvas.height * 0.5;

      const c2 = activeColors.grad2;
      const c3 = activeColors.grad3;

      // Main vibrant cyan bubble
      const gradientRadial1 = ctx.createRadialGradient(
        bubbleCenterX + Math.sin(time * 0.5) * 80,
        bubbleCenterY + Math.cos(time * 0.4) * 60,
        40,
        bubbleCenterX,
        bubbleCenterY,
        Math.max(canvas.width, canvas.height) * 0.55
      );
      gradientRadial1.addColorStop(0, `rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.26)`);
      gradientRadial1.addColorStop(0.5, `rgba(${c3.r}, ${c3.g}, ${c3.b}, 0.1)`);
      gradientRadial1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradientRadial1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Secondary softer color bubble shifting around
      const gradientRadial2 = ctx.createRadialGradient(
        canvas.width * 0.22 + Math.cos(time * 0.35) * 100,
        canvas.height * 0.65 + Math.sin(time * 0.35) * 80,
        15,
        canvas.width * 0.22,
        canvas.height * 0.65,
        canvas.width * 0.38
      );
      gradientRadial2.addColorStop(0, `rgba(${c3.r}, ${c3.g}, ${c3.b}, 0.18)`);
      gradientRadial2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradientRadial2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Concentric Ripple Rings
      const orbX = canvas.width > 1024 ? canvas.width * 0.65 : canvas.width * 0.5;
      const orbY = canvas.height * 0.48;

      for (let r = 0; r < 4; r++) {
        const ringRad = ((time * 55 + r * 100) % 360);
        const ringOpacity = (360 - ringRad) / 360 * 0.08;

        ctx.beginPath();
        ctx.arc(orbX, orbY, ringRad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${ringOpacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Update and Project 3D Particles
      const glow = activeColors.glow;

      // 3D rotation angles
      const rotY = time * 0.45;
      const rotX = time * 0.28;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projectedPlexus = [];
      const projectedFibers = [];

      particles.forEach((p) => {
        if (p.type === 'dust') {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          // Magnetic drift towards mouse
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const force = (130 - dist) / 130;
            p.x -= dx * force * 0.045;
            p.y -= dy * force * 0.045;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.22)`;
          ctx.fill();
        } else {
          // 3D projections
          let x1 = p.x3d * cosY - p.z3d * sinY;
          let z1 = p.x3d * sinY + p.z3d * cosY;

          let y1 = p.y3d * cosX - z1 * sinX;
          let z2 = p.y3d * sinX + z1 * cosX;

          const fov = 360;
          const perspective = fov / (fov + z2);

          const projX = orbX + x1 * perspective;
          const projY = orbY + y1 * perspective;

          const projected = {
            x: projX,
            y: projY,
            z: z2,
            size: p.size * perspective,
            type: p.type
          };

          if (p.type === 'plexus') {
            projectedPlexus.push(projected);
          } else {
            projectedFibers.push(projected);
          }
        }
      });

      // Draw Plexus Lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedPlexus.length; i++) {
        const p1 = projectedPlexus[i];
        for (let j = i + 1; j < projectedPlexus.length; j++) {
          const p2 = projectedPlexus[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 72 * 72) {
            const dist = Math.sqrt(distSq);
            const alpha = (72 - dist) / 72 * 0.12 * (1 - p1.z / 500);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw Plexus Nodes
      projectedPlexus.forEach((p) => {
        const alpha = (1 - p.z / 360) * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${glow.r}, ${glow.g}, ${glow.b}, ${alpha})`;
        ctx.fill();
      });

      // Draw Glowing Spline Fibers (Upper Dome)
      projectedFibers.forEach((p) => {
        const ripple = Math.sin(time * 6 + p.x * 0.02) * 4.5;
        const controlX = (orbX + p.x) / 2 + ripple;
        const controlY = (orbY + p.y) / 2 - 20 - Math.abs(ripple);

        ctx.beginPath();
        ctx.moveTo(orbX, orbY - 10);
        ctx.quadraticCurveTo(controlX, controlY, p.x, p.y);
        ctx.strokeStyle = `rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.08)`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.5)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.1)`;
        ctx.fill();
      });

      // Shimmering Hub
      ctx.beginPath();
      ctx.arc(orbX, orbY - 10, 7 + Math.sin(time * 4) * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.32)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(orbX, orbY - 10, 18 + Math.sin(time * 4) * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.08)`;
      ctx.fill();

      rafId = isVisible ? requestAnimationFrame(draw) : null;
    };

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
      if (canvas.parentElement) {
        canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
        canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(rafId);
      visibilityObserver.disconnect();
    };
  }, [theme]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-slate-950">
      {/* Local high-resolution canvas resizing to its parent section bounds */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Pristine high-fashion Film Grain SVG Texture overlay locally */}
      <div className="absolute inset-0 w-full h-full film-grain opacity-[0.06] mix-blend-overlay pointer-events-none" />
    </div>
  );
}
