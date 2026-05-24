import { useEffect, useRef, useState } from 'react';

export default function LiquidCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  
  // Real-time mouse coordinates
  const mouse = useRef({ x: 0, y: 0 });
  // Lerped/Spring coordinates for trailing outer liquid circle
  const trail = useRef({ x: 0, y: 0 });
  
  // Speed and angle calculation variables
  const lastMouse = useRef({ x: 0, y: 0 });
  const speed = useRef(0);
  const angle = useRef(0);
  
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    
    window.addEventListener('mousemove', onMouseMove);

    let rafId;
    
    const lerp = (a, b, n) => a + (b - a) * n;

    const updateCursor = () => {
      // Calculate velocity/speed and angle of movement
      const dx = mouse.current.x - lastMouse.current.x;
      const dy = mouse.current.y - lastMouse.current.y;
      
      // Target angle
      const targetAngle = Math.atan2(dy, dx);
      angle.current = lerp(angle.current, targetAngle, 0.1);
      
      // Velocity with caps
      const targetSpeed = Math.min(Math.sqrt(dx * dx + dy * dy), 120);
      speed.current = lerp(speed.current, targetSpeed, 0.08);

      // Smooth lag trailing coordinates
      trail.current.x = lerp(trail.current.x, mouse.current.x, 0.15);
      trail.current.y = lerp(trail.current.y, mouse.current.y, 0.15);

      // Update inner sharp dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      // Update outer liquid envelope
      if (cursorRef.current) {
        // Stretch based on velocity, shrink height slightly when stretching width
        const scaleX = 1 + (speed.current * 0.006);
        const scaleY = 1 - (speed.current * 0.003);
        const rotation = angle.current * (180 / Math.PI); // Convert to degrees
        
        cursorRef.current.style.transform = 
          `translate3d(${trail.current.x}px, ${trail.current.y}px, 0) ` +
          `rotate(${rotation}deg) ` +
          `scale(${scaleX}, ${scaleY})`;
      }

      lastMouse.current.x = mouse.current.x;
      lastMouse.current.y = mouse.current.y;
      
      rafId = requestAnimationFrame(updateCursor);
    };

    rafId = requestAnimationFrame(updateCursor);

    // Mouse interactive events
    const addHoverListeners = (el) => {
      const handleMouseEnter = () => {
        setIsHovered(true);
        const cursorLabel = el.getAttribute('data-cursor-text');
        if (cursorLabel) setHoverText(cursorLabel);
      };
      
      const handleMouseLeave = () => {
        setIsHovered(false);
        setHoverText('');
      };
      
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    };

    // Keep active list of listeners
    let cleanups = [];

    const selectElements = () => {
      cleanups.forEach(c => c());
      cleanups = [];
      const targets = document.querySelectorAll('a, button, [data-cursor], input, textarea, select');
      targets.forEach(target => {
        const cleanup = addHoverListeners(target);
        cleanups.push(cleanup);
      });
    };

    selectElements();
    const selectInterval = setInterval(selectElements, 1200);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      clearInterval(selectInterval);
      cleanups.forEach(c => c());
    };
  }, []);

  return (
    <>
      {/* SVG Liquid Filter Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" style={{ visibility: 'hidden' }}>
        <defs>
          <filter id="liquid-goo">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feColorMatrix 
              type="matrix" 
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 18 -7" 
              result="goo" 
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Trailing Outer Liquid Blob */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-blue-600/60
                   pointer-events-none z-[9999] transition-[background-color,border-color,width,height] duration-300 hidden md:block select-none
                   ${isHovered ? 'bg-blue-600/10 border-blue-500 w-16 h-16 -ml-8 -mt-8 scale-110' : ''}`}
        style={{
          // Set transform-origin to center so rotation and scaling behave organically
          transformOrigin: 'center center',
          filter: 'url(#liquid-goo)',
        }}
      >
        {/* Secondary liquid droplets that merge and stretch when moving */}
        <div className="absolute inset-1 rounded-full bg-blue-600/5 mix-blend-screen" />
        {isHovered && hoverText && (
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-blue-600 uppercase tracking-widest animate-fade-in">
            {hoverText}
          </div>
        )}
      </div>

      {/* Precision Inner Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full bg-blue-600
                   pointer-events-none z-[10000] transition-transform duration-75 ease-out hidden md:block select-none
                   ${isHovered ? 'scale-75 bg-blue-400' : ''}`}
        style={{ transformOrigin: 'center center' }}
      />
    </>
  );
}
