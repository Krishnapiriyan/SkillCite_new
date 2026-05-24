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
      desc: 'Civil, Mechanical, Electrical, Structural, Project Engineering, Drafting.',
      image: engineeringImg,
      badge: 'MEP & Civil'
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      title: 'Accounting Recruitment',
      desc: 'Bookkeepers, Payroll Officers, Accountants.',
      image: accountingImg,
      badge: 'Finance'
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5" />,
      title: 'Administration Recruitment',
      desc: 'Office Managers, Executive Assistants, Receptionists.',
      image: adminImg,
      badge: 'Operations'
    },
    {
      icon: <Box className="w-5 h-5" />,
      title: 'Other Divisions',
      desc: 'Custom placements tailored to specialized project requirements.',
      image: otherImg,
      badge: 'Custom'
    },
  ];

  return (
    <section className="w-full py-24 bg-surface border-b border-border select-none overflow-hidden"       style={{ backgroundColor: 'rgb(153 186 180 / 70%)' }}>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {divisions.map((div, idx) => (
            <ScrollReveal 
              key={idx} 
              delay={idx * 0.08}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              // Elastic Spring hop on Hover
              className="hover:-translate-y-2.5 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer"
            >
              <Card3D 
                className="group relative rounded-3xl bg-bg-page border border-border p-5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between h-[290px]"
                maxTilt={8}
              >
                {/* Floating Glowing Orb (Best Premium Combination) */}
                <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-tr from-accent/25 to-blue-400/5 blur-3xl pointer-events-none -z-10 floating-orb group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />

                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Small Animated Image Panel */}
                    <div className="relative w-full h-32 overflow-hidden rounded-2xl mb-5 bg-slate-900 border border-border shadow-inner">
                      <img
                        src={div.image}
                        alt={div.title}
                        className="w-full h-full object-cover filter brightness-[0.94] contrast-[1.01] transform group-hover:scale-108 transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      {/* Dark overlay mask */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Small visual category tag */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md border border-white/20 bg-black/45 backdrop-blur-[2px] text-white font-extrabold text-[8px] tracking-wider uppercase select-none">
                        {div.badge}
                      </div>
                    </div>

                    {/* Circular Floating Icon overlay */}
                    {/* <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center mb-4 shadow-sm border border-accent/5">
                      {div.icon}
                    </div> */}

                    <h3 className="text-base sm:text-lg font-bold text-primary mb-2 tracking-tight font-display">
                      {div.title}
                    </h3>

                    <p className="text-xs text-muted leading-relaxed font-semibold">
                      {div.desc}
                    </p>
                  </div>

                  {/* Tiny subtle indicator */}
                  {/* <div className="text-[10px] font-bold text-accent tracking-widest uppercase opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300 mt-4 flex items-center gap-1.5">
                    Explore Division <span className="text-xs">→</span>
                  </div> */}
                </div>
              </Card3D>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
