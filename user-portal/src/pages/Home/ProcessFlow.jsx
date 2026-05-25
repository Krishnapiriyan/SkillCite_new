import { motion } from 'framer-motion';
import useCms from '../../hooks/useCms';
import ScrollReveal from '../../components/animations/ScrollReveal';

export default function ProcessFlow() {
  const { getCms } = useCms();


  const steps = [
    { num: '01', title: 'Applications & Hire Talent', desc: 'Employer search for talents/ Candidates uplosd their resume.' },
    { num: '02', title: 'Review & Shortlisting', desc: 'Candidate applications are screened using both AI-assisted analysis and human review.' },
    { num: '03', title: 'Selection & Communication', desc: 'Shortlisted candidates are shared with employers, and our team manages all communication.' },
    { num: '04', title: 'Offer & Placement', desc: 'SkillCite efficiently matches qualified candidates with suitable opportunities.' },
    // { num: '05', title: 'Delivered Offline', desc: 'Services delivered manually with full technical excellence.' },
  ];

  return (
    <section className="w-full py-20 bg-surface border-y border-border select-none overflow-hidden" style={{ backgroundColor: 'rgb(189 198 206 / 75%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary mb-4">
            From <span className="text-muted">Application</span> to <span className="text-purple-900"> Placement.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted font-medium">
           A structured workflow where jobs are managed by the team and candidates are matched through a clear verification and selection process in SkillCite.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {/* SVG Connecting Line (Desktop) */}
          <div className="absolute top-12 left-0 right-0 h-[2px] bg-border z-0 hidden md:block" />

          {/* SVG Curved Connecting Line (Mobile/Phone View - ~ style S-curve) */}
          <svg 
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 h-[92%] w-12 z-0 md:hidden pointer-events-none" 
            viewBox="0 0 48 100" 
            preserveAspectRatio="none"
          >
            <path
              d="M 0,4 C 0,16.5 48,16.5 48,29 C 48,42 0,42 0,55 C 0,68 48,68 48,81"
              fill="none"
              stroke="rgba(37, 99, 235, 0.3)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="stroke-purple-800/40"
            />
          </svg>

          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <ScrollReveal 
                key={idx} 
                delay={idx * 0.1}
                direction={isEven ? 'left' : 'right'}
                className={`flex flex-col items-center md:items-start text-center md:text-left relative z-10 max-w-[280px] md:max-w-none mx-auto transform transition-transform duration-300 ${
                  isEven ? '-translate-x-6 md:translate-x-0' : 'translate-x-6 md:translate-x-0'
                }`}
              >
                {/* Number bubble */}
                <motion.div
                  whileHover={{ scale: 1.1, backgroundColor: 'purple', color: 'white' }}
                  className="w-12 h-12 rounded-full border-2 border-purple-800 bg-surface text-purple-800 text-sm font-bold flex items-center justify-center shadow-md transition-all duration-300 mb-6"
                >
                  {step.num}
                </motion.div>

                {/* Title */}
                <h3 className="text-lg font-bold text-primary mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
                  {step.desc}
                </p>
              </ScrollReveal>
            );
          })}

        </div>

      </div>
    </section>
  );
}
