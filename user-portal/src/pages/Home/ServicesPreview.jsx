import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../../components/animations/ScrollReveal';
import Card3D from '../../components/animations/Card3D';
import Button from '../../components/ui/Button';

// Import newly added high-resolution visual assets
import resume1 from '../../assets/resume1.jpeg';
import resume2 from '../../assets/resume2.jpg';
import resume3 from '../../assets/resume3.jpg';

import hiring1 from '../../assets/hiring1.jpg';
import hiring2 from '../../assets/hiring2.jpg';
import hiring3 from '../../assets/hiring3.jpg';

import autoCad from '../../assets/engineering_blueprints.png';
import estimation from '../../assets/accounting_calc.jpg';
import cadDesigner from '../../assets/cad_designer.jpg';

// Premium Auto-playing Instagram-Story style image slideshow with Cinematic Panning & Jumping Spring reveals
function ImageSlideshow({ images = [], alt = '', badgeText = '', captions = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = 40; // 25 frames per second
    const totalDuration = 4000; // 4 seconds per slide
    const increment = (intervalTime / totalDuration) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % images.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, images.length, currentIndex]);

  const handleDotClick = (idx) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-[1.8rem] aspect-[4/3] sm:aspect-[1.5] lg:aspect-[1.4]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slideshow image wrapper with overlapping AnimatePresence (no mode="wait" for crossfade) */}
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          // Elastic Jumping Reveal + Ken Burns Zoom Shift
          initial={{ scale: 1.18, y: 35, opacity: 0 }}
          animate={{ scale: 1.03, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: -15, opacity: 0 }}
          transition={{
            opacity: { duration: 0.85, ease: "easeInOut" },
            y: { type: "spring", stiffness: 120, damping: 14 }, // Elastic jumping bounce
            scale: { duration: 4.5, ease: [0.25, 1, 0.5, 1] } // Ken Burns slow zoom glide
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[currentIndex]}
            alt={`${alt} - Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02]"
          />
        </motion.div>
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
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="text-xs sm:text-sm font-bold text-white tracking-wide bg-primary/45 backdrop-blur-[4px] px-3.5 py-2 rounded-lg inline-block border border-white/10 shadow-lg"
            >
              {captions[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}

      {/* Instagram-Story Style progress indicators */}
      <div className="absolute bottom-5 left-5 right-5 z-20 flex gap-2 select-none">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className="flex-1 h-1 rounded-full bg-white/35 overflow-hidden focus:outline-none transition-all duration-300 hover:bg-white/50 cursor-pointer"
          >
            <div
              className="h-full bg-white transition-all duration-[40ms] ease-linear"
              style={{
                width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%',
                boxShadow: idx === currentIndex ? '0 0 8px rgba(255,255,255,0.8)' : 'none'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ServicesPreview() {
  // Image Lists for each category
  const recruitmentImages = [resume1, resume2, resume3];
  const recruitmentCaptions = [
    "CV Submissions & Vetting Intake",
    "Candidate Credential Verification",
    "SaaS Placement Alignment & Progress"
  ];

  const hiringImages = [hiring1, hiring2, hiring3];
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
    <section className="w-full py-28 bg-bg-page overflow-hidden select-none border-b border-border" style={{ backgroundColor: 'rgb(165 234 178 / 12%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          {/* <ScrollReveal delay={0.05}>
            <span className="text-accent text-xs font-extrabold uppercase tracking-[0.2em] mb-3 inline-block px-3 py-1 rounded-full bg-accent-light border border-accent/10">
              CORE CAPABILITIES
            </span>
          </ScrollReveal> */}
          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-blue-950 tracking-tight mb-6 leading-tight">
              Build Careers, Hire Talent & Access <span className="text-shimmer-gray">Our Services</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-sm sm:text-lg text-muted font-medium max-w-2xl mx-auto leading-relaxed">
              SkillCite functions as a premium dual-portal platform, bridging elite professionals and industry leading organizations through custom recruitment and rigorous technical services delivery.
            </p>
          </ScrollReveal>
        </div>

        {/* Services Rows (Alternating Layout with Left/Right Directional Reveals) */}
        <div className="space-y-36 sm:space-y-48 max-w-6xl mx-auto">
          
          {/* Row 1: Career Opportunities (Candidates) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Text Column (Slides in from Left) */}
            <ScrollReveal direction="left" className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1" delay={0.1}>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.15em] mb-4 inline-block">
                CANDIDATES & RECRUITMENT
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-primary mb-5 font-display tracking-tight leading-tight">
                Build Your Career with the Right Opportunities
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
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-primary font-bold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Link */}
              <div>
                <Link
                  to="/submit-your-cv"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent text-white font-bold text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto justify-center group"
                >
                  Submit Your CV
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Visual Column (Slides in from Right) */}
            <ScrollReveal direction="right" className="lg:col-span-6 order-1 lg:order-2" delay={0.15}>
              {/* Elastic Spring Hop on Card Hover */}
              <div className="hover:-translate-y-3.5 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer">
                <Card3D className="group relative" maxTilt={6}>
                  {/* Floating Glowing Orb (Best Premium Combination) */}
                  <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-accent/30 to-blue-400/10 blur-3xl pointer-events-none -z-10 floating-orb group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />
                  
                  {/* Premium Framed Slideshow */}
                  <div className="p-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <ImageSlideshow
                      images={recruitmentImages}
                      alt="Candidates & Recruitment Process"
                      badgeText="Administration & Tech Placements"
                      captions={recruitmentCaptions}
                    />
                  </div>
                </Card3D>
              </div>
            </ScrollReveal>
          </div>

          {/* Row 2: Hire Talent (Employers) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Column (Slides in from Left) */}
            <ScrollReveal direction="left" className="lg:col-span-6" delay={0.15}>
              {/* Elastic Spring Hop on Card Hover */}
              <div className="hover:-translate-y-3.5 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer">
                <Card3D className="group relative" maxTilt={6}>
                  {/* Floating Glowing Orb (Best Premium Combination) */}
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-bl from-accent/30 to-blue-400/10 blur-3xl pointer-events-none -z-10 floating-orb group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />
                  
                  {/* Premium Framed Slideshow */}
                  <div className="p-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <ImageSlideshow
                      images={hiringImages}
                      alt="Employers & Hiring Team"
                      badgeText="MEP & Civil Staffing"
                      captions={hiringCaptions}
                    />
                  </div>
                </Card3D>
              </div>
            </ScrollReveal>

            {/* Text Column (Slides in from Right) */}
            <ScrollReveal direction="right" className="lg:col-span-6 flex flex-col justify-center" delay={0.1}>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.15em] mb-4 inline-block">
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
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-primary font-bold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Link */}
              <div>
                <Link
                  to="/request-talent"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 hover:bg-slate-800 transition-all duration-300 w-full sm:w-auto justify-center group"
                >
                  Hire Talent
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Row 3: Engineering Services (Solutions) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Text Column (Slides in from Left) */}
            <ScrollReveal direction="left" className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1" delay={0.1}>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.15em] mb-4 inline-block">
                OUR ENGINEERING SERVICES
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-primary mb-5 font-display tracking-tight leading-tight">
                High-Precision Deliverables
              </h3>
              <p className="text-sm sm:text-base text-muted font-medium mb-8 leading-relaxed">
                Request professional estimation, AutoCAD & shop drawings and engineering calculation services from SkillCite. Our technical team delivers structured engineering support for construction and industrial projects.
              </p>

              {/* Bullet Checklist */}
              <div className="space-y-3 mb-8">
                {[
                  'AutoCAD & Shop Drawings',
                  'Estimations',
                  'Engineering calculations'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-primary font-bold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Link */}
              <div>
                <Link
                  to="/engineering-services"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent text-white font-bold text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto justify-center group"
                >
                  Request Technical Services
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Visual Column (Slides in from Right) */}
            <ScrollReveal direction="right" className="lg:col-span-6 order-1 lg:order-2" delay={0.15}>
              {/* Elastic Spring Hop on Card Hover */}
              <div className="hover:-translate-y-3.5 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer">
                <Card3D className="group relative" maxTilt={6}>
                  {/* Floating Glowing Orb (Best Premium Combination) */}
                  <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-accent/30 to-blue-400/10 blur-3xl pointer-events-none -z-10 floating-orb group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />
                  
                  {/* Premium Framed Slideshow */}
                  <div className="p-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <ImageSlideshow
                      images={engineeringImages}
                      alt="Engineering Services"
                      badgeText="AutoCAD & BOQ Estimation"
                      captions={engineeringCaptions}
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
