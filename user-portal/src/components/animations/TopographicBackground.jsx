import React, { useEffect, useRef } from 'react';

export default function TopographicBackground() {
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

    // Mouse tracking
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.parentElement.addEventListener('mousemove', handleMouseMove);

    // Scroll-aware performance mode
    let isScrolling = false;
    let scrollTimer;
    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth cursor-chasing hill for topographic cursor ripple
    let mouseHill = { x: -1000, y: -1000 };

    // Harmonic noise function (incredibly fast, simplex-like using sine combinations)
    const noise = (x, y, t) => {
      return (
        Math.sin(x * 0.004 + t * 0.15) * 0.35 +
        Math.cos(y * 0.005 - t * 0.1) * 0.3 +
        Math.sin((x + y) * 0.002 + t * 0.08) * 0.25 +
        Math.cos(x * 0.008 - y * 0.006 + t * 0.2) * 0.1
      );
    };

    // Static organic hills positioned proportionally across the section
    const staticHills = [
      { rx: 0.15, ry: 0.25, baseR: 120, rings: 5 },
      { rx: 0.85, ry: 0.60, baseR: 140, rings: 6 },
      { rx: 0.40, ry: 0.80, baseR: 100, rings: 4 },
    ];

    // Floating dust particles
    const particles = Array.from({ length: 15 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: 1.5 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.3,
    }));

    const animate = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Sand background
      ctx.fillStyle = '#F7F5F0';
      ctx.fillRect(0, 0, W, H);

      // Ambient mouse glow (skip heavy radial gradients during active scroll)
      if (!isScrolling && mouse.x > 0) {
        const glowR = 280;
        const gGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowR);
        gGrad.addColorStop(0, 'rgba(215, 198, 172, 0.20)');
        gGrad.addColorStop(1, 'rgba(215, 198, 172, 0)');
        ctx.fillStyle = gGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // Smoothly update the dynamic cursor-chasing hill
      if (mouse.x > 0) {
        if (mouseHill.x < 0) {
          mouseHill.x = mouse.x;
          mouseHill.y = mouse.y;
        } else {
          mouseHill.x += (mouse.x - mouseHill.x) * 0.12;
          mouseHill.y += (mouse.y - mouseHill.y) * 0.12;
        }
      }

      // === Render Static Concentric Hills ===
      staticHills.forEach(hill => {
        const cx = hill.rx * W;
        const cy = hill.ry * H;

        // Apply mouse-repelling drift for organic interaction
        let activeCx = cx;
        let activeCy = cy;
        if (!isScrolling && mouse.x > 0) {
          const dx = cx - mouse.x;
          const dy = cy - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 260) {
            const push = (1 - dist / 260) * 25;
            activeCx += (dx / (dist + 0.001)) * push;
            activeCy += (dy / (dist + 0.001)) * push;
          }
        }

        // Draw nested loops (contour levels of the hill)
        for (let j = 1; j <= hill.rings; j++) {
          const rBase = (j / hill.rings) * hill.baseR;
          const points = [];
          const numSegs = 24;

          for (let k = 0; k <= numSegs; k++) {
            const angle = (k / numSegs) * Math.PI * 2;
            const rx = rBase * Math.cos(angle);
            const ry = rBase * Math.sin(angle);
            const px = activeCx + rx;
            const py = activeCy + ry;

            // Deform radius with noise for organic ridge contour look
            const def = noise(px, py, time) * (rBase * 0.28);
            const rDistorted = rBase + def;
            
            points.push({
              x: activeCx + rDistorted * Math.cos(angle),
              y: activeCy + rDistorted * Math.sin(angle)
            });
          }

          // Draw the closed loop path
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 0; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i+1].x) / 2;
            const yc = (points[i].y + points[i+1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }
          ctx.closePath();

          const alpha = 0.06 + (j % 2 === 0 ? 0.03 : 0);
          ctx.strokeStyle = `rgba(140, 125, 105, ${alpha})`;
          ctx.lineWidth = j === hill.rings ? 1.4 : 0.8;
          ctx.stroke();
        }
      });

      // === Render Dynamic Mouse Hill ===
      if (mouseHill.x > 0 && !isScrolling) {
        const rings = 4;
        const maxR = 80;
        for (let j = 1; j <= rings; j++) {
          const rBase = (j / rings) * maxR;
          const points = [];
          const numSegs = 20;

          for (let k = 0; k <= numSegs; k++) {
            const angle = (k / numSegs) * Math.PI * 2;
            const px = mouseHill.x + rBase * Math.cos(angle);
            const py = mouseHill.y + rBase * Math.sin(angle);
            const def = noise(px, py, time * 1.5) * (rBase * 0.2);
            const rDistorted = rBase + def;

            points.push({
              x: mouseHill.x + rDistorted * Math.cos(angle),
              y: mouseHill.y + rDistorted * Math.sin(angle)
            });
          }

          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 0; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i+1].x) / 2;
            const yc = (points[i].y + points[i+1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }
          ctx.closePath();

          const alpha = 0.09 * (1 - j / (rings + 1));
          ctx.strokeStyle = `rgba(165, 140, 100, ${alpha})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }

      // === Render Horizontal Contour Waves ===
      const numLines = 8;
      for (let l = 0; l < numLines; l++) {
        const yBase = ((l + 0.5) / numLines) * H;
        const points = [];
        const numPts = 18;

        for (let i = 0; i <= numPts; i++) {
          const x = (i / numPts) * W;
          let y = yBase + noise(x, yBase, time) * 70;

          // Mouse warp distortion — push contours around mouse to create 3D terrain
          if (!isScrolling && mouse.x > 0) {
            const dx = x - mouse.x;
            const dy = yBase - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 240) {
              const force = Math.pow(1 - dist / 240, 1.8);
              y += (dy >= 0 ? 1 : -1) * force * 50;
            }
          }

          points.push({ x, y });
        }

        // Draw horizontal wave using smooth quadratic curves
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i+1].x) / 2;
          const yc = (points[i].y + points[i+1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(W, points[points.length-1].y);

        const alpha = 0.07 + (l % 3 === 0 ? 0.04 : 0);
        ctx.strokeStyle = `rgba(140, 125, 105, ${alpha})`;
        ctx.lineWidth = l % 3 === 0 ? 1.3 : 0.8;
        ctx.stroke();
      }

      // === Floating particles ===
      particles.forEach(p => {
        p.x += p.vx / W;
        p.y += p.vy / H;

        // Wrap boundaries
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        const sx = p.x * W;
        const sy = p.y * H;

        const pGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, p.radius * 3);
        pGrad.addColorStop(0, `rgba(180, 155, 120, ${p.opacity})`);
        pGrad.addColorStop(1, 'rgba(180, 155, 120, 0)');
        ctx.beginPath();
        ctx.arc(sx, sy, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = pGrad;
        ctx.fill();
      });

      time += 0.007;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
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
