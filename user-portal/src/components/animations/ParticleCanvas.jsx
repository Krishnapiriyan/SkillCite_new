import { useEffect, useRef } from 'react';

const PRESETS = {
  normal: {
    particleCount: 60,
    speed: 0.4,
    maxRadius: 2,
    minRadius: 1,
    opacityMin: 0.1,
    opacityMax: 0.5,
    linkDistance: 100,
    canvasOpacity: 'opacity-40',
  },
  high: {
    particleCount: 90,
    speed: 0.85,
    maxRadius: 3.5,
    minRadius: 1.2,
    opacityMin: 0.25,
    opacityMax: 0.85,
    linkDistance: 150,
    canvasOpacity: 'opacity-70',
  },
};

export default function ParticleCanvas({ intensity = 'normal' }) {
  const canvasRef = useRef(null);
  const config = PRESETS[intensity] || PRESETS.normal;

  useEffect(() => {
    const cfg = PRESETS[intensity] || PRESETS.normal;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let isVisible = false;
    let isScrolling = false;
    let scrollTimer;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { isScrolling = false; }, 120);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        const s = cfg.speed;
        this.vx = (Math.random() - 0.5) * s;
        this.vy = (Math.random() - 0.5) * s;
        this.radius =
          Math.random() * (cfg.maxRadius - cfg.minRadius) + cfg.minRadius;
        this.alpha =
          Math.random() * (cfg.opacityMax - cfg.opacityMin) + cfg.opacityMin;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        const pulseAlpha = this.alpha * (0.75 + 0.25 * Math.sin(this.pulse));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${pulseAlpha})`;
        ctx.fill();

        // Soft glow on larger particles
        if (this.radius > 2) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${pulseAlpha * 0.15})`;
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < cfg.particleCount; i++) {
      particles.push(new Particle());
    }

    const linkDistSq = cfg.linkDistance * cfg.linkDistance;

    const animate = () => {
      if (isScrolling) {
        animationFrameId = isVisible ? requestAnimationFrame(animate) : null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < linkDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.22 * (1 - dist / cfg.linkDistance)})`;
            ctx.lineWidth = intensity === 'high' ? 0.8 : 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = isVisible ? requestAnimationFrame(animate) : null;
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.01 }
    );
    visibilityObserver.observe(canvas);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${config.canvasOpacity}`}
    />
  );
}
