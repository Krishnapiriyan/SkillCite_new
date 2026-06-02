import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HardHat, Receipt, FileSpreadsheet, Box,
  ArrowRight, ChevronRight, Check, Sparkles
} from 'lucide-react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import HoneycombBackground from '../../components/animations/HoneycombBackground';

import engineeringImg from '../../assets/engineering_1.jpg';
import accountingImg  from '../../assets/accounting_calc.jpg';
import adminImg       from '../../assets/admin_1.jpg';
import otherImg       from '../../assets/hiring1.jpg';

const divisions = [
  {
    num: '01',
    icon: <HardHat className="w-5 h-5" />,
    title: 'Engineering Recruitment',
    short: 'Engineering Recruitment',
    desc: 'We connect skilled professionals with technical and project-driven environments that demand precision, innovation, and real-world impact. Civil, Structural, Mechanical, Electrical, Architectural, and Estimation roles — helping organisations build teams that deliver engineering excellence.',
    image: engineeringImg,
    badge: 'MEP & Civil',
    color: '#3b82f6',
    points: ['Civil & Structural Engineering', 'MEP & Electrical Engineers', 'Quantity Surveyors & Estimators'],
    to: '/engineering-services',
  },
  {
    num: '02',
    icon: <Receipt className="w-5 h-5" />,
    title: 'Accounting Recruitment',
    short: 'Accounting Recruitment',
    desc: 'Connects finance professionals who bring accuracy, insight, and reliability to every organisation. From Accountants and Payroll Officers to Bookkeepers, our candidates strengthen financial operations, reporting, and compliance.',
    image: accountingImg,
    badge: 'Finance',
    color: '#10b981',
    points: ['Certified Bookkeepers & Clerks', 'Payroll & Compliance Officers', 'Senior Management Accountants'],
    to: '/request-talent',
  },
  {
    num: '03',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    title: 'Administration Recruitment',
    short: 'Administration Recruitment',
    desc: 'Meet proactive individuals who keep operations running smoothly. Our talent pool includes Office Managers, Executive Assistants, Contract Administrators, and Receptionists selected for professional service.',
    image: adminImg,
    badge: 'Operations',
    color: '#f59e0b',
    points: ['Office Managers & EA Roles', 'Contract Administrators', 'Reception & Front Desk'],
    to: '/request-talent',
  },
  {
    num: '04',
    icon: <Box className="w-5 h-5" />,
    title: 'Other Recruitment',
    short: 'Other Recruitment',
    desc: 'Discover versatile professionals across a wide range of specialised roles tailored to unique business needs. We connect organisations with adaptable talent from various industries.',
    image: otherImg,
    badge: 'Other',
    color: '#8b5cf6',
    points: ['Specialised Project Teams', 'Custom Industry Placements', 'Niche Technical Competencies'],
    to: '/submit-your-cv',
  },
];

