import useCms from '../../hooks/useCms';
import ScrollReveal from '../../components/animations/ScrollReveal';
import PageSEO from '../../components/ui/PageSEO';
import Card3D from '../../components/animations/Card3D';
import { Award, ShieldCheck, Heart } from 'lucide-react';

export default function About() {
  const { getCms } = useCms();

  return (
    <>
      <PageSEO
        title="About Us | Ethical Engineering Placements | SkillCite"
        description="Learn how SkillCite delivers premium human recruitment matches and offline engineering services without automated matching scripts."
        canonical="/about"
      />

      <div className="pt-20 pb-24 bg-bg-page min-h-screen select-none" style={{ backgroundColor: 'rgba(153, 186, 180, 0.7)' }}>
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Header */}
          <ScrollReveal className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-primary mb-4 tracking-tight">
              {getCms('about.title', 'About')} <span className="text-purple-900">SkillCite</span>            </h1>
            <p className="text-sm sm:text-base text-muted font-bold max-w-xl mx-auto uppercase tracking-wider">
              Human Intake • Advanced Security • Technical Mastery
            </p>
          </ScrollReveal>

          {/* New Fluid 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Descriptions + High-End Team Image */}
            <div className="lg:col-span-6 flex flex-col gap-8">
              <ScrollReveal delay={0.2} className="bg-surface rounded-3xl border border-border p-8 shadow-lg">
                <p className="text-sm sm:text-base text-primary/80 leading-relaxed font-semibold">
                  {getCms('about.description', 'We are a premier recruitment agency and technical engineering consultancy. Rather than relying on automated matching pipelines, we believe in manual excellence. Every resume, recruitment request, and technical service spec is reviewed by a senior engineer.')}
                </p>
              </ScrollReveal>

              {/* Floating Glassmorphic Team Image */}
              <ScrollReveal delay={0.3}>
                <div className="relative p-2.5 bg-white/45 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl shadow-blue-500/10 overflow-hidden transform hover:scale-[1.015] hover:-rotate-0.5 transition-all duration-500">
                  <img 
                    src="/src/assets/about_team.png" 
                    alt="SkillCite Structural Engineering Consultants"
                    className="w-full h-[280px] object-cover rounded-[2rem] filter brightness-[0.98] contrast-[1.01]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent mix-blend-overlay rounded-[2rem] pointer-events-none" />
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Values grid with 3D Tilt Cards */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              
              {/* Value 1 */}
              <ScrollReveal delay={0.3} direction="left">
                <Card3D className="p-8 rounded-3xl border border-border bg-surface shadow-md cursor-pointer">
                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center text-accent shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="text-lg font-bold text-primary mb-2">Ethical Human Intake</h3>
                      <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
                        We manually review every single CV. No keyword screening filters, no sorting algorithms. Only direct expert review matching genuine potential with ideal placements.
                      </p>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>

              {/* Value 2 */}
              <ScrollReveal delay={0.4} direction="right">
                <Card3D className="p-8 rounded-3xl border border-border bg-surface shadow-md cursor-pointer">
                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center text-accent shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="text-lg font-bold text-primary mb-2">High Grade Security</h3>
                      <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
                        Resumes and technical specifications are highly encrypted, safely housed in dedicated cloud spaces, and exclusively reviewed offline by authorized directors.
                      </p>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>

              {/* Value 3 */}
              <ScrollReveal delay={0.5} direction="left">
                <Card3D className="p-8 rounded-3xl border border-border bg-surface shadow-md cursor-pointer">
                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center text-accent shrink-0">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="text-lg font-bold text-primary mb-2">Technical Mastery</h3>
                      <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
                        Autodesk-licensed designers and expert structural estimators execute DWG drawings, computations, and calculations offline with precision accuracy.
                      </p>
                    </div>
                  </div>
                </Card3D>
              </ScrollReveal>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}
