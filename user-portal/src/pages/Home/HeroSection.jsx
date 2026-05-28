import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCms from '../../hooks/useCms';
import { resolveMediaUrl } from '../../utils/apiBase.js';
import TextReveal from '../../components/animations/TextReveal';
import ScrollReveal from '../../components/animations/ScrollReveal';
import ParticleCanvas from '../../components/animations/ParticleCanvas';
import GravitationalWarpGrid from '../../components/animations/GravitationalWarpGrid';
import FloatingBlueOrbs from '../../components/animations/FloatingBlueOrbs';
import MagneticElement from '../../components/animations/MagneticElement';
import Button from '../../components/ui/Button';

import adminImg from '../../assets/admin_1.jpg';
import accountingImg from '../../assets/accounting_1.jpg';
import recruitmentImg from '../../assets/hiring2.jpg';

// Premium responsive spring-loaded skate and tumble Framer Motion card variants
const cardRecruitmentVariants = (isMobile) => ({
  initial: { rotate: -6, x: -10, y: 8, scale: 1 },
  hover: { 
    rotate: -15, 
    x: isMobile ? -50 : -140, 
    y: isMobile ? -15 : -35, 
    scale: 1.05,
    transition: { type: "spring", stiffness: 180, damping: 18 }
  }
});

const cardAccountingVariants = (isMobile) => ({
  initial: { rotate: 6, x: 10, y: 16, scale: 1 },
  hover: { 
    rotate: 18, 
    x: isMobile ? 50 : 140, 
    y: isMobile ? 25 : 50, 
    scale: 1.06,
    transition: { type: "spring", stiffness: 180, damping: 18 }
  }
});

const cardAdminVariants = (isMobile) => ({
  initial: { rotate: -1, x: 0, y: 0, scale: 1 },
  hover: { 
    rotate: -4, 
    x: 0, 
    y: isMobile ? -50 : -125, 
    scale: 1.08,
    transition: { type: "spring", stiffness: 180, damping: 18 }
  }
});

