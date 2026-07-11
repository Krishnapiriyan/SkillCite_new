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
            baseOpacity: 0.03, // Low static baseline opacity to keep it calm and elegant
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

      // Even darker Premium Stone / Greige Background
      ctx.fillStyle = '#CCC6B7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Slow ambient breathing swell (12-second cycle)
      const ambientSwell = (Math.sin(time * 0.005) + 1) / 2;

      // Ambient mouse glow
      if (!isScrolling && mouse.x > 0) {
        const glowR = 260;
        const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowR);
        glowGrad.addColorStop(0, 'rgba(195, 182, 162, 0.25)');
        glowGrad.addColorStop(1, 'rgba(195, 182, 162, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      hexGrid.forEach(hex => {
        let mouseInfluence = 0;
        if (!isScrolling && mouse.x > 0) {
          const dx = hex.x - mouse.x;
          const dy = hex.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          mouseInfluence = Math.max(0, 1 - dist / 220); // Expanded range slightly for smoother fade-in
        }

        // Calm, distinct opacity values to protect the eyes
        const fillOpacity = hex.baseOpacity + ambientSwell * 0.015 + mouseInfluence * 0.18;
        const strokeOpacity = 0.08 + mouseInfluence * 0.22;

        // Clean, elegant warm greige fill (more darker)
        const r = 195;
        const g = 188;
        const b = 173;

        // Draw hexagon base fill
        drawHexagonPath(hex.x, hex.y, hexRadius - 1.5);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fillOpacity})`;
        ctx.fill();

        // Draw outline boundary (more darker)
        ctx.strokeStyle = `rgba(125, 105, 80, ${strokeOpacity})`;
        ctx.lineWidth = 0.95;
        ctx.stroke();

        // High-precision interactive blueprint wireframe within hovered cells
        if (mouseInfluence > 0.15) {
          // Draw inner concentric hexagon blueprint line
          drawHexagonPath(hex.x, hex.y, hexRadius * 0.65);
          ctx.strokeStyle = `rgba(125, 105, 80, ${mouseInfluence * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Draw small center point blueprint dot
          ctx.beginPath();
          ctx.arc(hex.x, hex.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(125, 105, 80, ${mouseInfluence * 0.35})`;
          ctx.fill();
        }

        // Add soft radial center glow directly under the cursor focus
        if (mouseInfluence > 0.45) {
          const innerGlow = ctx.createRadialGradient(hex.x, hex.y, 0, hex.x, hex.y, hexRadius * 0.6);
          innerGlow.addColorStop(0, `rgba(255, 255, 255, ${mouseInfluence * 0.30})`);
          innerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = innerGlow;
          ctx.fill();
        }
      });

      time += 0.8; // Butter-smooth organic speed
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
