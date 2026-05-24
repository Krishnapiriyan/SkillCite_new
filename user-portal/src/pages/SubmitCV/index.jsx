import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, Award, Globe, ShieldCheck, Cpu, Handshake, CircleDollarSign, HardHat, Calculator, ArrowRight } from 'lucide-react';
import { submitCandidateCvApi } from '../../services/api';

import PageSEO from '../../components/ui/PageSEO';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TagInput from '../../components/ui/TagInput';
import FileDropzone from '../../components/ui/FileDropzone';
import SuccessScreen from '../../components/ui/SuccessScreen';
import Button from '../../components/ui/Button';
import Card3D from '../../components/animations/Card3D';
import resume3 from '../../assets/resume3.jpg';

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
  phone: z.string().min(1, 'Phone number is required'),
  state: z.string().min(1, 'Please select your state'),
  specialty: z.enum(['engineering', 'accounting', 'administrative', 'other'], {
    errorMap: () => ({ message: 'Please select a recruitment specialty' })
  }),
  careerExperience: z.string().min(1, 'Please select your career experience'),
  careerGoals: z.array(z.string()).min(1, 'Please select at least one career goal'),
  reasonableAdjustments: z.enum(['No', 'Yes'], {
    errorMap: () => ({ message: 'Please specify if adjustments are needed' })
  }),
  reasonableAdjustmentsDetails: z.string().optional().or(z.literal('')),
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
      reasonableAdjustments: 'No',
      reasonableAdjustmentsDetails: '',
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
    { value: 'engineering', label: 'Engineering Recruitment', desc: 'Civil, Mech, AutoCAD drawing placements' },
    { value: 'accounting', label: 'Accounting Recruitment', desc: 'Bookkeepers, auditors and corporate accountants' },
    { value: 'administrative', label: 'Administration Recruitment', desc: 'Office managers, HR admins and coordinators' },
    { value: 'other', label: 'Other Placements', desc: 'Custom non-technical specialized matching' },
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
        description="Join our premium engineering talent network. Submit your CV for personalized matching by real human recruiters."
        canonical="/submit-your-cv"
      />

      <div className="bg-bg-page min-h-screen text-primary select-none pt-0">
        {/* 1. Hero Section */}
        <section className="py-24 md:py-32 bg-surface/30 border-b border-border overflow-hidden relative" style={{ backgroundColor: 'rgba(153, 186, 180, 0.7)' }}>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-light/10 blur-[120px] rounded-full -mr-64 -mt-32 pointer-events-none"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                {/* <span className="text-[13px] font-bold text-accent tracking-widest uppercase mb-4 block">Candidate Portal</span> */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-none mb-8 font-display">
                  Confidential <span className="text-muted">Career</span> <br />
                  <span className="text-purple-900">Advancement.</span>
                </h1>
                <p className="text-[16px] text-muted mb-10 leading-relaxed max-w-[600px] font-semibold">
                  SkillCite works exclusively with engineering, accounting and administrative professionals. We bridge the gap between high-tier talent and industry-leading organisations through a secure platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="filled" 
                    className="px-10 py-3.5 w-full sm:w-auto font-bold tracking-wide shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 transform hover:-translate-y-0.5"
                    onClick={() => document.getElementById('submit-cv-form').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Submit CV Today <ArrowRight className="ml-2 w-5 h-5 animate-pulse" />
                  </Button>
                </div>
              </div>
              
              <div className="relative group w-full max-w-sm sm:max-w-md mx-auto cursor-pointer lusion-image-hover lusion-image-float mt-12 lg:mt-0">
                <Card3D className="group relative" maxTilt={10}>
                  {/* Floating Glowing Orb (Best Premium Combination) */}
                  <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-accent/30 to-blue-400/10 blur-3xl pointer-events-none -z-10 floating-orb group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />
                  
                  {/* Premium Framed Showcase */}
                  <div className="p-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <div className="relative w-full h-[280px] sm:h-[360px] overflow-hidden rounded-[2rem]">
                      <img 
                        src={resume3} 
                        alt="Confidential Career Advancement" 
                        className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02] transform group-hover:scale-108 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-page/40 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </Card3D>
              </div>
            </div>
          </div>
        </section>

        {/* 3. How It Works Section */}
        <section className="py-24 bg-surface border-y border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[13px] font-bold text-accent tracking-widest uppercase mb-4 block text-left">The Process</span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 tracking-tight font-display text-left">Your Journey to Placement</h2>
                <div className="space-y-8 text-left">
                  {[
                    { step: '01', title: 'Profile Creation', desc: 'Candidates upload their CV or resume with their preferred job roles.' },
                    { step: '02', title: 'Job Verification', desc: 'Employers post their job openings, and candidates upload their resumes. SkillCite matches the right role to the right person.' },
                    { step: '03', title: 'Application & Selection', desc: 'Candidates apply. The team reviews CVs and shortlists suitable candidates.' },
                    { step: '04', title: 'Employer Review', desc: 'Shortlisted candidates are shared with employers and employers review and select suitable profiles.' },
                    { step: '05', title: 'Final Outcome', desc: 'Selected candidates are confirmed through SkillCite and placement is completed.' }
                  ].map((item) => (
                    <div key={item.step} className="flex group">
                      <div className="text-2xl font-black text-accent/20 group-hover:text-accent transition-colors mr-6 mt-1">{item.step}</div>
                      <div>
                        <h4 className="text-[17px] font-bold text-primary mb-2 font-display">{item.title}</h4>
                        <p className="text-[14px] text-muted leading-relaxed font-semibold">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[16px] text-muted max-w-[600px] mx-auto font-semibold mb-8 text-left">
                  SkillCite follows a structured workflow where jobs are verified by the team and candidates are matched based on approved roles.              
                </p>
                <div className="bg-bg-page border border-border rounded-3xl p-10 shadow-2xl relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                  <h3 className="text-xl font-bold text-primary mb-6 font-display">Expertise Sectors</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: <HardHat className="w-5 h-5" />, title: 'Engineering & Technical', roles: 'Civil, Structural, Mechanical, Electrical' },
                      { icon: <Briefcase className="w-5 h-5" />, title: 'Administration', roles: 'Project Admin, Office Management, Operations' },
                      { icon: <Calculator className="w-5 h-5" />, title: 'Accounting & Finance', roles: 'Project Accountants, Bookkeepers, Auditors' },
                    ].map((sector, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-surface border border-border flex items-start group hover:border-accent/50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-bg-page flex items-center justify-center text-muted group-hover:text-accent transition-colors shrink-0">
                          {sector.icon}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-[15px] font-bold text-primary mb-1 font-display">{sector.title}</h4>
                          <p className="text-[12px] text-muted font-semibold">{sector.roles}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Form Section */}
        <section id="submit-cv-form" className="py-24 bg-bg-page scroll-mt-20" style={{ backgroundColor: 'rgb(182 229 252 / 64%)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-primary tracking-tight font-display mb-3">Join Our <span className="text-accent">Talent</span> Network</h2>
              <p className="text-sm text-muted font-semibold max-w-md mx-auto">
                We reject automated candidate-matching scripts. Submit your resume, and a real expert senior recruiter will review your profile manually.
              </p>
            </div>
            
            {/* Form container */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xl text-left">
            
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
                    label="Phone Number *"
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
                  Section B: Recruitment Specialty *
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {divisions.map((div) => {
                    const isSelected = watch('specialty') === div.value;
                    return (
                      <div
                        key={div.value}
                        onClick={() => setValue('specialty', div.value, { shouldValidate: true })}
                        className={`p-4.5 rounded-2xl border-2 cursor-pointer select-none transition-all duration-200 flex flex-col items-center justify-center text-center gap-1
                          ${isSelected 
                            ? 'border-accent bg-accent-light/35 shadow-sm scale-[0.99]' 
                            : 'border-border bg-surface hover:bg-bg-page'}`}
                      >
                        <span className="font-bold text-sm text-primary">{div.label}</span>
                        <span className="text-[10px] text-muted font-medium">{div.desc}</span>
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
                  <span className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
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
                              ? 'border-accent bg-accent-light/10' 
                              : 'border-border bg-surface hover:bg-bg-page/50'}`}
                        >
                          <input 
                            type="checkbox"
                            className="w-4.5 h-4.5 rounded border-border text-accent focus:ring-accent outline-none cursor-pointer"
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

              {/* Section D: Reasonable Adjustments */}
              <div className="flex flex-col gap-6 mt-4">
                <h2 className="text-lg font-bold text-primary border-b border-border/60 pb-2">
                  Section D: Reasonable Adjustments
                </h2>
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-primary/80 leading-relaxed">
                    Do you require reasonable adjustments during the recruitment and selection process? *
                  </span>
                  <div className="flex gap-4">
                    {['No', 'Yes'].map((val) => {
                      const isSelected = watch('reasonableAdjustments') === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setValue('reasonableAdjustments', val, { shouldValidate: true })}
                          className={`px-6 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200
                            ${isSelected 
                              ? 'bg-accent text-white border-accent shadow-md shadow-accent/10' 
                              : 'bg-surface text-muted border-border hover:bg-bg-page'}`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                  {errors.reasonableAdjustments && (
                    <span className="text-xs text-red-500 mt-1">{errors.reasonableAdjustments.message}</span>
                  )}
                </div>

                {watch('reasonableAdjustments') === 'Yes' && (
                  <div className="flex flex-col gap-2 animate-fadeIn duration-200">
                    <span className="text-xs font-semibold text-primary/80">
                      Please describe any reasonable adjustments required: *
                    </span>
                    <textarea
                      placeholder="Specify requirements, e.g. wheelchair access, sign-language interpreter, screen reader compatibility..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm text-primary bg-surface outline-none transition-all focus:ring-4 focus:ring-accent-light focus:border-accent resize-none"
                      {...register('reasonableAdjustmentsDetails', {
                        required: watch('reasonableAdjustments') === 'Yes' ? 'Details are required when adjustments are requested' : false
                      })}
                    />
                    {errors.reasonableAdjustmentsDetails && (
                      <span className="text-xs text-red-500 mt-0.5">{errors.reasonableAdjustmentsDetails.message}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Section E: Document Uploads */}
              <div className="flex flex-col gap-6 mt-4">
                <h2 className="text-lg font-bold text-primary border-b border-border/60 pb-2">
                  Section E: Document Uploads
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
                  className="px-10 py-3.5 font-bold shadow-lg shadow-accent/15 tracking-wider hover:shadow-xl hover:shadow-accent/25 duration-300 hover:scale-[1.01]"
                >
                  {loading ? 'Uploading Application...' : 'Submit CV Application'}
                </Button>
              </div>

            </form>

          </div>
        </section>

        </div>
      
      
    </>
  );
}
