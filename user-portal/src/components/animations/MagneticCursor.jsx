import { useEffect, useRef } from 'react';

export default function MagneticCursor() {
  const cursorRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move);

    let raf;
    const lerp = (a, b, n) => a + (b - a) * n;
    const animate = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.08);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.08);
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${pos.current.x - 12}px, ${pos.current.y - 12}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // Magnetic expand on hoverable elements
    const addHover = (el) => {
      el.addEventListener('mouseenter', () => cursorRef.current?.classList.add('expanded'));
      el.addEventListener('mouseleave', () => cursorRef.current?.classList.remove('expanded'));
    };
    
    // We run a mutation observer or just periodic query to catch dynamically loaded buttons
    const selectAndAdd = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(addHover);
    };
    selectAndAdd();
    const interval = setInterval(selectAndAdd, 1000);

    return () => { 
      window.removeEventListener('mousemove', move); 
      cancelAnimationFrame(raf); 
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-purple-600
                 pointer-events-none z-[9999] transition-[width,height] duration-200 hidden md:block
                 [&.expanded]:w-12 [&.expanded]:h-12 [&.expanded]:border-purple-400 [&.expanded]:bg-purple-600/5"
    />
  );
}
