import { HardHat, Receipt, FileSpreadsheet, Box } from 'lucide-react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import Card3D from '../../components/animations/Card3D';

// Import newly uploaded visual assets for divisions
import engineeringImg from '../../assets/engineering_1.jpg';
import accountingImg from '../../assets/accounting_calc.jpg';
import adminImg from '../../assets/admin_1.jpg';
import otherImg from '../../assets/hiring1.jpg';

export default function SpecialtyDivisions() {
  const divisions = [
    {
      icon: <HardHat className="w-5 h-5" />,
      title:'Engineering Recruitment',
      desc: 'We connect skilled professionals with technical and project-driven environments that demand precision, innovation, and real-world impact. Our focus spans Civil, Structural, Mechanical, Electrical, Architectural, and Estimation roles — helping organisations build teams that deliver practical solutions and engineering excellence.',
      image: engineeringImg,
      badge: 'MEP & Civil'
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      title: 'Accounting Recruitment',
      desc: 'Connects finance professionals who bring accuracy, insight, and reliability to every organisation. From Accountants and Payroll Officers to Bookkeepers, our candidates strengthen financial operations, reporting, and compliance — ensuring your business runs with clarity and confidence.',
      image: accountingImg,
      badge: 'Finance'
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5" />,
      title: 'Administration Recruitment',
      desc: 'Meet proactive individuals who keep operations running smoothly. Our talent pool includes Office Managers, Executive Assistants, Contract Administrators, and Receptionists, each selected for their communication skills, coordination ability, and commitment to professional service.',
      image: adminImg,
      badge: 'Operations'
    },
    {
      icon: <Box className="w-5 h-5" />,
      title: 'Other Divisions',
      desc: 'Discover versatile professionals across a wide range of specialized roles tailored to unique business needs. We connect organizations with adaptable talent from various industries, ensuring the right expertise, professionalism, and support for every opportunity.',
      image: otherImg,
      badge: 'Custom'
    },
  ];

  return (
    <section className="w-full py-24 bg-surface border-b border-border select-none overflow-hidden"       style={{ backgroundColor: 'rgb(200 197 167)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          {/* <ScrollReveal delay={0.05}>
            <span className="text-accent text-xs font-extrabold uppercase tracking-[0.2em] mb-3 inline-block px-3 py-1 rounded-full bg-accent-light border border-accent/10">
              DOMAINS & DIVISIONAL ALIGNMENTS
            </span>
          </ScrollReveal> */}
          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary tracking-tight mb-4">
              Specialist <span className="text-purple-900">Recruitment</span> Divisions
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-sm sm:text-base text-muted font-medium">
              We operate discrete specialist units to ensure deep domain mastery in every candidate search.
            </p>
          </ScrollReveal>
        </div>

        {/* Divisions Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" style={{ backgroundColor: 'rgb(195 196 185)' }}>
          {divisions.map((div, idx) => {
            const isWide = idx === 0 || idx === 3;
            const isEven = idx % 2 === 0;
            
            // Layout classes for the card wrapper
            const flexClasses = isWide
              ? `flex gap-4 sm:gap-6 items-center w-full h-full ${
                  isEven 
                    ? 'flex-col sm:flex-row' 
                    : 'flex-col-reverse sm:flex-row-reverse'
                }`
              : `flex gap-4 items-center w-full h-full ${
                  isEven 
                    ? 'flex-col sm:flex-col' 
                    : 'flex-col-reverse sm:flex-col'
                }`;
            
            return (
              <ScrollReveal 
                key={idx} 
                delay={idx * 0.08}
                direction={idx % 2 === 0 ? 'left' : 'right'}
                // Elastic Spring hop on Hover
                className={`hover:-translate-y-2.5 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer h-full ${
                  isWide ? 'col-span-1 sm:col-span-2 md:col-span-2' : 'col-span-1 sm:col-span-1 md:col-span-1'
                }`}
              >
                <Card3D 
                  className="group relative rounded-3xl bg-bg-page border border-border p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between h-full"
                  maxTilt={8}
                >
                  {/* Floating Glowing Orb (Best Premium Combination) */}
                  <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-tr from-accent/25 to-blue-400/5 blur-3xl pointer-events-none -z-10 floating-orb group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />

                  <div className="flex flex-col h-full justify-between w-full" >
                    <div className={flexClasses}>
                      {/* Small Animated Image Panel */}
                      <div className={
                        isWide
                          ? 'relative w-full sm:w-[38%] md:w-[35%] h-28 sm:h-[180px] md:h-[200px] overflow-hidden rounded-2xl bg-slate-900 border border-border shadow-inner shrink-0'
                          : 'relative w-full h-28 sm:h-32 overflow-hidden rounded-2xl bg-slate-900 border border-border shadow-inner shrink-0'
                      }>
                        <img
                          src={div.image}
                          alt={div.title}
                          className="w-full h-full object-cover filter brightness-[0.94] contrast-[1.01] transform group-hover:scale-108 transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                        />
                        {/* Dark overlay mask */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Small visual category tag */}
                        <div className={
                          isWide
                            ? 'absolute top-2 right-2 sm:top-4 sm:right-4 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-white/20 bg-black/45 backdrop-blur-[2px] text-white font-extrabold text-[7px] sm:text-[9px] tracking-wider uppercase select-none'
                            : 'absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md border border-white/20 bg-black/45 backdrop-blur-[2px] text-white font-extrabold text-[7px] sm:text-[8px] tracking-wider uppercase select-none'
                        }>
                          {div.badge}
                        </div>
                      </div>

                      {/* Text Container */}
                      <div className="flex-1 min-w-0 text-left w-full">
                        <h3 className={
                          isWide
                            ? 'text-base sm:text-xl md:text-2xl font-bold text-primary mb-1.5 sm:mb-3 tracking-tight font-display'
                            : 'text-base sm:text-base md:text-lg font-bold text-primary mb-1 sm:mb-2 tracking-tight font-display'
                        }>
                          {div.title}
                        </h3>

                        <p className="text-xs sm:text-xs md:text-sm text-gray-800 leading-relaxed font-medium">
                          {div.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
