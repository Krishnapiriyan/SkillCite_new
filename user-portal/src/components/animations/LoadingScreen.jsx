import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import useCms from '../../hooks/useCms';
import { getMockUploadUrl, resolveMediaUrl } from '../../utils/apiBase.js';

const welcomeVideo = getMockUploadUrl('4eb6e8b7-5496-4bc6-903b-71956706dffd.mp4');

const floatingSkills = [
  { name: "BBuild Careers", x: "12%", y: "25%", color: "from-blue-400 to-indigo-500", delay: 0.1, threshold: 10 },
  { name: "Hire Top Talent", x: "82%", y: "30%", color: "from-indigo-400 to-purple-500", delay: 0.25, threshold: 25 },
  { name: "Access Our Services", x: "65%", y: "66%", color: "from-blue-500 to-cyan-400", delay: 0.4, threshold: 40 },
  // { name: "Systems Arch", x: "80%", y: "65%", color: "from-violet-400 to-fuchsia-500", delay: 0.15, threshold: 55 },
  // { name: "FPGA / Verilog", x: "25%", y: "15%", color: "from-cyan-500 to-blue-600", delay: 0.3, threshold: 70 },
  // { name: "Robotics / ROS", x: "72%", y: "18%", color: "from-indigo-500 to-cyan-500", delay: 0.2, threshold: 85 },
];

const taglineWords = "Connecting Elite Engineering Talent".split(" ");

