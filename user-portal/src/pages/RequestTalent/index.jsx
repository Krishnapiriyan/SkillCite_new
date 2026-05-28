import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Mail, Phone, MapPin, Globe, HardHat, FileText, ArrowRight, ArrowLeft, CheckCircle2, Briefcase, Layers } from 'lucide-react';
import { submitEmployerRequestApi } from '../../services/api';

import PageSEO from '../../components/ui/PageSEO';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TagInput from '../../components/ui/TagInput';
import FileDropzone from '../../components/ui/FileDropzone';
import StepIndicator from '../../components/ui/StepIndicator';
import SuccessScreen from '../../components/ui/SuccessScreen';
import Button from '../../components/ui/Button';
import Card3D from '../../components/animations/Card3D';
import admin1 from '../../assets/admin_1.jpg';

// Validation Schema
const schema = z.object({
  // Step 1: Contact Details
  contactFirstName: z.string().min(1, 'First name is required'),
  contactLastName: z.string().min(1, 'Last name is required'),
  workEmail: z.string().email('Invalid work email address'),
  phone: z.string().min(1, 'Phone number is required'),
  company: z.string().min(1, 'Company name is required'),
  state: z.string().min(1, 'Please select your state'),
  position: z.string().min(1, 'Position is required'),

  // Step 2: Hiring Scope
  engagementNeed: z.enum(['Perm', 'Temp / Contract', 'Retained', 'Project'], {
    errorMap: () => ({ message: 'Please select engagement need' })
  }),
  jobTitle: z.string().min(1, 'Job title is required'),
  specialty: z.enum(['engineering', 'accounting', 'administrative', 'other'], {
    errorMap: () => ({ message: 'Please select a recruitment specialty' })
  }),
  jobLocation: z.string().min(1, 'Job location is required'),
  jobType: z.enum(['Full time', 'Part time', 'Contract', 'Casual'], {
    errorMap: () => ({ message: 'Please select job type' })
  }),
  experienceLevel: z.enum(['graduate', 'mid', 'senior', 'lead', 'executive'], {
    errorMap: () => ({ message: 'Please select an experience level' })
  }),

  // Step 3: Specifications
  description: z.string().optional().or(z.literal('')),
  files: z.array(z.any()).default([])
});

