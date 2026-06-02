import React, { useEffect, useRef } from 'react';

export default function HoneycombBackground() {
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
      initGrid();
    };

    window.addEventListener('resize', resize);

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
      scrollTimer = setTimeout(() => { isScrolling = false; }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hexagon parameters - well-proportioned for a clean, highly structured honeycomb look
    const hexRadius = 42;
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;
    const hexGrid = [];

    const initGrid = () => {
      hexGrid.length = 0;
      const cols = Math.ceil(canvas.width / (hexWidth * 0.75)) + 2;
      const rows = Math.ceil(canvas.height / hexHeight) + 2;

      for (let c = -1; c < cols; c++) {
        for (let r = -1; r < rows; r++) {
          const x = c * hexWidth * 0.75;
          const y = r * hexHeight + (c % 2 === 0 ? 0 : hexHeight / 2);

          hexGrid.push({
            x, y,
            c, r,
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.005 + Math.random() * 0.005,
            baseOpacity: 0.06 + Math.random() * 0.06,
          });
        }
      }
    };

    initGrid();
    resize();

    const drawHexagonPath = (x, y, radius) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i);
        const xPos = x + radius * Math.cos(angle);
        const yPos = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.closePath();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Light Stone / Greige Background
      ctx.fillStyle = '#F1EFEA';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ambient mouse glow
      if (!isScrolling && mouse.x > 0) {
        const glowR = 260;
        const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowR);
        glowGrad.addColorStop(0, 'rgba(235, 222, 202, 0.22)');
        glowGrad.addColorStop(1, 'rgba(235, 222, 202, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      hexGrid.forEach(hex => {
        const pulse = (Math.sin(time * hex.pulseSpeed * 80 + hex.phase) + 1) / 2;
        
        let mouseInfluence = 0;
        if (!isScrolling && mouse.x > 0) {
          const dx = hex.x - mouse.x;
          const dy = hex.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          mouseInfluence = Math.max(0, 1 - dist / 180);
        }

        // Crisp, distinct opacity values for a clear look
        const fillOpacity = hex.baseOpacity + pulse * 0.12 + mouseInfluence * 0.28;
        const strokeOpacity = 0.24 + mouseInfluence * 0.45;

        // Clean, elegant warm greige fill
        const r = 228;
        const g = 221;
        const b = 210;

        // Draw crisp hexagon base fill
        drawHexagonPath(hex.x, hex.y, hexRadius - 1.5);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fillOpacity})`;
        ctx.fill();

        // Draw crisp hexagon outline boundary (1px sharp strokes for clearly visible design)
        ctx.strokeStyle = `rgba(165, 145, 120, ${strokeOpacity})`;
        ctx.lineWidth = 0.95;
        ctx.stroke();

        // High-precision interactive blueprint wireframe within active cells
        if (mouseInfluence > 0.45) {
          drawHexagonPath(hex.x, hex.y, hexRadius * 0.65);
          ctx.strokeStyle = `rgba(155, 125, 80, ${mouseInfluence * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          const innerGlow = ctx.createRadialGradient(hex.x, hex.y, 0, hex.x, hex.y, hexRadius * 0.6);
          innerGlow.addColorStop(0, `rgba(255, 250, 240, ${mouseInfluence * 0.30})`);
          innerGlow.addColorStop(1, 'rgba(255, 250, 240, 0)');
          ctx.fillStyle = innerGlow;
          ctx.fill();
        }
      });

      time += 0.8; // Butter-smooth organic pulse speed
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
