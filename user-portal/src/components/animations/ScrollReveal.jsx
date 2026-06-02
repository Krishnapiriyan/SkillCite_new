import { motion } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0, className = '', direction = 'up' }) {
  const getInitial = () => {
    switch (direction) {
      case 'left':
        return { opacity: 0, x: -75, y: 0 };
      case 'right':
        return { opacity: 0, x: 75, y: 0 };
      case 'down':
        return { opacity: 0, x: 0, y: -50 };
      case 'up':
      default:
        return { opacity: 0, x: 0, y: 50 };
    }
  };

  const getAnimate = () => {
    switch (direction) {
      case 'left':
      case 'right':
        return { opacity: 1, x: 0, y: 0 };
      case 'down':
      case 'up':
      default:
        return { opacity: 1, x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: false, margin: '-100px' }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
