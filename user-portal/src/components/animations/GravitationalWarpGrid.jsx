import { useEffect, useRef } from 'react';

export default function GravitationalWarpGrid() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const active = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId;
    let gridPoints = [];
    let time = 0;
    const cellSize = 42;
    const repulsionRadius = 200;
    const repulsionForce = 55;
    const springDampening = 0.86;
    const springForce = 0.045;
    const ambientDrift = 3.5;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initGrid();
    };

    const initGrid = () => {
      gridPoints = [];
      const cols = Math.ceil(canvas.width / cellSize) + 1;
      const rows = Math.ceil(canvas.height / cellSize) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellSize;
          const y = r * cellSize;
          gridPoints.push({
            originX: x,
            originY: y,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            row: r,
            col: c
          });
        }
      }
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      active.current = true;
    };

    const onMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
      active.current = false;
    };

    window.addEventListener('resize', resize);
    canvas.parentElement.addEventListener('mousemove', onMouseMove);
    canvas.parentElement.addEventListener('mouseleave', onMouseLeave);
    
    // Call once to initialize size
    resize();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.012;

      const mx = mouse.current.x;
      const my = mouse.current.y;

      gridPoints.forEach((p) => {
        // Continuous ambient wave so grid and blue nodes always move
        const waveX = Math.sin(time + p.col * 0.35 + p.row * 0.2) * ambientDrift;
        const waveY = Math.cos(time * 0.9 + p.row * 0.4) * ambientDrift;
        p.vx += waveX * 0.02;
        p.vy += waveY * 0.02;

        if (active.current) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repulsionRadius) {
            // Push force falls off with distance
            const force = (repulsionRadius - dist) / repulsionRadius;
            const angle = Math.atan2(dy, dx);
            const targetX = Math.cos(angle) * force * repulsionForce;
            const targetY = Math.sin(angle) * force * repulsionForce;
            
            p.vx += targetX;
            p.vy += targetY;
          }
        }

        // Spring pulling back to center
        const springX = (p.originX - p.x) * springForce;
        const springY = (p.originY - p.y) * springForce;

        p.vx += springX;
        p.vy += springY;

        // Dampen velocity and update coordinate position
        p.vx *= springDampening;
        p.vy *= springDampening;
        p.x += p.vx;
        p.y += p.vy;
      });

      // 2. Render distorted lines connecting the grid nodes
      const cols = Math.ceil(canvas.width / cellSize) + 1;
      const rows = Math.ceil(canvas.height / cellSize) + 1;

      ctx.lineWidth = 0.6;

      // Draw horizontal lines connecting nodes in each row
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          if (idx >= gridPoints.length) break;
          const p = gridPoints[idx];

          if (c === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            // Use quadratic curves or bezier curves for liquid smoothness!
            const prevP = gridPoints[idx - 1];
            const xc = (p.x + prevP.x) / 2;
            const yc = (p.y + prevP.y) / 2;
            ctx.quadraticCurveTo(prevP.x, prevP.y, xc, yc);
          }
        }
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.09)';
        ctx.stroke();
      }

      // Draw vertical lines connecting nodes in each column
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const idx = r * cols + c;
          if (idx >= gridPoints.length) break;
          const p = gridPoints[idx];

          if (r === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            const prevP = gridPoints[idx - cols];
            const xc = (p.x + prevP.x) / 2;
            const yc = (p.y + prevP.y) / 2;
            ctx.quadraticCurveTo(prevP.x, prevP.y, xc, yc);
          }
        }
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.09)';
        ctx.stroke();
      }

      // Glowing blue grid intersection points (always visible, brighter near cursor)
      gridPoints.forEach((p) => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nearCursor = dist < repulsionRadius * 0.85;
        const baseAlpha = 0.18 + Math.sin(time * 2 + p.col * 0.5) * 0.06;
        const alpha = nearCursor
          ? baseAlpha + (1 - dist / (repulsionRadius * 0.85)) * 0.55
          : baseAlpha;
        const radius = nearCursor ? 2.2 : 1.4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.fill();

        if (nearCursor || (p.col + p.row) % 3 === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.2})`;
          ctx.fill();
        }
      });

      rafId = requestAnimationFrame(drawGrid);
    };

    rafId = requestAnimationFrame(drawGrid);

    return () => {
      window.removeEventListener('resize', resize);
      if (canvas && canvas.parentElement) {
        canvas.parentElement.removeEventListener('mousemove', onMouseMove);
        canvas.parentElement.removeEventListener('mouseleave', onMouseLeave);
      }
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    />
  );
}
