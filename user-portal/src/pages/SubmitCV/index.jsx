import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, Award, Globe, ShieldCheck, Cpu, Handshake, CircleDollarSign, HardHat, Calculator, ArrowRight, FileText, Layers, CheckCircle2 } from 'lucide-react';
import { submitCandidateCvApi } from '../../services/api';

import PageSEO from '../../components/ui/PageSEO';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TagInput from '../../components/ui/TagInput';
import FileDropzone from '../../components/ui/FileDropzone';
import SuccessScreen from '../../components/ui/SuccessScreen';
import Button from '../../components/ui/Button';
import Card3D from '../../components/animations/Card3D';
import resume3 from '../../assets/submit_cv_01.webp';
import submitCv1 from '../../assets/submit_cv/1.webp';
import submitCv2 from '../../assets/submit_cv/2.webp';
import submitCv3 from '../../assets/submit_cv/3.webp';
import submitCv4 from '../../assets/submit_cv/4.webp';
import HoneycombBackground from '../../components/animations/HoneycombBackground';
import IsometricGridBackground from '../../components/animations/IsometricGridBackground';
import ScrollReveal from '../../components/animations/ScrollReveal';

// Inline premium custom SVG branded icons
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);


// Validation Schema
const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  state: z.string().min(1, 'Please select your state'),
  specialty: z.enum(['engineering', 'accounting', 'administrative', 'other'], {
    errorMap: () => ({ message: 'Please select a recruitment specialty' })
  }),
  careerExperience: z.string().min(1, 'Please select your career experience'),
  careerGoals: z.array(z.string()).min(1, 'Please select at least one career goal'),
  preferredCommunication: z.string().min(1, 'Please select preferred communication method'),
  resume: z.any().refine((val) => val && val.length > 0, {
    message: 'Please upload your resume / CV'
  }),
  coverLetter: z.any().optional().nullable()
});

