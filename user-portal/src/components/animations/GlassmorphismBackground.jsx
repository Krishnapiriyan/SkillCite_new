import React, { useEffect, useRef } from 'react';

export default function GlassmorphismBackground() {
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

    // Floating shapes
    const shapes = Array.from({ length: 6 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 150 + 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: Math.random() > 0.5 ? 'rgba(180, 195, 185, 0.4)' : 'rgba(210, 215, 205, 0.5)', // Sage and Alabaster tones
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Light Sage Background
      ctx.fillStyle = '#F0F2ED';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update shapes
      shapes.forEach(shape => {
        shape.x += shape.vx;
        shape.y += shape.vy;

        // Bounce off walls
        if (shape.x < -shape.radius || shape.x > canvas.width + shape.radius) shape.vx *= -1;
        if (shape.y < -shape.radius || shape.y > canvas.height + shape.radius) shape.vy *= -1;

        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fillStyle = shape.color;
        
        // Add a soft blur effect directly to the context if supported, otherwise rely on CSS backdrop-blur
        ctx.shadowColor = shape.color;
        ctx.shadowBlur = 40;
        
        ctx.fill();
        
        // Reset shadow for next shape
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />
      {/* CSS overlay for frosted glass effect over the canvas */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none backdrop-blur-[40px] bg-white/10" />
    </>
  );
}
