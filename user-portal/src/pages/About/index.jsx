import useCms from '../../hooks/useCms';
import ScrollReveal from '../../components/animations/ScrollReveal';
import PageSEO from '../../components/ui/PageSEO';
import Card3D from '../../components/animations/Card3D';
import FocusRingsBackground from '../../components/animations/FocusRingsBackground';
import HoneycombBackground from '../../components/animations/HoneycombBackground';
import IsometricGridBackground from '../../components/animations/IsometricGridBackground';
import Button from '../../components/ui/Button';
import { ShieldCheck, Lock, Target, TrendingUp, ArrowRight } from 'lucide-react';
import aboutTeam from '../../assets/about_team.webp';

export default function About() {
  const { getCms } = useCms();
  const spacer = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"; // 32 non-breaking spaces
  const dot = <span className="text-2xl font-black inline-block align-middle relative -top-[3px]">.</span>;


  return (
    <>
      <PageSEO
        title="About Us | Ethical Engineering Placements | SkillCite"
        description="Learn how SkillCite delivers premium human recruitment matches and offline engineering services without automated matching scripts."
        canonical="/about"
      />

      <div className="min-h-screen">
        <section className="py-24 md:py-32 bg-transparent overflow-hidden relative">
          <HoneycombBackground />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <ScrollReveal delay={0.1} direction="up">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-none mb-8 font-display">
                    Our Story<br/> <span className="text-muted">Reliable Hiring</span> <br />
                    <span className="text-purple-900">Real Growth</span>
                  </h1>
                </ScrollReveal>
                <ScrollReveal delay={0.2} direction="up">
                  <p className="text-[16px] text-muted mb-10 leading-relaxed max-w-[600px] font-semibold">
                    SkillCite simplifies recruitment by connecting the right talent with the right opportunities through a structured and verified process. Candidate profiles are carefully evaluated based on skills, qualifications, and experience while maintaining privacy during the early stages of recruitment. We also support organizations with technical service requests, delivering reliable solutions through a personalized and professional approach.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.3} direction="up">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="filled" 
                      className="px-10 py-3.5 w-full sm:w-auto font-bold shadow-lg shadow-purple-700/20 hover:shadow-xl hover:shadow-purple-700/30 duration-300 transform hover:-translate-y-0.5 bg-purple-950 border-slate-300 hover:bg-purple-700 hover:text-white hover:border-cyan-600"
                      onClick={() => document.getElementById('our-mission').scrollIntoView({ behavior: 'smooth' })}
                    >
                      Explore Our Story <ArrowRight className="ml-2 w-5 h-5 animate-pulse" />
                    </Button>
                  </div>
                </ScrollReveal>
              </div>
              
              <div className="relative group w-full max-w-sm sm:max-w-md mx-auto cursor-pointer lusion-image-hover lusion-image-float mt-12 lg:mt-0">
                <ScrollReveal delay={0.25} direction="right">
                  <Card3D className="group relative bg-transparent rounded-[2.5rem]" maxTilt={10}>
                    {/* Floating Glowing Orb (Best Premium Combination) */}
                    <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-purple-500/30 to-purple-400/10 blur-3xl pointer-events-none -z-10 floating-orb group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />
                    
                    {/* Clean Borderless Showcase (Removed thick white frame border) */}
                    <div className="relative w-full h-[280px] sm:h-[360px] overflow-hidden rounded-[2.5rem] shadow-2xl">
                      <img 
                        src={aboutTeam} 
                        alt="About SkillCite Team" 
                        className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02] rounded-[2.5rem] transform group-hover:scale-108 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-page/40 to-transparent pointer-events-none rounded-[2.5rem]"></div>
                    </div>
                  </Card3D>
                </ScrollReveal>
              </div>
            </div>
          </div>
          {/* Fade to mission section (olive) */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[rgb(205,206,195)] pointer-events-none z-0" />
        </section>
        
        {/* Section 1: Our Story */}
        {/* <section id="our-story" className="w-full pt-20 pb-28 relative overflow-hidden shadow-[inset_0_-24px_32px_-12px_rgba(0,0,0,0.14)]" style={{ backgroundColor: 'rgb(200 197 167)' }}>
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
        </section> */}

        {/* Section 2: Our Mission */}
        <section id="our-mission" className="w-full py-28 relative overflow-hidden" style={{ backgroundColor: 'rgb(195, 196, 185)' }}>
          <IsometricGridBackground />
          {/* Fade from previous section */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[rgb(205,206,195)] to-transparent pointer-events-none z-0" />
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
        <section className="w-full py-4" style={{ backgroundColor: '#b4afb6' }}>
          <ScrollReveal delay={0.2}>
            <div className="ticker-wrap w-full">
              <div className="ticker-content-left inline-flex items-center text-black uppercase font-bold tracking-widest text-[10px] md:text-xs">
                <span className="whitespace-nowrap">
                  Trusted Recruitment Platform{spacer}{dot}{spacer}
                  Verified Employer & Candidate Process{spacer}{dot}{spacer}
                  Data Privacy Protection Standards{spacer}{dot}{spacer}
                </span>
                <span className="whitespace-nowrap">
                  Trusted Recruitment Platform{spacer}{dot}{spacer}
                  Verified Employer & Candidate Process{spacer}{dot}{spacer}
                  Data Privacy Protection Standards{spacer}{dot}{spacer}
                </span>
              </div>
            </div>
          </ScrollReveal>
        </section>

      </div>
    </>
  );
}
