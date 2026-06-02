import React, { useEffect, useRef } from 'react';

export default function FocusRingsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking — rings subtly follow cursor
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    let target = { x: canvas.width / 2, y: canvas.height / 2 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
    };
    canvas.parentElement.addEventListener('mousemove', handleMouseMove);

    // Ring wave pool — multiple independent ring groups
    const rings = [
      { phase: 0,    speed: 0.012, color: 'rgba(200, 170, 90, {a})',  maxR: 0.85, lineW: 1.5 },
      { phase: 0.4,  speed: 0.009, color: 'rgba(210, 185, 120, {a})', maxR: 0.7,  lineW: 1.0 },
      { phase: 0.75, speed: 0.015, color: 'rgba(190, 155, 70, {a})',  maxR: 0.95, lineW: 0.8 },
      { phase: 0.2,  speed: 0.007, color: 'rgba(220, 200, 150, {a})', maxR: 0.60, lineW: 2.0 },
    ];
    const NUM_WAVES = 5; // rings per group

    // Floating dust motes
    const motes = Array.from({ length: 22 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2.5,
      speed: 0.0003 + Math.random() * 0.0004,
      angle: Math.random() * Math.PI * 2,
      opacity: 0.15 + Math.random() * 0.25,
    }));

    // Gold shimmer arcs — short glowing arcs that appear and fade
    const arcs = [];
    const trySpawnArc = () => {
      if (arcs.length < 8 && Math.random() > 0.97) {
        const centerR = (0.2 + Math.random() * 0.5) * Math.min(canvas.width, canvas.height);
        arcs.push({
          radius: centerR,
          startAngle: Math.random() * Math.PI * 2,
          arcLen: (0.15 + Math.random() * 0.35) * Math.PI,
          life: 1,
          decay: 0.008 + Math.random() * 0.01,
          lineW: 1 + Math.random() * 2,
        });
      }
    };

    const animate = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Soft Champagne background
      ctx.fillStyle = '#F8F6F0';
      ctx.fillRect(0, 0, W, H);

      // Smoothly ease the center point toward cursor
      mouse.x += (target.x - mouse.x) * 0.18;
      mouse.y += (target.y - mouse.y) * 0.18;

      const cx = mouse.x;
      const cy = mouse.y;

      // Deep ambient radial glow around mouse center
      const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.6);
      ambient.addColorStop(0, 'rgba(230, 210, 160, 0.18)');
      ambient.addColorStop(0.5, 'rgba(230, 210, 160, 0.06)');
      ambient.addColorStop(1, 'rgba(230, 210, 160, 0)');
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, W, H);

      // === Concentric pulsing rings ===
      rings.forEach(ring => {
        const maxRadius = ring.maxR * Math.max(W, H);
        for (let i = 0; i < NUM_WAVES; i++) {
          const wavePhase = (ring.phase + i / NUM_WAVES);
          let radius = ((time * ring.speed + wavePhase) % 1) * maxRadius;
          const progress = radius / maxRadius;

          // Opacity: fade in quickly, hold, fade out near edge
          let alpha;
          if (progress < 0.15) {
            alpha = progress / 0.15;
          } else {
            alpha = Math.max(0, 1 - (progress - 0.15) / 0.85);
          }
          alpha *= 0.22;

          const colorStr = ring.color.replace('{a}', alpha.toFixed(3));
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = colorStr;
          ctx.lineWidth = ring.lineW * (1 - progress * 0.5);
          ctx.stroke();
        }
      });

      // === Shimmer arcs ===
      trySpawnArc();
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];

        const grad = ctx.createConicalGradient
          ? null // not standard; skip
          : null;

        ctx.beginPath();
        ctx.arc(cx, cy, arc.radius, arc.startAngle, arc.startAngle + arc.arcLen);
        const alpha = arc.life * 0.55;
        ctx.strokeStyle = `rgba(218, 165, 50, ${alpha})`;
        ctx.lineWidth = arc.lineW;
        ctx.stroke();

        arc.startAngle += 0.004;
        arc.life -= arc.decay;
        if (arc.life <= 0) arcs.splice(i, 1);
      }

      // === Floating dust motes ===
      motes.forEach(m => {
        m.angle += m.speed * 2 * Math.PI;
        // Slow orbital drift
        const orbitR = 0.02 * Math.min(W, H);
        const sx = m.x * W + Math.cos(m.angle) * orbitR;
        const sy = m.y * H + Math.sin(m.angle) * orbitR;

        const mGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, m.r * 4);
        mGrad.addColorStop(0, `rgba(200, 175, 100, ${m.opacity})`);
        mGrad.addColorStop(1, 'rgba(200, 175, 100, 0)');
        ctx.beginPath();
        ctx.arc(sx, sy, m.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = mGrad;
        ctx.fill();
      });

      // Crisp center dot
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
      centerGlow.addColorStop(0, 'rgba(218, 165, 50, 0.45)');
      centerGlow.addColorStop(1, 'rgba(218, 165, 50, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();

      time += 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ willChange: 'transform' }}
    />
  );
}