export default function SubmitCV() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      state: '',
      specialty: 'engineering',
      careerExperience: '',
      careerGoals: [],
      preferredCommunication: '',
      resume: [],
      coverLetter: []
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'resume') {
          if (data.resume && data.resume[0]) {
            payload.append('resume', data.resume[0]);
          }
        } else if (key === 'coverLetter') {
          if (data.coverLetter && data.coverLetter[0]) {
            payload.append('coverLetter', data.coverLetter[0]);
          }
        } else if (key === 'careerGoals') {
          payload.append('careerGoals', JSON.stringify(data[key]));
        } else if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });

      const res = await submitCandidateCvApi(payload);
      if (res.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to submit CV');
    } finally {
      setLoading(false);
    }
  };

  const divisions = [
    { value: 'engineering', label: 'Engineering', desc: 'Civil, Mech, AutoCAD drawing placements' },
    { value: 'accounting', label: 'Accounting', desc: 'Bookkeepers, auditors and corporate accountants' },
    { value: 'administrative', label: 'Administration', desc: 'Office managers, HR admins and coordinators' },
    { value: 'other', label: 'Other', desc: 'Custom non-technical specialized matching' },
  ];

  const states = [
    'New South Wales',
    'Victoria',
    'Queensland',
    'South Australia',
    'Northern Territory',
    'Western Australia',
    'Tasmania',
    'Australian Capital Territory'
  ];
  const experienceOptions = [
    'C-suite',
    'Manager',
    '10+ years',
    '5-10 years',
    '1-5 years',
    'Looking for first role'
  ];
  const goalOptions = [
    { value: 'Permanent', label: 'Permanent Opportunities' },
    { value: 'Contract', label: 'Contract Opportunities' },
    { value: 'Advice', label: 'Career Advice & Mentorship' },
    { value: 'Exploring', label: 'Exploring the Market' },
    { value: 'Chat', label: 'Just having a friendly Chat' }
  ];
  const communicationOptions = ['Phone', 'Email', 'SMS'];

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-20 bg-bg-page min-h-screen flex items-center justify-center">
        <SuccessScreen
          title="Resume Submitted Successfully"
          message={`Thank you, ${watch('firstName')}. Your application has been logged into our systems. Our recruitment specialists will personally evaluate your background against current openings and contact you via your preferred communication method (${watch('preferredCommunication')}) shortly.`}
          onBack={() => {
            setIsSubmitted(false);
            window.location.reload();
          }}
        />
      </div>
    );
  }

  const handleGoalCheckbox = (val, checked) => {
    const current = watch('careerGoals') || [];
    if (checked) {
      setValue('careerGoals', [...current, val], { shouldValidate: true });
    } else {
      setValue('careerGoals', current.filter((x) => x !== val), { shouldValidate: true });
    }
  };

  return (
    <>
      <PageSEO
        title="Submit Your Engineering Resume / CV | SkillCite"
        description="Join our premium talent network. Submit your CV for personalized matching by real human recruiters."
        canonical="/submit-your-cv"
      />

      <div className="bg-bg-page min-h-screen text-primary pt-0">
        {/* 1. Hero Section */}
        <section className="py-24 md:py-32 bg-transparent overflow-hidden relative">
          <HoneycombBackground />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <ScrollReveal delay={0.1} direction="up">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-none mb-8 font-display">
                    Professional<span className="text-muted"> Career</span> <br />
                    <span className="text-purple-900">Opportunities</span>
                  </h1>
                </ScrollReveal>
                <ScrollReveal delay={0.2} direction="up">
                  <p className="text-[16px] text-muted mb-10 leading-relaxed max-w-[600px] font-semibold">
                    SkillCite works exclusively with engineering, accounting and administrative professionals. We bridge the gap between high-tier talent and industry-leading organisations through a secure platform.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.3} direction="up">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="filled" 
                      className="px-10 py-3.5 w-full sm:w-auto font-bold tracking-wide shadow-lg shadow-purple-800/20 hover:shadow-xl hover:shadow-purple-800/30 transition-all duration-300 transform hover:-translate-y-0.5 text-white bg-purple-950 border-slate-300 hover:bg-purple-700 hover:text-white hover:border-cyan-600"
                      onClick={() => document.getElementById('submit-cv-form').scrollIntoView({ behavior: 'smooth' })}
                    >
                      Submit CV Today <ArrowRight className="ml-2 w-5 h-5 animate-pulse" />
                    </Button>
                  </div>
                </ScrollReveal>
              </div>
              
              <div className="relative group w-full max-w-sm sm:max-w-md mx-auto cursor-pointer lusion-image-hover lusion-image-float mt-12 lg:mt-0">
                <ScrollReveal delay={0.25} direction="right">
                  <Card3D className="group relative bg-transparent rounded-[2.5rem]" maxTilt={10}>
                    {/* Floating Glowing Orb (Best Premium Combination) */}
                    <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-accent/30 to-blue-400/10 blur-3xl pointer-events-none -z-10 floating-orb group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />
                    
                    {/* Clean Borderless Showcase (Removed thick white frame border) */}
                    <div className="relative w-full h-[280px] sm:h-[360px] overflow-hidden rounded-[2.5rem] shadow-2xl">
                      <img 
                        src={resume3} 
                        alt="Confidential Career Advancement" 
                        className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02] rounded-[2.5rem] transform group-hover:scale-108 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-page/40 to-transparent pointer-events-none rounded-[2.5rem]"></div>
                    </div>
                  </Card3D>
                </ScrollReveal>
              </div>
            </div>
          </div>
          {/* Fade to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#E5E7EB] pointer-events-none z-0" />
        </section>

        {/* 3. How It Works Section */}
        <section className="py-24 bg-transparent relative overflow-hidden">
          <IsometricGridBackground />
          {/* Fade from previous section */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#E5E7EB] to-transparent pointer-events-none z-0" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-28">
              <ScrollReveal delay={0.1} direction="up">
                <span className="text-[13px] font-bold text-purple-700 tracking-widest uppercase mb-4 block">The Process</span>
              </ScrollReveal>
              <ScrollReveal delay={0.15} direction="up">
                <h2 className="text-3xl md:text-5xl font-extrabold text-purple-950 mb-6 tracking-tight font-display">Your Journey to Placement</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.2} direction="up">
                <p className="text-sm sm:text-base text-muted font-semibold max-w-xl mx-auto leading-relaxed">
                  SkillCite follows a structured workflow where jobs are verified by the team and candidates are matched based on approved roles.
                </p>
              </ScrollReveal>
            </div>

            {/* Central timeline connector line on desktop */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-52 bottom-64 w-[2px] bg-gradient-to-b from-purple-700/0 via-purple-700/15 to-purple-700/0 pointer-events-none" />

            {/* Alternating Steps with Images */}
            <div className="flex flex-col gap-20 md:gap-28 relative">
              
              {/* Step 1 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center relative">
                {/* Timeline center node indicator */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-bg-page border-2 border-purple-700 items-center justify-center z-20 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-700 animate-pulse" />
                </div>

                <div className="md:col-span-6 order-2 md:order-1 relative group w-full">
                  <ScrollReveal delay={0.25} direction="left">
                    <Card3D className="group relative bg-transparent rounded-[2rem]" maxTilt={6}>
                      {/* Interactive Subtle Glow behind image card */}
                      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-purple-500/10 to-purple-700/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />
                      
                      <div className="relative w-full aspect-[4/3] sm:aspect-[1.5/1] md:aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl border border-border/40">
                        <img 
                          src={submitCv1} 
                          alt="Submit Resume Profile Creation" 
                          className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02] rounded-[2rem] transform group-hover:scale-106 transition-transform duration-[1.5s]"
                        />
                        {/* Soft Brand Vignette overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-page/50 via-transparent to-purple-950/5 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Elite Phase Pill Badge */}
                        {/* <div className="absolute top-4 left-4 py-1.5 px-4 bg-surface/90 backdrop-blur-md border border-border/60 text-[10px] font-black text-purple-950 uppercase tracking-widest rounded-full shadow-sm">
                          Phase 01: Application
                        </div> */}
                      </div>
                    </Card3D>
                  </ScrollReveal>
                </div>

                <div className="md:col-span-6 flex flex-col items-start order-1 md:order-2 text-left relative pl-0 md:pl-8">
                  {/* Clean Step Number Indicator directly over the text */}
                  <div className="flex items-center gap-3.5 mb-3 font-display select-none">
                    <span className="text-3xl font-black text-purple-700/40 leading-none">01</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-700/30" />
                    {/* <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-700/10 text-purple-900 border border-purple-700/20 shadow-inner">
                      <FileText className="w-4 h-4" />
                    </div> */}
                  </div>
                  
                  <ScrollReveal delay={0.15} direction="up">
                    <h3 className="text-2xl font-bold text-primary mb-3 font-display relative">
                      Profile Verification
                    </h3>
                  </ScrollReveal>
                  
                  {/* Decorative Short Line */}
                  <div className="w-12 h-1 bg-purple-700 rounded-full mb-5" />
                  
                  <ScrollReveal delay={0.2} direction="up">
                    <p className="text-sm sm:text-base text-muted leading-relaxed font-semibold mb-6">
                      Employers post their job openings, and candidates upload their resumes. SkillCite matches the right role to the right person.
                    </p>
                  </ScrollReveal>

                  {/* High Value Highlights Grid */}
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full border-t border-border/40 pt-5">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 mr-2 shrink-0" />
                      <span className="text-xs text-muted font-bold">Resume Intake</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 mr-2 shrink-0" />
                      <span className="text-xs text-muted font-bold">Skill Tagging</span>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center relative">
                {/* Timeline center node indicator */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-bg-page border-2 border-purple-700 items-center justify-center z-20 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-700 animate-pulse" />
                </div>

                <div className="md:col-span-6 flex flex-col items-start text-left relative pr-0 md:pr-8">
                  {/* Clean Step Number Indicator directly over the text */}
                  <div className="flex items-center gap-3.5 mb-3 font-display select-none">
                    <span className="text-3xl font-black text-purple-700/40 leading-none">02</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-700/30" />
                    {/* <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-700/10 text-purple-900 border border-purple-700/20 shadow-inner">
                      <Briefcase className="w-4 h-4" />
                    </div> */}
                  </div>

                  <ScrollReveal delay={0.15} direction="up">
                    <h3 className="text-2xl font-bold text-primary mb-3 font-display relative">
                      Selection & Shortlist
                    </h3>
                  </ScrollReveal>
                  
                  {/* Decorative Short Line */}
                  <div className="w-12 h-1 bg-purple-700 rounded-full mb-5" />
                  
                  <ScrollReveal delay={0.2} direction="up">
                    <p className="text-sm sm:text-base text-muted leading-relaxed font-semibold mb-6">
                      Our recruitment specialist team reviews all uploaded CVs and shortlists suitable candidates for active placement matches.
                    </p>
                  </ScrollReveal>

                  {/* High Value Highlights Grid */}
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full border-t border-border/40 pt-5">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 mr-2 shrink-0" />
                      <span className="text-xs text-muted font-bold">Manual Vetting</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 mr-2 shrink-0" />
                      <span className="text-xs text-muted font-bold">Profile Matching</span>
                    </div>
                  </div> */}
                </div>

                <div className="md:col-span-6 relative group w-full">
                  <ScrollReveal delay={0.25} direction="right">
                    <Card3D className="group relative bg-transparent rounded-[2rem]" maxTilt={6}>
                      {/* Interactive Glow */}
                      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-purple-500/10 to-purple-700/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />

                      <div className="relative w-full aspect-[4/3] sm:aspect-[1.5/1] md:aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl border border-border/40">
                        <img 
                          src={submitCv2} 
                          alt="Manual Selection and Vetting" 
                          className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02] rounded-[2rem] transform group-hover:scale-106 transition-transform duration-[1.5s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-page/50 via-transparent to-purple-950/5 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Elite Phase Pill Badge */}
                        {/* <div className="absolute top-4 left-4 py-1.5 px-4 bg-surface/90 backdrop-blur-md border border-border/60 text-[10px] font-black text-purple-950 uppercase tracking-widest rounded-full shadow-sm">
                          Phase 02: Selection
                        </div> */}
                      </div>
                    </Card3D>
                  </ScrollReveal>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center relative">
                {/* Timeline center node indicator */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-bg-page border-2 border-purple-700 items-center justify-center z-20 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-700 animate-pulse" />
                </div>

                <div className="md:col-span-6 order-2 md:order-1 relative group w-full">
                  <ScrollReveal delay={0.25} direction="left">
                    <Card3D className="group relative bg-transparent rounded-[2rem]" maxTilt={6}>
                      {/* Interactive Glow */}
                      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-purple-500/10 to-purple-700/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />

                      <div className="relative w-full aspect-[4/3] sm:aspect-[1.5/1] md:aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl border border-border/40">
                        <img 
                          src={submitCv3} 
                          alt="Employer Interview Review" 
                          className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02] rounded-[2rem] transform group-hover:scale-106 transition-transform duration-[1.5s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-page/50 via-transparent to-purple-950/5 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Elite Phase Pill Badge */}
                        {/* <div className="absolute top-4 left-4 py-1.5 px-4 bg-surface/90 backdrop-blur-md border border-border/60 text-[10px] font-black text-purple-950 uppercase tracking-widest rounded-full shadow-sm">
                          Phase 03: Evaluation
                        </div> */}
                      </div>
                    </Card3D>
                  </ScrollReveal>
                </div>

                <div className="md:col-span-6 flex flex-col items-start order-1 md:order-2 text-left relative pl-0 md:pl-8">
                  {/* Clean Step Number Indicator directly over the text */}
                  <div className="flex items-center gap-3.5 mb-3 font-display select-none">
                    <span className="text-3xl font-black text-purple-700/40 leading-none">03</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-700/30" />
                    {/* <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-700/10 text-purple-900 border border-purple-700/20 shadow-inner">
                      <Layers className="w-4 h-4" />
                    </div> */}
                  </div>

                  <ScrollReveal delay={0.15} direction="up">
                    <h3 className="text-2xl font-bold text-primary mb-3 font-display relative">
                      Employer Review
                    </h3>
                  </ScrollReveal>
                  
                  {/* Decorative Short Line */}
                  <div className="w-12 h-1 bg-purple-700 rounded-full mb-5" />
                  
                  <ScrollReveal delay={0.2} direction="up">
                    <p className="text-sm sm:text-base text-muted leading-relaxed font-semibold mb-6">
                      Shortlisted candidate profiles are shared with top‑tier employers along with detailed, role‑specific insights. Each introduction is based solely on verified skills, experience, and organisational fit.
                    </p>
                  </ScrollReveal>

                  {/* High Value Highlights Grid */}
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full border-t border-border/40 pt-5">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 mr-2 shrink-0" />
                      <span className="text-xs text-muted font-bold">Direct Interviews</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 mr-2 shrink-0" />
                      <span className="text-xs text-muted font-bold">Hiring Panels</span>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center relative">
                {/* Timeline center node indicator */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-bg-page border-2 border-purple-700 items-center justify-center z-20 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-700 animate-pulse" />
                </div>

                <div className="md:col-span-6 flex flex-col items-start text-left relative pr-0 md:pr-8">
                  {/* Clean Step Number Indicator directly over the text */}
                  <div className="flex items-center gap-3.5 mb-3 font-display select-none">
                    <span className="text-3xl font-black text-purple-700/40 leading-none">04</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-700/30" />
                    {/* <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-700/10 text-purple-900 border border-purple-700/20 shadow-inner">
                      <CheckCircle2 className="w-4 h-4" />
                    </div> */}
                  </div>

                  <ScrollReveal delay={0.15} direction="up">
                    <h3 className="text-2xl font-bold text-primary mb-3 font-display relative">
                      Final Outcome
                    </h3>
                  </ScrollReveal>
                  
                  {/* Decorative Short Line */}
                  <div className="w-12 h-1 bg-purple-700 rounded-full mb-5" />
                  
                  <ScrollReveal delay={0.2} direction="up">
                    <p className="text-sm sm:text-base text-muted leading-relaxed font-semibold mb-6">
                      Selected candidates are confirmed through SkillCite, managing placement offers and structural transition support to secure successful onboarding.
                    </p>
                  </ScrollReveal>

                  {/* High Value Highlights Grid */}
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full border-t border-border/40 pt-5">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 mr-2 shrink-0" />
                      <span className="text-xs text-muted font-bold">Offer Management</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-700 mr-2 shrink-0" />
                      <span className="text-xs text-muted font-bold">Onboarding Support</span>
                    </div>
                  </div> */}
                </div>

                <div className="md:col-span-6 relative group w-full">
                  <ScrollReveal delay={0.25} direction="right">
                    <Card3D className="group relative bg-transparent rounded-[2rem]" maxTilt={6}>
                      {/* Interactive Glow */}
                      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-purple-500/10 to-purple-700/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />

                      <div className="relative w-full aspect-[4/3] sm:aspect-[1.5/1] md:aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl border border-border/40">
                        <img 
                          src={submitCv4} 
                          alt="Placement and Onboarding Outcome" 
                          className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02] rounded-[2rem] transform group-hover:scale-106 transition-transform duration-[1.5s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-page/50 via-transparent to-purple-950/5 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Elite Phase Pill Badge */}
                        {/* <div className="absolute top-4 left-4 py-1.5 px-4 bg-surface/90 backdrop-blur-md border border-border/60 text-[10px] font-black text-purple-950 uppercase tracking-widest rounded-full shadow-sm">
                          Phase 04: Placement
                        </div> */}
                      </div>
                    </Card3D>
                  </ScrollReveal>
                </div>
              </div>

            </div>

            {/* Placement Divisions horizontal showcase card */}
            <ScrollReveal delay={0.2} direction="up" className="mt-32">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-border shadow-2xl p-10 bg-surface/60 max-w-4xl mx-auto backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-800/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 className="text-2xl font-bold text-center text-primary mb-8 font-display">Our Placement Divisions</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  {[
                    { icon: <HardHat className="w-5 h-5" />, title: 'Engineering', desc: 'Civil, Structural, Mechanical & AutoCAD design roles' },
                    { icon: <Briefcase className="w-5 h-5" />, title: 'Administration', desc: 'Project controllers, coordinators & office management' },
                    { icon: <Calculator className="w-5 h-5" />, title: 'Accounting', desc: 'Project accounting, CPA support & corporate auditing' },
                    { icon: <Globe className="w-5 h-5" />, title: 'Other', desc: 'Corporate specialists & custom non-technical placements' }
                  ].map((div, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-bg-page/40 border border-border flex flex-col items-start gap-3 hover:border-purple-700 hover:bg-bg-page/80 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-purple-700/10 flex items-center justify-center text-purple-950 border border-purple-700/20 shadow-inner">
                        {div.icon}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-primary mb-1 font-display leading-tight">{div.title}</h4>
                        {/* <p className="text-[11px] text-muted font-semibold leading-normal mt-1">{div.desc}</p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

          </div>
          {/* Fade to form section */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#E5E7EB] pointer-events-none z-0" />
        </section>

        {/* 4. Form Section */}
        <section id="submit-cv-form" className="py-24 bg-[#F7F5F0] scroll-mt-20 relative overflow-hidden">
          {/* Fade from previous section */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#E5E7EB] to-transparent pointer-events-none z-0" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <ScrollReveal delay={0.1} direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-primary tracking-tight font-display mb-3">Join Our <span className="text-purple-700">Talent</span> Network</h2>
                <p className="text-sm text-muted font-semibold max-w-md mx-auto">
                  We reject automated candidate-matching scripts. Submit your resume, and a real expert senior recruiter will review your profile manually.
                </p>
              </div>
            </ScrollReveal>
            
            {/* Form container */}
            <ScrollReveal delay={0.2} direction="up">
              <form 
                onSubmit={handleSubmit(onSubmit)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                  }
                }}
                className="flex flex-col gap-8 bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xl text-left"
              >
            
              {/* Section A: Contact Details */}
              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-bold text-primary border-b border-border/60 pb-2">
                  Section A: Contact Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="First Name *"
                    placeholder="e.g. John"
                    error={errors.firstName}
                    {...register('firstName')}
                  />
                  <Input
                    label="Last Name *"
                    placeholder="e.g. Smith"
                    error={errors.lastName}
                    {...register('lastName')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Email Address *"
                    placeholder="john.smith@gmail.com"
                    type="email"
                    icon={<Mail className="w-4 h-4" />}
                    error={errors.email}
                    {...register('email')}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="e.g. 0412 345 678"
                    icon={<Phone className="w-4 h-4" />}
                    error={errors.phone}
                    {...register('phone')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="State *"
                    placeholder="Select state"
                    options={states}
                    error={errors.state}
                    {...register('state')}
                  />
                  <Select
                    label="Preferred Communication Method *"
                    placeholder="Select preferred method"
                    options={communicationOptions}
                    error={errors.preferredCommunication}
                    {...register('preferredCommunication')}
                  />
                </div>
              </div>

              {/* Section B: Recruitment Specialty */}
              <div className="flex flex-col gap-4 mt-4">
                <h2 className="text-lg font-bold text-primary border-b border-border/60 pb-2">
                  Section B: Specialized Field *
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {divisions.map((div) => {
                    const isSelected = watch('specialty') === div.value;
                    return (
                      <div
                        key={div.value}
                        onClick={() => setValue('specialty', div.value, { shouldValidate: true })}
                        className={`p-4 rounded-2xl border-2 cursor-pointer select-none transition-all duration-200 flex flex-col items-center justify-center text-center gap-1
                          ${isSelected 
                            ? 'border-purple-700 bg-purple-700/35 shadow-sm scale-[0.99]' 
                            : 'border-border bg-surface hover:bg-bg-page'}`}
                      >
                        <span className="font-bold text-sm text-primary">{div.label}</span>
                        {/* <span className="text-[10px] text-muted font-medium">{div.desc}</span> */}
                      </div>
                    );
                  })}
                </div>
                {errors.specialty && (
                  <span className="text-xs text-red-500 mt-1">{errors.specialty.message}</span>
                )}
              </div>

              {/* Section C: Professional Profile */}
              <div className="flex flex-col gap-6 mt-4">
                <h2 className="text-lg font-bold text-primary border-b border-border/60 pb-2">
                  Section C: Career Goals & Experience
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="Career Experience Level *"
                    placeholder="Select career stage"
                    options={experienceOptions}
                    error={errors.careerExperience}
                    {...register('careerExperience')}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-primary/80 tracking-wide">
                    What are your career goals? * (Select all that apply)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
                    {goalOptions.map((opt) => {
                      const list = watch('careerGoals') || [];
                      const isChecked = list.includes(opt.value);
                      return (
                        <label 
                          key={opt.value}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer select-none transition-all duration-150
                            ${isChecked 
                              ? 'border-purple-700 bg-purple-700/10' 
                              : 'border-border bg-surface hover:bg-bg-page/50'}`}
                        >
                          <input 
                            type="checkbox"
                            className="w-4.5 h-4.5 rounded border-border text-purple-700 focus:ring-purple-700 outline-none cursor-pointer"
                            checked={isChecked}
                            onChange={(e) => handleGoalCheckbox(opt.value, e.target.checked)}
                          />
                          <span className="text-sm font-semibold text-primary">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.careerGoals && (
                    <span className="text-xs text-red-500 mt-1">{errors.careerGoals.message}</span>
                  )}
                </div>
              </div>

              {/* Section D: Document Uploads */}
              <div className="flex flex-col gap-6 mt-4">
                <h2 className="text-lg font-bold text-primary border-b border-border/60 pb-2">
                  Section D: Document Uploads
                </h2>
                
                <div className="flex flex-col gap-4">
                  <Controller
                    name="resume"
                    control={control}
                    render={({ field }) => (
                      <FileDropzone
                        label="Upload Resume / CV (PDF Only) *"
                        multiple={false}
                        accept=".pdf"
                        maxSizeMb={5}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.resume}
                      />
                    )}
                  />
                  <span className="text-[10px] text-muted italic ml-1 mt-0.5">
                    Note: Your CV is encrypted, stored securely and accessed only by our recruiting specialists. We never share raw files with employers without your explicit approval.
                  </span>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  <Controller
                    name="coverLetter"
                    control={control}
                    render={({ field }) => (
                      <FileDropzone
                        label="Upload Cover Letter (PDF or Word) - Optional"
                        multiple={false}
                        accept=".pdf,.doc,.docx"
                        maxSizeMb={5}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.coverLetter}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-border/60 mt-8 pt-6 flex justify-end">
                <Button
                  type="submit"
                  variant="filled"
                  disabled={loading}
                  className="px-10 py-3.5 font-bold shadow-lg shadow-accent/15 tracking-wider hover:shadow-xl hover:shadow-accent/25 duration-300 hover:scale-[1.01] bg-purple-950 border-slate-300 hover:bg-purple-700 hover:text-white hover:border-cyan-600"
                >
                  {loading ? 'Uploading Application...' : 'Submit Application'}
                </Button>
              </div>

            </form>
          </ScrollReveal>

          </div>
        </section>

        </div>
      
      
    </>
  );
}