export default function RequestTalent() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      contactFirstName: '',
      contactLastName: '',
      workEmail: '',
      phone: '',
      company: '',
      state: '',
      position: '',
      engagementNeed: 'Perm',
      jobTitle: '',
      specialty: 'engineering',
      jobLocation: '',
      jobType: 'Full time',
      experienceLevel: 'mid',
      description: '',
      files: []
    }
  });

  const formData = watch();

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ['contactFirstName', 'contactLastName', 'workEmail', 'phone', 'company', 'state', 'position'];
    } else if (step === 2) {
      fieldsToValidate = ['engagementNeed', 'jobTitle', 'specialty', 'jobLocation', 'jobType', 'experienceLevel'];
    }
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'files') {
          if (data.files && data.files.length > 0) {
            data.files.forEach((f) => payload.append('files', f));
          }
        } else if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });

      const res = await submitEmployerRequestApi(payload);
      if (res.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const divisions = [
    { value: 'engineering', label: 'Engineering', desc: 'Civil, mechanical, AutoCAD drafters' },
    { value: 'accounting', label: 'Accounting', desc: 'Bookkeepers, auditors, financial experts' },
    { value: 'administrative', label: 'Administrative', desc: 'Office managers, HR admins' },
    { value: 'other', label: 'Other Division', desc: 'Specialized corporate staffing' },
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
  const engagementNeeds = ['Perm', 'Temp / Contract', 'Retained', 'Project'];
  const jobTypes = ['Full time', 'Part time', 'Contract', 'Casual'];

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-20 bg-bg-page min-h-screen flex items-center justify-center">
        <SuccessScreen
          title="Talent Request Logged"
          message={`Thank you, ${formData.contactFirstName} ${formData.contactLastName}. We've logged your B2B recruitment request for ${formData.company}. Our recruitment partners will personally review your specs and contact you within 24 hours.`}
          onBack={() => {
            setIsSubmitted(false);
            setStep(1);
            window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <>
      <PageSEO
        title="Request Engineering Talent | Hire Contractors | SkillCite"
        description="Submit your company's recruitment specifications. Our specialist recruitment team reviews each request manually and connects offline."
        canonical="/request-talent"
      />
      
      <div className="bg-bg-page min-h-screen text-primary select-none pt-0">
        {/* 1. Hero Section */}
        <section className="py-24 md:py-32 bg-surface/30 border-b border-border overflow-hidden relative" style={{ backgroundColor: 'rgba(153, 186, 180, 0.7)' }}>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-400/10 blur-[120px] rounded-full -mr-64 -mt-32 pointer-events-none"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                {/* <span className="text-[13px] font-bold text-accent tracking-widest uppercase mb-4 block">Employer Services</span> */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-none mb-8 font-display">
                  Hire The Right <span className="text-muted">Talent.</span> <br />
                  <span className="text-purple-900">Every Time.</span>
                </h1>
                <p className="text-[16px] text-muted mb-10 leading-relaxed max-w-[600px] font-semibold">
                  SkillCite provides end-to-end recruitment support for organisations across multiple industries. Jobs are reviewed and approved by our team. Candidates are matched based on verified job roles, and shortlisted profiles are carefully evaluated through our screening process. The platform handles sourcing, screening, and coordination so employers can focus on selecting the right candidate.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="filled" 
                    className="px-10 py-3.5 w-full sm:w-auto font-bold shadow-lg shadow-purple-700/20 hover:shadow-xl hover:shadow-purple-700/30 duration-300 transform hover:-translate-y-0.5 bg-purple-950 border-slate-300 hover:bg-purple-700 hover:text-white hover:border-cyan-600"
                    onClick={() => document.getElementById('request-talent-form').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Hire Talent <ArrowRight className="ml-2 w-5 h-5 animate-pulse" />
                  </Button>
                </div>
              </div>
              
              <div className="relative group w-full max-w-sm sm:max-w-md mx-auto cursor-pointer lusion-image-hover lusion-image-float mt-12 lg:mt-0">
                <Card3D className="group relative" maxTilt={10}>
                  {/* Floating Glowing Orb (Best Premium Combination) */}
                  <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-purple-500/30 to-purple-400/10 blur-3xl pointer-events-none -z-10 floating-orb group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />
                  
                  {/* Premium Framed Showcase */}
                  <div className="p-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <div className="relative w-full h-[280px] sm:h-[360px] overflow-hidden rounded-[2rem]">
                      <img 
                        src={admin1} 
                        alt="Engineering Recruitment Excellence" 
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

        {/* 2. Our Recruitment Process */}
        <section className="py-24 bg-bg-page">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[13px] font-bold text-purple-700 tracking-widest uppercase mb-4 block text-left">Methodology</span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 tracking-tight font-display text-left">Our Recruitment Process</h2>
                <div className="space-y-8 text-left">
                  {[
                    { step: '01', title: 'Submit Requirements', desc: 'Job requirements are submitted by employers through a secure form and reviewed by the team.' },
                    { step: '02', title: 'Review & Publish', desc: 'The team verifies job details and approves them.' },
                    { step: '03', title: 'Screening Process ', desc: 'Candidates upload their CV. Applications are reviewed and filtered by the team based on suitability.' },
                    { step: '04', title: 'Shortlist Delivered', desc: 'A shortlist of qualified candidates is provided to the employer for final consideration.' }
                  ].map((item) => (
                    <div key={item.step} className="flex group">
                      <div className="text-2xl font-black text-purple-700/20 group-hover:text-purple-700 transition-colors mr-6 mt-1">{item.step}</div>
                      <div>
                        <h4 className="text-[17px] font-bold text-primary mb-2 font-display">{item.title}</h4>
                        <p className="text-[14px] text-muted leading-relaxed font-semibold">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative group hidden lg:block text-left">
                <div className="absolute -inset-4 bg-purple-700/10 blur-3xl rounded-full opacity-50"></div>
                <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl p-8 bg-surface/50">
                  <h3 className="text-xl font-bold text-primary mb-6 font-display">Why Partner With Us?</h3>
                  <div className="space-y-6">
                    {[
                      'High-quality candidate matching tailored to your hiring needs',
                      'Dedicated recruitment specialists across multiple industries',
                      'Efficient resume screening and role-based candidate evaluation',
                      'Comprehensive candidate screening and verification process',
                      'End-to-end recruitment coordination from sourcing to placement'
                    ].map((feat, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-purple-700 mr-3 mt-0.5 shrink-0" />
                        <span className="text-[14px] text-muted font-semibold">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Form Section */}
        <section id="request-talent-form" className="py-24 bg-bg-page scroll-mt-20" style={{ backgroundColor: 'rgb(182 229 252 / 64%)' }}>
          <div className="max-w-2xl mx-auto px-6">
            
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-primary tracking-tight font-display mb-3">Request <span className="text-purple-700">Talent.</span></h2>
              <p className="text-sm text-muted font-semibold max-w-md mx-auto">
                Tell us about your engineering, accounting, or administrative needs. A recruiter will contact you personally in 24 hours.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xl overflow-hidden relative text-left" >
            
            {/* Step progress */}
            <StepIndicator 
              currentStep={step} 
              totalSteps={3} 
              stepNames={['Contact Details', 'Hiring Scope', 'Specifications']}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Contact Details */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="First Name *"
                        placeholder="e.g. Jane"
                        error={errors.contactFirstName}
                        {...register('contactFirstName')}
                      />
                      <Input
                        label="Last Name *"
                        placeholder="e.g. Doe"
                        error={errors.contactLastName}
                        {...register('contactLastName')}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Work Email *"
                        placeholder="jane.doe@company.com"
                        type="email"
                        icon={<Mail className="w-4 h-4" />}
                        error={errors.workEmail}
                        {...register('workEmail')}
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
                      <Input
                        label="Company Name *"
                        placeholder="e.g. Acme Corporation"
                        icon={<Building2 className="w-4 h-4" />}
                        error={errors.company}
                        {...register('company')}
                      />
                      <Select
                        label="State *"
                        placeholder="Select state"
                        options={states}
                        error={errors.state}
                        {...register('state')}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <Input
                        label="Your Position / Title *"
                        placeholder="e.g. Talent Acquisition Lead"
                        error={errors.position}
                        {...register('position')}
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Hiring Scope */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Engagement Need Selector */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-xs font-bold text-primary/80 uppercase tracking-wide">
                        What is your engagement need? *
                      </span>
                      <div className="grid grid-cols-2 gap-3.5">
                        {engagementNeeds.map((need) => {
                          const isSelected = watch('engagementNeed') === need;
                          return (
                            <button
                              key={need}
                              type="button"
                              onClick={() => setValue('engagementNeed', need, { shouldValidate: true })}
                              className={`py-3.5 px-4.5 rounded-xl border text-sm font-bold text-center transition-all duration-200
                                ${isSelected 
                                  ? 'bg-purple-700 text-white border-purple-700 shadow-md shadow-purple-700/15' 
                                  : 'bg-surface text-muted border-border hover:bg-bg-page'}`}
                            >
                              {need}
                            </button>
                          );
                        })}
                      </div>
                      {errors.engagementNeed && (
                        <span className="text-xs text-red-500 mt-1">{errors.engagementNeed.message}</span>
                      )}
                    </div>

                    {/* Recruitment Specialty division */}
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-xs font-bold text-primary/80 uppercase tracking-wide">
                        Recruitment Specialty Division *
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {divisions.map((div) => {
                          const isSelected = watch('specialty') === div.value;
                          return (
                            <div
                              key={div.value}
                              onClick={() => setValue('specialty', div.value, { shouldValidate: true })}
                              className={`p-4 rounded-2xl border-2 cursor-pointer select-none transition-all duration-200 flex flex-col gap-1
                                ${isSelected 
                                  ? 'border-purple-700 bg-purple-700/35 shadow-sm' 
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                      <Input
                        label="Required Job Title *"
                        placeholder="e.g. Senior Piping Designer"
                        error={errors.jobTitle}
                        {...register('jobTitle')}
                      />
                      <Input
                        label="Job Location *"
                        placeholder="e.g. Brisbane, QLD"
                        icon={<MapPin className="w-4 h-4" />}
                        error={errors.jobLocation}
                        {...register('jobLocation')}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Select
                        label="Job Type *"
                        placeholder="Select job type"
                        options={jobTypes}
                        error={errors.jobType}
                        {...register('jobType')}
                      />
                      {/* Experience selection radio pills */}
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-primary/80 uppercase tracking-wide">
                          Experience Level Needed *
                        </span>
                        <div className="flex flex-wrap gap-2.5 mt-0.5">
                          {['graduate', 'mid', 'senior', 'lead', 'executive'].map((level) => {
                            const isSelected = watch('experienceLevel') === level;
                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setValue('experienceLevel', level, { shouldValidate: true })}
                                className={`px-4.5 py-2 rounded-full text-xs font-bold capitalize select-none transition-all
                                  ${isSelected 
                                    ? 'bg-purple-700 text-white shadow-sm' 
                                    : 'bg-bg-page text-muted border border-border hover:bg-border/30'}`}
                              >
                                {level}
                              </button>
                            );
                          })}
                        </div>
                        {errors.experienceLevel && (
                          <span className="text-xs text-red-500 mt-1">{errors.experienceLevel.message}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Specifications */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="w-full flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-primary/80 uppercase tracking-wide">
                          Role & Specifications Description (Optional)
                        </label>
                        <span className="text-[10px] text-muted font-bold">
                          {watch('description').length}/500 chars
                        </span>
                      </div>
                      <textarea
                        maxLength={500}
                        placeholder="Describe key responsibilities, specific softwares, budget constraints, or team structures..."
                        rows={6}
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-primary bg-surface outline-none transition-all focus:ring-4 focus:ring-purple-400 focus:border-purple-500 resize-none border-border`}
                        {...register('description')}
                      />
                    </div>

                    <div className="mt-2 flex flex-col gap-4">
                      <Controller
                        name="files"
                        control={control}
                        render={({ field }) => (
                          <FileDropzone
                            label="Upload Job Description or Project Spec Sheets (Optional)"
                            multiple={true}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.files}
                          />
                        )}
                      />
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Form Navigation Actions */}
              <div className="flex items-center justify-between border-t border-border/60 mt-10 pt-6">
                {step > 1 ? (
                  <Button 
                    type="button" 
                    variant="outlined" 
                    onClick={handleBack}
                    icon={<ArrowLeft className="w-4 h-4" 
                    className="px-10 font-bold shadow-lg shadow-purple-700/15 bg-purple-950 hover:bg-purple-700 hover:text-white hover:border-cyan-600" 
/>}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <Button 
                    type="button" 
                    variant="filled" 
                    onClick={handleNext}
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="px-10 font-bold shadow-lg shadow-purple-700/15 bg-purple-950 hover:bg-purple-700 hover:text-white hover:border-cyan-600" 
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    variant="filled" 
                    disabled={loading}
                    className="px-10 font-bold shadow-lg shadow-purple-700/15"
                    bgColor="bg-purple-950"
                  >
                    {loading ? 'Submitting Specification...' : 'Request Recruitment Call'}
                  </Button>
                )}
              </div>

            </form>

          </div>

        </div>
      </section>
      </div>
    </>
  );
}
