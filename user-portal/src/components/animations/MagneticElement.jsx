import { useState, useRef } from 'react';

export default function MagneticElement({ children, strength = 0.35, range = 60, className = '' }) {
  const containerRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'translate3d(0px, 0px, 0px)',
    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
  });

  const onMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate center coordinate of container
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;

    // Distance between mouse pointer and center
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Apply magnetic pull if pointer is within distance range
    if (dist < range) {
      // Pull proportional to distance
      const pullX = dx * strength;
      const pullY = dy * strength;

      setStyle({
        transform: `translate3d(${pullX}px, ${pullY}px, 0px)`,
        // Low transition duration during capture for instant feedback
        transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
      });
    } else {
      resetTransform();
    }
  };

  const resetTransform = () => {
    // Restore element back to origin with elegant spring-like ease transition
    setStyle({
      transform: 'translate3d(0px, 0px, 0px)',
      transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={resetTransform}
      className={`inline-block ${className}`}
      style={{ willChange: 'transform' }}
    >
      <div style={style}>
        {children}
      </div>
    </div>
  );
}