/* ─── Per-division animated overlay ─────────────────────────────────────── */
function ThemeOverlay({ idx, color }) {
  // if (idx === 0) return (
  //   <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
  //     <div className="absolute inset-0 opacity-[0.12]" style={{
  //       backgroundImage: 'linear-gradient(to right,#3b82f6 1px,transparent 1px),linear-gradient(to bottom,#3b82f6 1px,transparent 1px)',
  //       backgroundSize: '22px 22px',
  //     }} />
  //     <div className="absolute inset-0 flex items-center justify-center">
  //       <motion.div animate={{ scale: [0.8,1.6,0.8], opacity:[0.15,0.45,0.15] }}
  //         transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
  //         className="w-48 h-48 border border-blue-400/35 rounded-full absolute" />
  //       <div className="w-px h-full bg-blue-400/15 absolute" />
  //       <div className="w-full h-px bg-blue-400/15 absolute" />
  //     </div>
  //     <span className="absolute bottom-5 left-5 font-mono text-[9px] text-blue-300 tracking-widest bg-black/40 border border-blue-400/20 px-2.5 py-1 rounded-md">
  //       SYS.LOC // ENG_01
  //     </span>
  //   </div>
  // );
  // if (idx === 1) return (
  //   <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
  //     <div className="absolute inset-0 opacity-[0.06]" style={{
  //       backgroundImage: 'linear-gradient(to right,#10b981 1px,transparent 1px)',
  //       backgroundSize: '28px 100%',
  //     }} />
  //     <div className="absolute top-5 left-5 font-mono text-[9px] text-emerald-300 bg-black/40 border border-emerald-400/20 p-2.5 rounded-xl space-y-1">
  //       <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />LEDGER OK</div>
  //       <div>REVENUE +18.4%</div>
  //     </div>
  //     <div className="absolute bottom-5 right-5 font-mono text-[9px] text-emerald-300 bg-black/40 border border-emerald-400/20 p-2.5 rounded-xl text-right space-y-0.5">
  //       <div>BALANCE: STABLE</div>
  //       <div>AUDIT: PASS</div>
  //     </div>
  //   </div>
  // );
  // if (idx === 2) return (
  //   <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
  //     <motion.div animate={{ y:['-100%','200%'] }} transition={{ duration:6, repeat:Infinity, ease:'linear' }}
  //       className="w-full h-1/3 bg-gradient-to-b from-transparent via-amber-400/12 to-transparent absolute" />
  //     <div className="absolute top-5 left-5 font-mono text-[9px] text-amber-300 bg-black/40 border border-amber-400/20 px-2.5 py-1 rounded-xl">
  //       STATUS: OPTIMAL
  //     </div>
  //     <div className="absolute bottom-5 left-5 font-mono text-[9px] text-amber-300 bg-black/40 border border-amber-400/20 px-2.5 py-1 rounded-xl">
  //       EFFICIENCY: 100%
  //     </div>
  //   </div>
  // );
  // if (idx === 3) return (
  //   <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
  //     <motion.div animate={{ scale:[1,1.3,1], rotate:[0,180,360], opacity:[0.12,0.3,0.12] }}
  //       transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }}
  //       className="absolute inset-0 bg-gradient-to-tr from-purple-500/25 via-pink-500/15 to-transparent blur-3xl" />
  //     <div className="absolute top-5 left-5 font-mono text-[9px] text-purple-300 bg-black/40 border border-purple-400/20 px-2.5 py-1 rounded-xl">
  //       PIPELINE: ADAPTIVE
  //     </div>
  //     <div className="absolute bottom-5 right-5 font-mono text-[9px] text-purple-300 bg-black/40 border border-purple-400/20 px-2.5 py-1 rounded-xl">
  //       PARTNERS: ACTIVE
  //     </div>
  //   </div>
  // );
  return null;
}

