import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Custom Decrypting/Glitch Text hook
function useDecryptText(targetText, active = false) {
  const [displayText, setDisplayText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*//[]{}<>_';

  useEffect(() => {
    if (!active) {
      setDisplayText('');
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iterations) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iterations >= targetText.length) {
        clearInterval(interval);
      }
      iterations += 1 / 3; // Decrypt 1 character every 3 ticks for smooth slow morph
    }, 32);

    return () => clearInterval(interval);
  }, [targetText, active]);

  return displayText;
}

export default function BlueyardTransitionPortal({
  nextSectionTitle = "PROCESS FLOW",
  nextSectionIndex = "01",
  neonColor = "blue", // 'blue' | 'purple' | 'gold'
  fromBg = "rgb(15 23 42)", // Tailwind slate-900 base
  toBg = "rgb(9 11 17)"
}) {
  const portalRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Set up scroll tracking for pure scroll-linked micro-animations
  const { scrollYProgress } = useScroll({
    target: portalRef,
    offset: ["start end", "end start"]
  });

  // Cube scaling and rotation scroll-link mapping
  const cubeScale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.65, 1.15, 0.75]);
  const cubeYRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.8], [0, 1, 1, 0]);
  const gridPathLength = useTransform(scrollYProgress, [0.05, 0.5], [0, 1]);

  // Curtain split reveal mask mapping: splits clipPath vertically in the center
  // polygon(0 0, 100% 0, 100% 100%, 0 100%) -> splits to left/right halves
  const curtainLeftWidth = useTransform(scrollYProgress, [0.6, 0.95], ["50%", "0%"]);
  const curtainRightWidth = useTransform(scrollYProgress, [0.6, 0.95], ["50%", "0%"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (portalRef.current) {
      observer.observe(portalRef.current);
    }

    return () => {
      if (portalRef.current) observer.unobserve(portalRef.current);
    };
  }, []);

  const rawReadoutText = `DISPATCHING UNIT ${nextSectionIndex} // LINKING PROTOCOL: ${nextSectionTitle}`;
  const decryptedText = useDecryptText(rawReadoutText, isIntersecting);

  // Neon color classes for the cube faces
  const getCubeNeonClass = () => {
    if (neonColor === 'purple') return 'cube-face-neon-purple';
    if (neonColor === 'gold') return 'cube-face-neon-gold';
    return 'cube-face-neon-blue';
  };

  const neonGlowColor = {
    blue: 'rgba(59, 130, 246, 0.65)',
    purple: 'rgba(168, 85, 247, 0.65)',
    gold: 'rgba(245, 158, 11, 0.65)'
  }[neonColor];

  // Marquee list contents
  const marqueeItems = Array(12).fill(
    `SKILLCITE SYSTEM LOADED // CONNECTING ${nextSectionTitle} [U-${nextSectionIndex}]`
  );

  return (
    <div
      ref={portalRef}
      className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden select-none border-y border-white/5"
      style={{ background: `linear-gradient(to bottom, ${fromBg}, ${toBg})` }}
    >
      {/* 1. Scroll-Linked Interactive Blueprint SVG Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
        <defs>
          <pattern id={`grid-pattern-${nextSectionIndex}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        {/* Draw the repeated grid */}
        <rect width="100%" height="100%" fill={`url(#grid-pattern-${nextSectionIndex})`} />

        {/* Highlight Main Structural Crosshair Lines (Drawing on scroll) */}
        <motion.line
          x1="10%" y1="0" x2="10%" y2="100%"
          stroke={neonGlowColor}
          strokeWidth="0.8"
          style={{ pathLength: gridPathLength }}
        />
        <motion.line
          x1="90%" y1="0" x2="90%" y2="100%"
          stroke={neonGlowColor}
          strokeWidth="0.8"
          style={{ pathLength: gridPathLength }}
        />
        <motion.line
          x1="0" y1="35%" x2="100%" y2="35%"
          stroke={neonGlowColor}
          strokeWidth="0.8"
          style={{ pathLength: gridPathLength }}
        />
        <motion.line
          x1="0" y1="65%" x2="100%" y2="65%"
          stroke={neonGlowColor}
          strokeWidth="0.8"
          style={{ pathLength: gridPathLength }}
        />

        {/* Diagonal Sweeps */}
        <motion.line
          x1="0" y1="0" x2="100%" y2="100%"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1.5"
          style={{ pathLength: gridPathLength }}
        />
      </svg>

      {/* 2. Top Infinite Scrolling Marquee */}
      <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/5 bg-black/40 backdrop-blur-sm z-20 flex items-center overflow-hidden">
        <div className="ticker-wrap w-full flex items-center">
          <div className="ticker-content-left flex whitespace-nowrap text-[9px] tracking-[0.25em] font-mono text-white/40 uppercase">
            {marqueeItems.map((text, idx) => (
              <span key={idx} className="inline-flex items-center mx-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-ping mr-2" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Central Interactive 3D Wireframe Scene */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          style={{ scale: cubeScale }}
          className="flex flex-col items-center justify-center"
        >
          {/* Hardware Accelerated 3D Cube Perspective Container */}
          <div className="cube-scene w-24 h-24 relative mb-6">
            <motion.div
              style={{ rotateY: cubeYRotate }}
              className="cube-3d absolute w-full h-full transform-style-preserve-3d"
            >
              {/* Face Sides */}
              <div className={`cube-face cube-face-front ${getCubeNeonClass()}`}>
                <span className="text-[10px] font-mono text-white/20 tracking-wider">FRONT</span>
              </div>
              <div className={`cube-face cube-face-back ${getCubeNeonClass()}`}>
                <span className="text-[10px] font-mono text-white/20 tracking-wider">BACK</span>
              </div>
              <div className={`cube-face cube-face-right ${getCubeNeonClass()}`}>
                <span className="text-[10px] font-mono text-white/20 tracking-wider">RIGHT</span>
              </div>
              <div className={`cube-face cube-face-left ${getCubeNeonClass()}`}>
                <span className="text-[10px] font-mono text-white/20 tracking-wider">LEFT</span>
              </div>
              <div className={`cube-face cube-face-top ${getCubeNeonClass()}`}>
                <span className="text-[10px] font-mono text-white/20 tracking-wider">TOP</span>
              </div>
              <div className={`cube-face cube-face-bottom ${getCubeNeonClass()}`}>
                <span className="text-[10px] font-mono text-white/20 tracking-wider">BOTTOM</span>
              </div>
            </motion.div>
          </div>

          {/* Glitching Decrypting Status Readout */}
          <motion.div
            style={{ opacity: textOpacity }}
            className="text-center px-6 max-w-lg"
          >
            <div className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase mb-2">
              ESTABLISHING LINK PATHWAY
            </div>
            <h4 className="text-[11px] sm:text-xs font-mono tracking-[0.18em] text-white/80 uppercase font-semibold leading-relaxed min-h-[30px] break-all">
              {decryptedText || 'INITIALIZING COMPILER...'}
            </h4>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent mx-auto mt-3" />
          </motion.div>
        </motion.div>
      </div>

      {/* 4. Bottom Infinite Scrolling Marquee */}
      <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-white/5 bg-black/40 backdrop-blur-sm z-20 flex items-center overflow-hidden">
        <div className="ticker-wrap w-full flex items-center">
          <div className="ticker-content-right flex whitespace-nowrap text-[9px] tracking-[0.25em] font-mono text-white/40 uppercase">
            {marqueeItems.map((text, idx) => (
              <span key={idx} className="inline-flex items-center mx-8">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/60 animate-ping mr-2" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Sliding Curtain Wipe Overlay (splits vertical screen gate apart on scroll end) */}
      <div className="absolute inset-0 pointer-events-none z-30 flex">
        {/* Left Curtain Gate */}
        <motion.div
          style={{ width: curtainLeftWidth }}
          className="h-full bg-black/90 border-r border-white/5"
        />
        {/* Right Curtain Gate */}
        <motion.div
          style={{ width: curtainRightWidth }}
          className="h-full bg-black/90 border-l border-white/5 ml-auto"
        />
      </div>
    </div>
  );
}
