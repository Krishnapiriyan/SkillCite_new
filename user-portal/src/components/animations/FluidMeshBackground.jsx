import React, { useEffect, useRef } from 'react';

export default function FluidMeshBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Pale Warm Mauve Background Base
      ctx.fillStyle = '#F4EFEF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create a few moving radial gradients to simulate a fluid mesh
      const createGradient = (x, y, r, color1, color2) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
      };

      // Gradient 1 (Top Left)
      const x1 = Math.sin(time * 0.5) * 200 + canvas.width * 0.3;
      const y1 = Math.cos(time * 0.3) * 150 + canvas.height * 0.3;
      ctx.fillStyle = createGradient(x1, y1, canvas.width * 0.6, 'rgba(235, 215, 220, 0.6)', 'rgba(235, 215, 220, 0)');
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient 2 (Bottom Right)
      const x2 = Math.cos(time * 0.4) * 250 + canvas.width * 0.7;
      const y2 = Math.sin(time * 0.6) * 200 + canvas.height * 0.8;
      ctx.fillStyle = createGradient(x2, y2, canvas.width * 0.7, 'rgba(220, 210, 225, 0.7)', 'rgba(220, 210, 225, 0)');
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Gradient 3 (Center subtle sweep)
      const x3 = Math.sin(time * 0.2) * 300 + canvas.width * 0.5;
      const y3 = Math.cos(time * 0.2) * 300 + canvas.height * 0.5;
      ctx.fillStyle = createGradient(x3, y3, canvas.width * 0.8, 'rgba(240, 235, 245, 0.5)', 'rgba(240, 235, 245, 0)');
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