export default function SpecialtyDivisions() {
  const [active, setActive] = useState(0);

  return (
    <section
      className="w-full py-24 select-none overflow-hidden relative bg-transparent"
    >
      {/* Light Stone Honeycomb Background */}
      <HoneycombBackground />

      <div className="absolute inset-x-0 top-0 h-px bg-black/5" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          {/* <ScrollReveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-purple-950 tracking-tight mb-4 leading-tight">
              Specialist Recruitment <span className="text-purple-900/65">Divisions</span>
            </h2>
          </ScrollReveal> */}
          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-purple-950 tracking-tight mb-6 leading-tight">
              Specialist Recruitment <span className="text-shimmer-gray">Divisions</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-sm sm:text-base text-slate-700 font-medium max-w-xl mx-auto leading-relaxed">
              Discrete specialist units ensuring deep domain mastery in every candidate search.
            </p>
          </ScrollReveal>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            THE SINGLE UNIFIED FRAME  (desktop: horizontal, mobile: vertical)
        ══════════════════════════════════════════════════════════════════ */}
        <div
          className="w-full max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border border-purple-900/20"
          style={{ height: 580 }}
        >
          {/* ── DESKTOP: horizontal flex ── */}
          <div className="hidden lg:flex h-full w-full">
            {divisions.map((div, idx) => {
              const isActive = idx === active;
              return (
                <motion.div
                  key={idx}
                  onClick={() => setActive(idx)}
                  animate={{ flexGrow: isActive ? 5 : 0.65 }}
                  transition={{ type: 'spring', stiffness: 80, damping: 17, mass: 1 }}
                  style={{ flexBasis: 0, minWidth: 0 }}
                  className="relative overflow-hidden cursor-pointer"
                >
                  {/* ── Background image (always shown, brightness varies) ── */}
                  <motion.img
                    animate={{
                      scale: isActive ? [1.03,1.09,1.03] : 1.05,
                      x: isActive ? [6,-6,6] : 0,
                      y: isActive ? [-3,3,-3] : 0,
                    }}
                    transition={isActive ? {
                      scale:{ duration:18, repeat:Infinity, ease:'easeInOut' },
                      x:{ duration:13, repeat:Infinity, ease:'easeInOut' },
                      y:{ duration:15, repeat:Infinity, ease:'easeInOut' },
                    } : { duration: 0.6 }}
                    src={div.image}
                    alt={div.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: isActive
                        ? 'brightness(0.62) contrast(1.05) saturate(1.12)'
                        : 'brightness(0.28) contrast(1.1) saturate(0.8)',
                    }}
                  />

                  {/* Base dark mask for both states */}
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      background: isActive
                        ? 'linear-gradient(to top, rgba(46,16,101,0.92) 0%, rgba(0,0,0,0.38) 55%, transparent 100%)'
                        : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 100%)',
                    }}
                  />

                  {/* ── ACTIVE: theme overlay + shimmer + tint pulse ── */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key="overlays"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0"
                      >
                        <ThemeOverlay idx={idx} color={div.color} />

                        {/* Shimmer sweep */}
                        <motion.div
                          animate={{ x: ['-130%','130%'] }}
                          transition={{ duration:5, repeat:Infinity, ease:'linear', repeatDelay:5 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/7 to-transparent skew-x-12 pointer-events-none z-20"
                        />
                        {/* Colour tint pulse */}
                        <motion.div
                          animate={{ opacity:[0,0.1,0] }}
                          transition={{ duration:6, repeat:Infinity, ease:'easeInOut', repeatDelay:3 }}
                          className="absolute inset-0 pointer-events-none z-20"
                          style={{ backgroundColor: div.color }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── ACTIVE CONTENT ── */}
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="active-content"
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="absolute inset-0 z-30 flex flex-col justify-between p-8"
                      >
                        {/* Top: badge + unit label */}
                        <div className="flex items-start justify-between">
                          {/* <div className="space-y-2">
                            <span className="font-mono text-[9px] font-medium text-white/45 tracking-[0.22em] uppercase block">
                              Unit {div.num}
                            </span>
                            <span
                              className="inline-block px-3 py-1 rounded-lg text-white/90 font-semibold text-[10px] tracking-[0.15em] uppercase border border-white/15"
                              style={{ backgroundColor: `${div.color}30` }}
                            >
                              {div.badge}
                            </span>
                          </div> */}
                          {/* <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/20 shadow-lg"
                            style={{ backgroundColor: `${div.color}50` }}
                          >
                            {div.icon}
                          </div> */}
                        </div>

                        {/* Bottom: title + desc + bullets + CTA */}
                        <div className="grid grid-cols-12 gap-6 items-end">
                          {/* Left column */}
                          <div className="col-span-7 space-y-3">
                            <h3 className="text-3xl lg:text-4xl font-extrabold font-display text-white tracking-tight leading-snug">
                              {div.title}
                            </h3>
                            <p className="text-sm text-white/70 leading-relaxed font-normal">
                              {div.desc}
                            </p>
                            {/* <div className="pt-2">
                              <Link
                                to={div.to}
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/90 hover:bg-white text-purple-950 font-semibold text-sm tracking-wide transition-all duration-300 shadow-lg hover:-translate-y-0.5 group/btn"
                              >
                                Explore Division
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            </div> */}
                          </div>

                          {/* Right column — specialisations */}
                          {/* <div className="col-span-5 bg-black/35 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-3">
                            <p className="text-[10px] font-mono font-medium text-white/40 tracking-[0.18em] uppercase flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-white/40" />
                              Areas of Expertise
                            </p>
                            {div.points.map((pt, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm text-white/80 font-normal">
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: `${div.color}40` }}
                                >
                                  <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div> */}
                        </div>
                      </motion.div>
                    ) : (
                      /* ── COLLAPSED STRIP ── */
                      <motion.div
                        key="strip-content"
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-between py-7 px-2"
                      >
                        <span className="font-mono text-lg font-bold text-white/30 tracking-wider">
                          {/* {div.num} */}
                        </span>

                        {/* Glowing icon circle */}
                        {/* <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white/70 group-hover:bg-white/25 transition-all duration-300">
                          {div.icon}
                        </div> */}

                        {/* Rotated title */}
                        <span
                          className="font-display font-semibold text-[9px] text-white/55 uppercase tracking-[0.22em] [writing-mode:vertical-lr] rotate-180"
                        >
                          {div.short}
                        </span>

                        {/* Expand indicator */}
                        <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                          <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Thin divider line between strips */}
                  {!isActive && idx < divisions.length - 1 && (
                    <div className="absolute right-0 inset-y-6 w-px bg-white/10 z-40" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* ── MOBILE: vertical flex ── */}
          <div className="flex lg:hidden flex-col h-full w-full">
            {divisions.map((div, idx) => {
              const isActive = idx === active;
              return (
                <motion.div
                  key={idx}
                  onClick={() => setActive(idx)}
                  animate={{ flexGrow: isActive ? 5 : 0.7 }}
                  transition={{ type: 'spring', stiffness: 80, damping: 17, mass: 1 }}
                  style={{ flexBasis: 0, minHeight: 0 }}
                  className="relative overflow-hidden cursor-pointer"
                >
                  {/* Background image */}
                  <motion.img
                    animate={{
                      scale: isActive ? [1.03,1.08,1.03] : 1.04,
                    }}
                    transition={isActive
                      ? { duration:16, repeat:Infinity, ease:'easeInOut' }
                      : { duration:0.6 }
                    }
                    src={div.image}
                    alt={div.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: isActive
                        ? 'brightness(0.62) contrast(1.05) saturate(1.1)'
                        : 'brightness(0.30) contrast(1.1)',
                    }}
                  />

                  {/* Gradient mask */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isActive
                        ? 'linear-gradient(to top, rgba(46,16,101,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)'
                        : 'rgba(0,0,0,0.6)',
                    }}
                  />

                  {/* Active overlays */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key="m-overlays"
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        className="absolute inset-0"
                      >
                        <ThemeOverlay idx={idx} color={div.color} />
                        <motion.div
                          animate={{ x:['-130%','130%'] }}
                          transition={{ duration:5, repeat:Infinity, ease:'linear', repeatDelay:5 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/7 to-transparent skew-x-12 pointer-events-none z-20"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* MOBILE ACTIVE CONTENT */}
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="m-active"
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        transition={{ duration:0.3, delay:0.1 }}
                        className="absolute inset-0 z-30 flex flex-col justify-between p-6"
                      >
                        {/* Top row */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] font-medium text-white/45 tracking-[0.2em] uppercase">
                            Unit {div.num}
                          </span>
                          <span
                            className="px-2.5 py-0.5 rounded-md text-white/85 font-semibold text-[9px] tracking-[0.14em] uppercase border border-white/15"
                            style={{ backgroundColor: `${div.color}30` }}
                          >
                            {div.badge}
                          </span>
                        </div>

                        {/* Bottom: title + desc */}
                        <div className="space-y-2.5">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                            {div.title}
                          </h3>
                          <p className="text-xs text-white/65 leading-relaxed font-normal line-clamp-3">
                            {div.desc}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      /* MOBILE COLLAPSED ROW */
                      <motion.div
                        key="m-strip"
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        transition={{ duration:0.2 }}
                        className="absolute inset-0 z-30 flex items-center justify-between px-5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-white/35">{div.num}</span>
                          <span className="text-sm font-semibold text-white/70 tracking-wide">{div.title}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/35 shrink-0" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Thin divider between rows */}
                  {!isActive && idx < divisions.length - 1 && (
                    <div className="absolute bottom-0 inset-x-6 h-px bg-white/10 z-40" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
