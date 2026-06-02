import useCms from '../../hooks/useCms';
import ScrollReveal from '../../components/animations/ScrollReveal';
import PageSEO from '../../components/ui/PageSEO';
import Card3D from '../../components/animations/Card3D';
import FocusRingsBackground from '../../components/animations/FocusRingsBackground';
import { ShieldCheck, Lock, Target, TrendingUp } from 'lucide-react';

export default function About() {
  const { getCms } = useCms();

  return (
    <>
      <PageSEO
        title="About Us | Ethical Engineering Placements | SkillCite"
        description="Learn how SkillCite delivers premium human recruitment matches and offline engineering services without automated matching scripts."
        canonical="/about"
      />

      <div className="min-h-screen select-none">
        
        {/* Section 1: Our Story */}
        <section className="w-full pt-20 pb-28 border-b border-border/60 relative overflow-hidden" style={{ backgroundColor: 'rgb(200 197 167)' }}>
          <FocusRingsBackground />
          <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
            <ScrollReveal delay={0.05}>
              <span className="text-[13px] font-bold text-purple-900 tracking-widest uppercase mb-4 block">
                Our Story
              </span>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-10 font-display">
                Reliable Hiring, <br />
                <span className="text-purple-950">Real Growth</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.15} className="text-sm sm:text-base text-primary/95 leading-relaxed space-y-6 text-left font-semibold">
              <p>
                {getCms('about.story_p1', 'SkillCite was created to improve how people are matched with jobs and opportunities. Many skilled candidates were not being placed in the right roles and employers were spending too much time reviewing unsuitable job applications. The platform was designed to solve this through a structured and verified process.')}
              </p>
              <p>
                {getCms('about.story_p2', 'The system uses clear role-based matching and structured evaluation of candidate profiles based on experience, qualifications, and job requirements, with controlled communication managed by the team. Candidate identity is protected during early stages and only shortlisted profiles are shared through the selection process.')}
              </p>
              <p>
                {getCms('about.story_p3', 'Today, SkillCite supports employers and candidates through a reliable process for job matching and technical service requests ensuring better alignment and smoother outcomes.')}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Section 2: Our Mission */}
        <section className="w-full py-28 border-b border-border/60 relative overflow-hidden" style={{ backgroundColor: 'rgb(195, 196, 185)' }}>
          <FocusRingsBackground />
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
            
            {/* Left Column: Mission Description */}
            <ScrollReveal className="lg:col-span-6 text-left" delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 tracking-tight font-display">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-primary/90 leading-relaxed font-semibold">
                {getCms('about.mission', 'SkillCite aims to connect candidates with suitable job opportunities and provide structured technical services through a clear, verified, and controlled process that ensures fairness, accuracy and reliability for both employers and candidates.')}
              </p>
            </ScrollReveal>

            {/* Right Column: Values 2x2 Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Value 1: Integrity */}
              <ScrollReveal delay={0.15} direction="left">
                <Card3D className="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-3xl border border-border bg-surface shadow-md cursor-pointer h-full" maxTilt={6}>
                  <div className="flex items-center space-x-3 mb-3">
                    <ShieldCheck className="w-5 h-5 text-purple-900 shrink-0" />
                    <h4 className="font-bold text-primary font-display">Integrity</h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed font-semibold text-left">
                    {getCms('about.value_integrity', 'All job postings and applications are reviewed through a structured approval process to ensure fairness and transparency.')}
                  </p>
                </Card3D>
              </ScrollReveal>

              {/* Value 2: Accuracy */}
              <ScrollReveal delay={0.2} direction="right">
                <Card3D className="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-3xl border border-border bg-surface shadow-md cursor-pointer h-full" maxTilt={6}>
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="w-5 h-5 text-purple-900 shrink-0" />
                    <h4 className="font-bold text-primary font-display">Accuracy</h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed font-semibold text-left">
                    {getCms('about.value_accuracy', 'Candidates are matched with their selected preferences to ensure better alignment with available opportunities.')}
                  </p>
                </Card3D>
              </ScrollReveal>

              {/* Value 3: Privacy */}
              <ScrollReveal delay={0.25} direction="left">
                <Card3D className="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-3xl border border-border bg-surface shadow-md cursor-pointer h-full" maxTilt={6}>
                  <div className="flex items-center space-x-3 mb-3">
                    <Lock className="w-5 h-5 text-purple-900 shrink-0" />
                    <h4 className="font-bold text-primary font-display">Privacy</h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed font-semibold text-left">
                    {getCms('about.value_privacy', 'Candidate information is protected and only shared with employers at the appropriate stage of the process.')}
                  </p>
                </Card3D>
              </ScrollReveal>

              {/* Value 4: Outcomes */}
              <ScrollReveal delay={0.3} direction="right">
                <Card3D className="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-3xl border border-border bg-surface shadow-md cursor-pointer h-full" maxTilt={6}>
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-purple-900 shrink-0" />
                    <h4 className="font-bold text-primary font-display">Outcomes</h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed font-semibold text-left">
                    {getCms('about.value_outcomes', 'Success is measured through correct job matching, verified placements and consistent service delivery.')}
                  </p>
                </Card3D>
              </ScrollReveal>

            </div>

          </div>
        </section>

        {/* Section 3: Banner */}
        <section className="w-full py-14" style={{ backgroundColor: 'rgb(195, 196, 185)' }}>
          <ScrollReveal delay={0.2}>
            <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-6 md:gap-12 text-xs sm:text-sm font-bold text-muted uppercase tracking-widest text-center opacity-85">
              <span>Trusted Recruitment Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent/30 hidden md:inline"></span>
              <span>Verified Employer & Candidate Process</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent/30 hidden md:inline"></span>
              <span>Data Privacy Protection Standards</span>
            </div>
          </ScrollReveal>
        </section>

      </div>
    </>
  );
}
