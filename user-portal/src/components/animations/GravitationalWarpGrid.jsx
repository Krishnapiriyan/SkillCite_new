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
    const cellSize = 50; // Distance between grid lines
    const repulsionRadius = 160;
    const repulsionForce = 45; // Intensity of the bend
    const springDampening = 0.88; // Friction
    const springForce = 0.04; // Spring pulling back to original position

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

      // 1. Calculate physics updates for all grid nodes
      const mx = mouse.current.x;
      const my = mouse.current.y;

      gridPoints.forEach(p => {
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
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.055)';
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
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.055)';
        ctx.stroke();
      }

      // 3. Render tiny glowing node points at intersections
      gridPoints.forEach(p => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Highlight nodes closer to cursor
        if (dist < repulsionRadius * 0.7) {
          const alpha = (1 - dist / (repulsionRadius * 0.7)) * 0.35;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
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