export default function LoadingScreen({ onComplete, onReveal }) {
  const { getCms } = useCms();
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stage, setStage] = useState('loading'); // 'loading' | 'video' | 'exit'
  const [videoProgress, setVideoProgress] = useState(0);

  const videoRef = useRef(null);
  const currentVideoSrc = resolveMediaUrl(getCms('home.loading.videoUrl')) || welcomeVideo;

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
        
        // Elegant pause at 100%, then fade out the progress counter overlays
        setTimeout(() => {
          setStage('video');
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // 2. Play video when loaded and whenever source changes
  useEffect(() => {
    if (videoRef.current) {
      try {
        videoRef.current.load();
        videoRef.current.play().catch(err => {
          console.log("Video playback auto-play was blocked or failed:", err);
        });
      } catch (e) {
        console.warn("Failed to load video element source:", e);
      }
    }
  }, [currentVideoSrc]);

  // 3. Safety Fallback: ensure site mounts if video has issues or gets stuck
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      console.warn("Video loader safety fallback triggered.");
      triggerExit();
    }, 15000); // 15s max safety limit
    return () => clearTimeout(fallbackTimer);
  }, []);

  const triggerExit = () => {
    setStage('exit');
    if (onReveal) onReveal(); // Reveal home screen immediately so it's loaded underneath the morphing curtain
    
    // Let the video fade and blur out for 200ms before initiating the curtain wipe
    setTimeout(() => {
      setShow(false);
      // Wait for the liquid path exit transition to complete (750ms + buffer)
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 850);
    }, 200);
  };

  const handleVideoEnded = () => {
    triggerExit();
  };

  const handleSkip = () => {
    triggerExit();
  };

  const handleTimeUpdate = (e) => {
    const video = e.currentTarget;
    if (video.duration) {
      setVideoProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleVideoError = () => {
    console.warn('Intro video failed to load, skipping loader.');
    triggerExit();
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

          {/* Cinematic Background Video - Plays from the start */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: stage === 'exit' ? 0 : 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black overflow-hidden pointer-events-auto"
          >
            {/* Cinematic Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-30" />

            {/* Brand Intro overlay tag */}
            <div className="absolute top-8 left-8 z-30 select-none pointer-events-none">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-white/40 font-display"
              >
                SkillCite / Intro
              </motion.span>
            </div>

            <video
              ref={videoRef}
              src={currentVideoSrc}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              onError={handleVideoError}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover select-none pointer-events-none z-10"
            />

            {/* Elegant Skip Button with Playback Progress Ring */}
            {stage === 'video' && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                onClick={handleSkip}
                className="absolute bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-medium tracking-wide transition-all group pointer-events-auto shadow-2xl"
              >
                <span className="text-xs uppercase tracking-widest font-semibold text-white/80 group-hover:text-white transition-colors">
                  Skip Intro
                </span>
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <svg className="w-6 h-6 transform -rotate-90">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      className="stroke-white/10 fill-none"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="12"
                      cy="12"
                      r="9"
                      className="stroke-blue-500 fill-none"
                      strokeWidth="2"
                      strokeDasharray={2 * Math.PI * 9}
                      animate={{ strokeDashoffset: 2 * Math.PI * 9 * (1 - videoProgress / 100) }}
                      transition={{ ease: "linear", duration: 0.05 }}
                    />
                  </svg>
                  <span className="absolute text-[8px] text-blue-400 group-hover:scale-110 transition-transform">▶</span>
                </div>
              </motion.button>
            )}
          </motion.div>

          {/* Overlay Digital Loading Counter (Stage 1) */}
          <AnimatePresence>
            {stage === 'loading' && (
              <motion.div
                key="loading-stage"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative z-40 flex flex-col items-center gap-8 select-none pointer-events-none w-full h-full justify-center"
              >
                {/* Floating Skill Particles */}
                {floatingSkills.map((skill, idx) => {
                  const isVisible = progress >= skill.threshold;
                  return (
                    <AnimatePresence key={idx}>
                      {isVisible && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0, y: 15 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 0.85, 
                            y: 0,
                            transition: { 
                              type: "spring", 
                              stiffness: 120, 
                              damping: 10,
                              delay: skill.delay 
                            }
                          }}
                          exit={{ 
                            scale: 0.8, 
                            opacity: 0, 
                            y: -10,
                            transition: { duration: 0.3 }
                          }}
                          className="absolute z-20 hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#090E1A]/40 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                          style={{ left: skill.x, top: skill.y }}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${skill.color} animate-pulse`} />
                          <span className="text-[10px] font-bold tracking-wider uppercase text-white/70 font-mono">
                            {skill.name}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })}

                {/* Glowing Bouncing Brand Letters & Tagline */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative flex items-center justify-center gap-1 sm:gap-1.5 px-4 py-2">
                    {brandName.map((char, index) => (
                      <motion.span
                        key={index}
                        className="inline-block text-4xl sm:text-5xl font-extrabold font-display bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent select-none filter drop-shadow-[0_2px_10px_rgba(59,130,246,0.25)]"
                        style={{ transformOrigin: 'center center' }}
                        initial={{ scale: 0, opacity: 0, y: 30 }}
                        animate={isCompleted ? {
                          y: 0,
                          scale: 1.35,
                          opacity: 0,
                          filter: "blur(8px)",
                          transition: { duration: 0.4, ease: "easeOut" }
                        } : {
                          scale: 1,
                          opacity: 1,
                          y: [0, -16, 0],
                          transition: {
                            y: {
                              repeat: Infinity,
                              repeatType: "loop",
                              duration: 1.2,
                              delay: index * 0.08,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            },
                            scale: {
                              type: "spring",
                              stiffness: 150,
                              damping: 10,
                              delay: index * 0.05
                            },
                            opacity: {
                              duration: 0.4,
                              delay: index * 0.05
                            }
                          }
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                    
                    {/* Radial background pulse glow */}
                    <div className="absolute inset-0 w-64 h-24 rounded-full bg-blue-500/10 blur-2xl animate-pulse -z-10" />
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

                {/* Digital Percentage Counter */}
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="flex items-baseline font-mono text-3xl font-extrabold text-blue-500/90 tracking-tighter">
                    {String(progress).padStart(3, '0')}
                    <span className="text-[10px] text-blue-400/60 font-semibold uppercase tracking-wider ml-1">%</span>
                  </div>
                  
                  {/* Liquid progress line */}
                  <div className="w-36 h-[2px] bg-blue-950/40 rounded-full overflow-hidden relative border border-white/5">
                    <motion.div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-md shadow-blue-500/30"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: 'easeOut', duration: 0.1 }}
                    />
                  </div>
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
