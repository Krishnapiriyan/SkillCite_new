import { motion } from 'framer-motion';

const ORBS = [
  { size: 8, x: '12%', y: '18%', duration: 14, delay: 0 },
  { size: 6, x: '78%', y: '22%', duration: 11, delay: 0.5 },
  { size: 10, x: '65%', y: '55%', duration: 16, delay: 1 },
  { size: 5, x: '28%', y: '72%', duration: 12, delay: 0.3 },
  { size: 7, x: '88%', y: '68%', duration: 13, delay: 0.8 },
  { size: 4, x: '45%', y: '35%', duration: 10, delay: 1.2 },
  { size: 9, x: '8%', y: '58%', duration: 15, delay: 0.6 },
  { size: 6, x: '52%', y: '12%', duration: 11, delay: 0.2 },
  { size: 5, x: '92%', y: '38%', duration: 12, delay: 1.5 },
  { size: 7, x: '35%', y: '48%', duration: 14, delay: 0.9 },
  { size: 4, x: '72%', y: '82%', duration: 10, delay: 0.4 },
  { size: 8, x: '18%', y: '88%', duration: 13, delay: 1.1 },
];

export default function FloatingBlueOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {ORBS.map((orb, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-purple-200 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            y: [0, -28, 12, -20, 0],
            x: [0, 14, -10, 8, 0],
            opacity: [0.35, 0.9, 0.5, 0.85, 0.35],
            scale: [1, 1.35, 0.9, 1.2, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
