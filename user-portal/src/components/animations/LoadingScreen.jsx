import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const floatingSkills = [
  { name: "Build Careers", x: "12%", y: "25%", color: "from-purple-400 to-indigo-500", delay: 0.1, threshold: 10 },
  { name: "Hire Top Talent", x: "82%", y: "30%", color: "from-indigo-400 to-purple-500", delay: 0.25, threshold: 25 },
  { name: "Access Our Services", x: "65%", y: "66%", color: "from-purple-500 to-cyan-400", delay: 0.4, threshold: 40 },
];

const taglineWords = "Your trusted recruitment partner".split(" ");

export default function LoadingScreen({ onComplete, onReveal }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stage, setStage] = useState('loading'); // 'loading' | 'exit'

  // 1. Digital Percentage Counter + stage transitions
  useEffect(() => {
    let start = 0;
    const duration = 2000; // Animation loading duration (ms)
    const intervalTime = 20;
    const steps = duration / intervalTime;
    
    const timer = setInterval(() => {
      start += 1;
      const progressPercent = Math.min(Math.round(Math.pow(start / steps, 1.6) * 100), 100);
      setProgress(progressPercent);
      
      if (progressPercent >= 100) {
        clearInterval(timer);
        setIsCompleted(true);
        
        // Elegant pause at 100%, then initiate the curtain wipe exit
        setTimeout(() => {
          triggerExit();
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const triggerExit = () => {
    setStage('exit');
    if (onReveal) onReveal(); // Reveal home screen immediately so it's loaded underneath the morphing curtain
    
    // Let the loader elements fade and blur out for 200ms before initiating the curtain wipe
    setTimeout(() => {
      setShow(false);
      // Wait for the liquid path exit transition to complete (750ms + buffer)
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 850);
    }, 200);
  };

  const brandName = "SkillCite".split("");

  // Liquid Morphing Path definitions (Y coordinate ranges 0 to 100 matching viewBox)
  const curves = {
    initial: "M 0 100 L 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z",
    exit: "M 0 0 L 0 0 L 100 0 L 100 0 Q 50 -40 0 0 Z"
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-transparent flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* Background Ambient sphere glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#030712]">
            <div 
              className="absolute -top-[45%] -left-[20%] w-[90%] h-[90%] rounded-full bg-blue-600/10 blur-[130px] animate-pulse" 
              style={{ animationDuration: '6s' }} 
            />
            <div 
              className="absolute -bottom-[45%] -right-[20%] w-[90%] h-[90%] rounded-full bg-indigo-600/10 blur-[130px] animate-pulse" 
              style={{ animationDuration: '8s' }} 
            />
          </div>

          {/* Overlay Brand & Tagline Loading Content (Stage 1) */}
          <AnimatePresence>
            {stage === 'loading' && (
              <motion.div
                key="loading-stage"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative z-40 flex flex-col items-center gap-6 select-none pointer-events-none w-full h-full justify-center"
              >
                {/* Glowing Bouncing Brand Letters & Tagline */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative flex items-center justify-center gap-4 sm:gap-6 px-4 py-2">
                    {brandName.map((char, index) => (
                      <motion.span
                        key={index}
                        className="inline-block text-4xl sm:text-5xl font-extrabold font-display bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent select-none filter drop-shadow-[0_2px_10px_rgba(59,130,246,0.25)]"
                        style={{ transformOrigin: 'center center' }}
                        initial={{ opacity: 0, y: 16, scale: 0.2 }}
                        animate={isCompleted ? {
                          y: 0,
                          scale: 1.85,
                          opacity: 0,
                          filter: "blur(8px)",
                          transition: { duration: 0.4, ease: "easeOut" }
                        } : {
                          opacity: 1,
                          y: 0,
                          scale: 1.6,
                          transition: {
                            duration: 0.9,
                            ease: "easeOut",
                            delay: index * 0.05
                          }
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                    
                    {/* Radial background pulse glow */}
                    <div className="absolute inset-0 w-64 h-24 rounded-full bg-purple-500/10 blur-2xl animate-pulse -z-10" />
                  </div>

                  {/* Staggered Tagline Pop */}
                  <motion.div 
                    className="flex flex-wrap justify-center gap-x-2 text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-white/40 font-sans mt-3 max-w-md text-center leading-relaxed px-4"
                    variants={{
                      animate: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.35
                        }
                      }
                    }}
                    initial="initial"
                    animate="animate"
                  >
                    {taglineWords.map((word, wordIdx) => (
                      <motion.span
                        key={wordIdx}
                        className="inline-block"
                        variants={{
                          initial: { scale: 0.4, opacity: 0, y: 15 },
                          animate: { 
                            scale: 1, 
                            opacity: 1, 
                            y: 0,
                            transition: {
                              type: "spring",
                              stiffness: 160,
                              damping: 12
                            }
                          }
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>

                {/* Minimalist Loading Indicator */}
                <div className="flex items-center gap-1.5 mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-white/35 font-bold">
                  <span>Loading</span>
                  <span className="flex gap-0.5">
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-purple-500/80" />
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-purple-500/80" />
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-purple-500/80" />
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Liquid Morphing Wave Exit Panel */}
          <svg 
            className="absolute inset-0 w-screen h-screen pointer-events-none z-5"
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <motion.path
              initial={{ d: curves.initial }}
              exit={{ d: curves.exit }}
              transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
              fill="#090E1A" // Immersive dark slate background panel
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
