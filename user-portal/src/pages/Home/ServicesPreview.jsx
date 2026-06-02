import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../../components/animations/ScrollReveal';
import Card3D from '../../components/animations/Card3D';
import Button from '../../components/ui/Button';
import IsometricGridBackground from '../../components/animations/IsometricGridBackground';

// Import newly added high-resolution visual assets
import resume1 from '../../assets/resume1.jpeg';
import resume2 from '../../assets/resume2.jpg';
import resume4 from '../../assets/resume4.jpg';

import hiring1 from '../../assets/hiring1.jpg';
import hiring4 from '../../assets/hiring4.jpg';
import hiring3 from '../../assets/hiring3.jpg';

import autoCad from '../../assets/engineering_blueprints.png';
import estimation from '../../assets/accounting_calc.jpg';
import cadDesigner from '../../assets/cad_designer.jpg';

// Premium Auto-playing 3D Parallax & Drag-to-Swipe Image Slideshow
function ImageSlideshow({ images = [], alt = '', badgeText = '', captions = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = Next, -1 = Prev
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slides every 5 seconds, pausing on hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, images.length]);

  const handleDotClick = (idx) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const onDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      // Swiped left -> next
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (info.offset.x > swipeThreshold) {
      // Swiped right -> prev
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Framer motion variants for elite split parallax depth
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05,
      rotateY: dir > 0 ? 12 : -12,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      zIndex: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      rotateY: dir < 0 ? 12 : -12,
      zIndex: 0,
    }),
  };

  // Ultra-Premium Cinematic Ken Burns Drift Effect
  const imageVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "12%" : "-12%",
      y: "4%",
      scale: 1.18,
    }),
    center: {
      x: ["-2%", "2%", "-2%"],
      y: ["-1%", "2%", "-1%"],
      scale: 1.08,
      transition: {
        x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 5.5, ease: [0.25, 1, 0.5, 1] } // Smooth elegant zoom transition on entrance
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? "10%" : "-10%",
      y: "-4%",
      scale: 1.18,
      transition: { duration: 0.5, ease: "easeInOut" }
    }),
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-[1.8rem] aspect-[4/3] sm:aspect-[1.5] lg:aspect-[1.4] bg-transparent shadow-[inset_0_2px_12px_rgba(0,0,0,0.06)]"
      style={{ perspective: 1200 }} // Enable 3D depth for rotateY
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slideshow image wrapper with AnimatePresence */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 280, damping: 28 },
            opacity: { duration: 0.4 },
            rotateY: { type: "spring", stiffness: 280, damping: 28 },
            scale: { duration: 0.5, ease: "easeOut" }
          }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden rounded-[1.8rem]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={onDragEnd}
        >
          <motion.img
            custom={direction}
            variants={imageVariants}
            transition={{
              x: { type: "spring", stiffness: 280, damping: 28 },
              scale: { duration: 0.5, ease: "easeOut" }
            }}
            src={images[currentIndex]}
            alt={`${alt} - Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02] pointer-events-none select-none rounded-[1.8rem]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic light-leak/shimmer sweep on slide change */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`shimmer-${currentIndex}`}
          initial={{ x: "-150%", opacity: 0 }}
          animate={{ x: "150%", opacity: [0, 0.15, 0.25, 0.15, 0] }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none z-10"
        />
      </AnimatePresence>

      {/* Dark gradient overlay mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/10 to-transparent pointer-events-none z-10" />

      {/* Custom Floating Glass status badge */}
      {badgeText && (
        <div className="absolute top-5 left-5 px-4 py-2 rounded-xl border border-white/40 bg-white/70 backdrop-blur-md text-primary font-extrabold text-[10px] tracking-wider uppercase shadow-xl flex items-center gap-2 select-none z-20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {badgeText}
        </div>
      )}

      {/* Active slide text overlay details */}
      {captions.length > 0 && (
        <div className="absolute bottom-12 left-5 right-5 z-20 select-none text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
              className="text-xs sm:text-sm font-bold text-white tracking-wide bg-primary/45 backdrop-blur-[4px] px-3.5 py-2 rounded-lg inline-block border border-white/10 shadow-lg"
            >
              {captions[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Sleek Minimal Pill Indicators (No Story Progress Bar) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2 select-none">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
              idx === currentIndex 
                ? 'bg-white w-6 shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                : 'bg-white/45 hover:bg-white/65'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Reusable premium hover border glow for cards
function BorderGlow({ gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="absolute inset-0 pointer-events-none rounded-[1.8rem] p-[1.5px]"
      style={{
        background: gradient,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        zIndex: 20
      }}
    />
  );
}

// Reusable typographic link with sliding horizontal underline
function UnderlineLink({ to, text, colorClass = "bg-purple-600" }) {
  return (
    <Link
      to={to}
      className="relative inline-flex items-center gap-2 group cursor-pointer pb-1 text-[#090b11] font-bold text-xs sm:text-sm tracking-wide uppercase select-none w-fit"
    >
      <span>{text}</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      <span className={`absolute bottom-0 left-0 w-full h-[2px] ${colorClass} origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]`} />
    </Link>
  );
}

export default function ServicesPreview() {
  // Image Lists for each category
  const recruitmentImages = [resume1, resume2, resume4];
  const recruitmentCaptions = [
    "CV Submissions & Vetting Intake",
    "Candidate Credential Verification",
    "SaaS Placement Alignment & Progress"
  ];

  const hiringImages = [hiring1, hiring4, hiring3];
  const hiringCaptions = [
    "Vetted Engineering Professionals",
    "Executive Team Onboarding",
    "Direct Project Operations Management"
  ];

  const engineeringImages = [autoCad, estimation, cadDesigner];
  const engineeringCaptions = [
    "2D AutoCAD Detailing & Shop Drawings",
    "Detailed Bills of Quantities & Estimation",
    "Senior Supervised Structural Calculations"
  ];

  return (
    <section className="w-full py-28 overflow-hidden select-none bg-transparent border-b border-black/5 relative">
      {/* Platinum Isometric Grid Background */}
      <IsometricGridBackground />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          {/* <ScrollReveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight mb-6 leading-tight">
              Build Careers, Hire Talent & Access <span className="text-slate-600">Our Services</span>
            </h2>
          </ScrollReveal> */}
          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-purple-950 tracking-tight mb-6 leading-tight">
              Build Careers, Hire Talent & Access <span className="text-shimmer-gray">Our Services</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-sm sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
              SkillCite functions as a premium dual-portal platform, bridging elite professionals and industry leading organizations through custom recruitment and rigorous technical services delivery.
            </p>
          </ScrollReveal>
        </div>

        {/* Services Rows with Blueprint Grid Lines */}
        <div className="max-w-6xl mx-auto">
          
          {/* Row 1: Career Opportunities (Candidates) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Text Column (Slides in from Left) */}
            <ScrollReveal direction="left" className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1" delay={0.1}>
              <span className="text-purple-600 text-[11px] font-bold uppercase tracking-[0.15em] mb-4 inline-block">
                CANDIDATES & RECRUITMENT
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-primary mb-5 font-display tracking-tight leading-tight">
                Empower Your Career with Strong Opportunities
              </h3>
              <p className="text-sm sm:text-base text-muted font-medium mb-8 leading-relaxed">
                Upload your CV and connect with employers through SkillCite’s structured recruitment process. We help candidates apply for suitable opportunities in engineering, accounting and administration roles.
              </p>

              {/* Bullet Checklist */}
              <div className="space-y-3 mb-8">
                {[
                  'Engineering, accounting, administration and other opportunities',
                  'Apply for multiple suitable positions',
                  'Structured candidate review and shortlisting process'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-primary font-bold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div>
                <Link
                  to="/submit-your-cv"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-950 text-white font-bold text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 hover:bg-purple-700 transition-all duration-300 w-full sm:w-auto justify-center group"
                >
                  Submit Your CV
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Visual Column (Slides in from Right) */}
            <ScrollReveal direction="right" className="lg:col-span-6 order-1 lg:order-2" delay={0.15}>
              <div className="hover:-translate-y-3.5 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer">
                <Card3D className="group relative bg-transparent rounded-[1.8rem]" maxTilt={6}>
                  {/* Floating Glowing Orb */}
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      x: [0, 10, 0],
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-purple-600/30 to-blue-400/10 blur-3xl pointer-events-none -z-10 group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
                  />
                  
                  {/* Premium Slideshow Wrapper with Gradient Border Glow */}
                  <div className="relative group rounded-[1.8rem] overflow-hidden shadow-2xl bg-transparent">
                    {/* <BorderGlow gradient="linear-gradient(90deg, #6344d5, #7ba5e6, #bab8e4)" /> */}
                    <ImageSlideshow
                      images={recruitmentImages}
                      alt="Candidates & Recruitment Process"
                      // captions={recruitmentCaptions}
                    />
                  </div>
                </Card3D>
              </div>
            </ScrollReveal>
          </div>

          {/* Thin Blueprint Horizontal Divider Line */}
          <div className="w-full h-px bg-black/10 my-24 sm:my-28" />

          {/* Row 2: Hire Talent (Employers) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Column (Slides in from Left) */}
            <ScrollReveal direction="left" className="lg:col-span-6" delay={0.15}>
              <div className="hover:-translate-y-3.5 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer">
                <Card3D className="group relative bg-transparent rounded-[1.8rem]" maxTilt={6}>
                  {/* Floating Glowing Orb */}
                  <motion.div
                    animate={{
                      y: [0, 15, 0],
                      x: [0, -10, 0],
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 9,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-bl from-accent/30 to-blue-400/10 blur-3xl pointer-events-none -z-10 group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
                  />
                  
                  {/* Premium Slideshow Wrapper with Gradient Border Glow */}
                  <div className="relative group rounded-[1.8rem] overflow-hidden shadow-2xl bg-transparent">
                    {/* <BorderGlow gradient="linear-gradient(90deg, #19c9c9, #c2e7e0, #119898)" /> */}
                    <ImageSlideshow
                      images={hiringImages}
                      alt="Employers & Hiring Team"
                      // captions={hiringCaptions}
                    />
                  </div>
                </Card3D>
              </div>
            </ScrollReveal>

            {/* Text Column (Slides in from Right) */}
            <ScrollReveal direction="right" className="lg:col-span-6 flex flex-col justify-center" delay={0.1}>
              <span className="text-purple-600 text-[11px] font-bold uppercase tracking-[0.15em] mb-4 inline-block">
                EMPLOYERS & HIRING
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-primary mb-5 font-display tracking-tight leading-tight">
                Find Qualified Professionals for Your Business
              </h3>
              <p className="text-sm sm:text-base text-muted font-medium mb-8 leading-relaxed">
                Post job opportunities, review shortlisted candidates and hire qualified professionals through SkillCite. Our workflow supports efficient recruitment and candidate coordination.
              </p>

              {/* Bullet Checklist */}
              <div className="space-y-3 mb-8">
                {[
                  'Structured job posting',
                  'AI-assisted and human candidate screening',
                  'Candidate shortlisting and communication support'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-primary font-bold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div>
                <Link
                  to="/request-talent"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gray-600 text-white font-bold text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 hover:bg-slate-800 transition-all duration-300 w-full sm:w-auto justify-center group"
                >
                  Hire Talent
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Thin Blueprint Horizontal Divider Line */}
          <div className="w-full h-px bg-black/10 my-24 sm:my-28" />

          {/* Row 3: Engineering Services (Solutions) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Text Column (Slides in from Left) */}
            <ScrollReveal direction="left" className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1" delay={0.1}>
              <span className="text-purple-600 text-[11px] font-bold uppercase tracking-[0.15em] mb-4 inline-block">
                OUR ENGINEERING SERVICES
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-primary mb-5 font-display tracking-tight leading-tight">
                Engineering Deliverables
              </h3>
              <p className="text-sm sm:text-base text-muted font-medium mb-8 leading-relaxed">
                Request professional estimation, precision 2D Drafting & 3D Visualization and engineering calculation services from SkillCite. Our technical team delivers structured engineering support for construction and industrial projects.
              </p>

              {/* Bullet Checklist */}
              <div className="space-y-3 mb-8">
                {[
                  'Precision 2D Drafting & 3D Visualization',
                  'Estimations',
                  'Engineering calculations'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-primary font-bold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div>
                <Link
                  to="/engineering-services"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-950 text-white font-bold text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 hover:bg-purple-700 transition-all duration-300 w-full sm:w-auto justify-center group"
                >
                  Request Technical Services
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Visual Column (Slides in from Right) */}
            <ScrollReveal direction="right" className="lg:col-span-6 order-1 lg:order-2" delay={0.15}>
              <div className="hover:-translate-y-3.5 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer">
                <Card3D className="group relative bg-transparent rounded-[1.8rem]" maxTilt={6}>
                  {/* Floating Glowing Orb */}
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      x: [0, 10, 0],
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-purple-600/30 to-blue-400/10 blur-3xl pointer-events-none -z-10 group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
                  />
                  
                  {/* Premium Slideshow Wrapper with Gradient Border Glow */}
                  <div className="relative group rounded-[1.8rem] overflow-hidden shadow-2xl bg-transparent">
                    {/* <BorderGlow gradient="linear-gradient(90deg, #279cfb, #dae6e2, #ebd7ce)" /> */}
                    <ImageSlideshow 
                      images={engineeringImages}
                      alt="Engineering Services"
                      // captions={engineeringCaptions}
                    />
                  </div>
                </Card3D>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