export default function HeroSection() {
  const { getCms } = useCms();
  const heroVideoUrl = resolveMediaUrl(getCms('home.hero.videoUrl'));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen w-full flex items-center bg-bg-page overflow-hidden pt-24 pb-12 select-none">
      
      {/* Dynamic Background Video */}
      {heroVideoUrl && (
        <video
          key={heroVideoUrl}
          src={heroVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.5] transition-opacity duration-1000"
        />
      )}

      {/* Dynamic Backgrounds — enhanced density for hero */}
      <ParticleCanvas intensity="high" />
      <GravitationalWarpGrid />
      <FloatingBlueOrbs />

      {/* 4% Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Morphing Blur Shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-blue-400/25 blur-[110px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[480px] h-[480px] rounded-full bg-cyan-400/20 blur-[130px] pointer-events-none"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-400/15 blur-[90px] pointer-events-none"
        animate={{ x: [0, 40, -30, 0], y: [0, -25, 35, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        
        {/* Left copy */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary leading-[1.08] mb-6 flex flex-col font-display">
            {getCms('home.hero.title1') ? (
              <>
                <TextReveal text={getCms('home.hero.title1')} />
                <TextReveal text={getCms('home.hero.title2', 'Recruitment')} className="text-accent" />
              </>
            ) : (
              <>
                <TextReveal text={getCms('home.hero.title', 'Engineering Talent.')} className="text-gray-600" />
                <TextReveal text={getCms('home.hero.title2', 'Recruitment')} className="text-purple-950" />
              </>
            )}
          </h1>

          <div className="flex flex-wrap items-center justify-start gap-2 sm:space-x-3 mb-10 opacity-80 px-2">
            {/* <span className="hidden sm:block h-px bg-border-emphasis w-4 md:w-8"></span> */}
            <span className="text-[10px] md:text-[14px] font-bold text-text-secondary uppercase tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em] text-center">
              Engineering • Administration • Accounting
            </span>
            {/* <span className="hidden sm:block h-px bg-border-emphasis w-4 md:w-8"></span> */}
          </div>

          <ScrollReveal delay={0.4} className="max-w-xl">
            <p className="text-sm sm:text-lg text-slate-700 font-bold mb-8 leading-relaxed">
              {getCms(
                'home.hero.subtitle',
                'SkillCite connects premium engineering talent with leading companies. Our specialist recruitment team handles everything personally.'
              )}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.6} className="flex flex-wrap gap-4 w-full sm:w-auto">
            <MagneticElement strength={0.25} range={50} className="w-full sm:w-auto">
              <Link to="/request-talent" className="w-full sm:w-auto">
                <Button variant="filled" 
                       className="!text-white !bg-purple-950 !border-slate-300 hover:!bg-purple-700 hover:!text-white hover:!border-cyan-600">
                  Request Talent
                </Button>
              </Link>
            </MagneticElement>
            <MagneticElement strength={0.25} range={50} className="w-full sm:w-auto">
              {/* <Link to="/submit-your-cv" className="w-full sm:w-auto">
                <Button variant="outlined" className="w-full sm:w-auto">
                  Submit Your CV
                </Button>
              </Link> */}
              <Link to="/submit-your-cv">
                <Button
                  variant="outlined"
                  className="!text-black !bg-white !border-slate-300 hover:!bg-gray-600 hover:!text-white hover:!border-cyan-600">
                  Join the Network
                </Button>
              </Link>
            </MagneticElement>
          </ScrollReveal>

        </div>

        {/* Right side illustration - Stacked Skate & Tumble Cards */}
        <div className="flex lg:col-span-5 items-center justify-center min-h-[460px] sm:min-h-[520px] w-full mt-10 lg:mt-0 relative">
          <ScrollReveal delay={0.4} className="relative w-full max-w-md h-[460px] sm:h-[520px] flex items-center justify-center select-none pointer-events-auto">
            <motion.div
              initial="initial"
              whileHover="hover"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-[280px] sm:w-[350px] h-[350px] sm:h-[450px] flex items-center justify-center cursor-pointer group"
            >
              {/* Central Glowing Backlight Orb */}
              <div className="absolute inset-0 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700 -z-10" />

              {/* 1. SPECIALIST RECRUITMENT CARD (Left Skate) */}
              <motion.div
                custom={isMobile}
                variants={cardRecruitmentVariants(isMobile)}
                className="absolute w-[240px] sm:w-[340px] h-[300px] sm:h-[420px] p-2 sm:p-3 bg-white/50 backdrop-blur-md rounded-[1.6rem] sm:rounded-[2.2rem] border border-white/75 shadow-xl hover:shadow-2xl transition-shadow select-none origin-center"
                style={{ zIndex: 10 }}
              >
                <div className="relative w-full h-full rounded-[1.3rem] sm:rounded-[1.8rem] overflow-hidden bg-slate-100 shadow-inner">
                  <img
                    src={recruitmentImg}
                    alt="Recruitment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-purple-500/90 text-[8px] sm:text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm shadow-sm">
                    Recruit
                  </div>
                </div>
              </motion.div>

              {/* 2. ACCOUNTING SERVICES CARD (Right Skate) */}
              <motion.div
                custom={isMobile}
                variants={cardAccountingVariants(isMobile)}
                className="absolute w-[240px] sm:w-[340px] h-[300px] sm:h-[420px] p-2 sm:p-3 bg-white/50 backdrop-blur-md rounded-[1.6rem] sm:rounded-[2.2rem] border border-white/75 shadow-xl hover:shadow-2xl transition-shadow select-none origin-center"
                style={{ zIndex: 20 }}
              >
                <div className="relative w-full h-full rounded-[1.3rem] sm:rounded-[1.8rem] overflow-hidden bg-slate-100 shadow-inner">
                  <img
                    src={accountingImg}
                    alt="Accounting"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-purple-500/90 text-[8px] sm:text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm shadow-sm">
                    services
                  </div>
                </div>
              </motion.div>

              {/* 3. ADMINISTRATIVE INTAKE CARD (Top Skate) */}
              <motion.div
                custom={isMobile}
                variants={cardAdminVariants(isMobile)}
                className="absolute w-[240px] sm:w-[340px] h-[300px] sm:h-[420px] p-2 sm:p-3 bg-white/60 backdrop-blur-lg rounded-[1.6rem] sm:rounded-[2.2rem] border border-white/90 shadow-2xl hover:shadow-[0_25px_50px_rgba(59,130,246,0.25)] transition-shadow select-none origin-center"
                style={{ zIndex: 30 }}
              >
                <div className="relative w-full h-full rounded-[1.3rem] sm:rounded-[1.8rem] overflow-hidden bg-slate-100 shadow-inner">
                  <img
                    src={adminImg}
                    alt="Administration"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-purple-500/90 text-[8px] sm:text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm animate-pulse shadow-sm">
                    Intake
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
