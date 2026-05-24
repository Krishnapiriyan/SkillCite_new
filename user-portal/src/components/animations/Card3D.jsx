import { useState, useRef } from 'react';

export default function Card3D({ children, className = '', maxTilt = 8 }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
  });
  const [shineStyle, setShineStyle] = useState({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
    transition: 'opacity 0.5s ease'
  });

  const onMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse relative X inside card
    const y = e.clientY - rect.top;  // Mouse relative Y inside card
    
    // Percent coordinates relative to center (-0.5 to 0.5)
    const px = x / rect.width;
    const py = y / rect.height;
    
    // Tilt calculations
    const rotateX = (py - 0.5) * -maxTilt;
    const rotateY = (px - 0.5) * maxTilt;

    // Apply interactive style (no transition lag during mouse movement)
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`,
      transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
    });

    // Update dynamic glass glare / shine layer coordinates
    setShineStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255, 255, 255, 0.22) 0%, transparent 60%)`,
      transition: 'opacity 0.1s ease'
    });
  };

  const onMouseLeave = () => {
    // Reset to flat default position with elegant smooth ease transition
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
    });
    setShineStyle({
      opacity: 0,
      background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
      transition: 'all 0.6s ease'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative overflow-hidden bg-primary-light ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 3D Inner Content container */}
      <div style={{ transform: 'translateZ(20px)' }} className="h-full w-full flex flex-col justify-between">
        {children}
      </div>

      {/* High-End Glass reflection/glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay z-20"
        style={shineStyle}
      />
    </div>
  );
}
