import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { HardHat, Compass, Calculator, HelpCircle, User, Mail, Phone, Building2, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { submitEngineeringRequestApi } from '../../services/api';

import PageSEO from '../../components/ui/PageSEO';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FileDropzone from '../../components/ui/FileDropzone';
import SuccessScreen from '../../components/ui/SuccessScreen';
import Button from '../../components/ui/Button';
import Card3D from '../../components/animations/Card3D';
import HoneycombBackground from '../../components/animations/HoneycombBackground';
import IsometricGridBackground from '../../components/animations/IsometricGridBackground';
import ScrollReveal from '../../components/animations/ScrollReveal';

import engineeringBlueprints from '../../assets/engineering_blueprints.webp';
import engineeringserviceBlueprints from '../../assets/Civil-Engineering-service.webp';
import heroComposition from '../../assets/hero_composition.webp';
import aboutTeam from '../../assets/about_team.webp';

// Validation Schema
const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  serviceType: z.enum(['autocad', 'estimation', 'calculations', 'consultation'], {
    errorMap: () => ({ message: 'Please select a service type' })
  }),
  description: z.string().min(1, 'Project description is required'),
  deadline: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid deadline date' }),
  budget: z.string().optional().or(z.literal('')),
  files: z.array(z.any()).default([])
});

export default function EngineeringServices() {
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
      fullName: '',
      email: '',
      phone: '',
      company: '',
      serviceType: 'autocad',
      description: '',
      deadline: '',
      budget: '',
      files: []
    }
  });

  const scrollToForm = (serviceKey = null) => {
    if (serviceKey) {
      setValue('serviceType', serviceKey, { shouldValidate: true });
    }
    document.getElementById('specification-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'files') {
          data.files.forEach((f) => payload.append('files', f));
        } else if (data[key] !== null && data[key] !== undefined) {
          payload.append(key, data[key]);
        }
      });

      const res = await submitEngineeringRequestApi(payload);
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

  const services = [
    { key: 'autocad', icon: <Compass className="w-5 h-5" />, title: 'AutoCAD & Shop Drawings', desc: 'Professional 2D drafting, structural detailing, fabrication drawings, and DWG packages.' },
    { key: 'estimation', icon: <HardHat className="w-5 h-5" />, title: 'Quantity Estimation', desc: 'Accurate material take-offs, cost estimations, and bid analysis for projects.' },
    { key: 'calculations', icon: <Calculator className="w-5 h-5" />, title: 'Engineering Calculations', desc: 'Structural calculations, load assessments, stamped spec validations.' },
    { key: 'consultation', icon: <HelpCircle className="w-5 h-5" />, title: 'Engineering Consultation', desc: 'Offline code compliance advice, engineering design reviews, and oversight.' },
  ];

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-20 bg-bg-page min-h-screen flex items-center justify-center">
        <SuccessScreen
          title="Project Proposal Logged"
          message={`Thank you, ${watch('fullName')}. Your engineering service request has been received. Our in-house engineering team will personally review your specifications and contact you within 2 business days.`}
          onBack={() => {
            setIsSubmitted(false);
            window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <>
      <PageSEO
        title="Engineering Services & Consultation | AutoCAD Calculations | SkillCite"
        description="Request AutoCAD shop drawings, structural estimations, and stamped engineering calculations with professional offline delivery."
        canonical="/engineering-services"
      />

      <div className="bg-bg-page min-h-screen text-primary select-none pt-0">
        {/* 1. Hero Section */}
        <section className="pt-24 pb-32 bg-transparent border-b border-border overflow-hidden relative">
          <HoneycombBackground />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            
            {/* Header Split Layout with Blueprints Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
              
              {/* Title Column */}
              <div className="lg:col-span-7 text-left flex flex-col gap-4">
                <ScrollReveal delay={0.1} direction="up">
                  {/* <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-primary tracking-tight leading-tight">
                    Engineering & <br className="hidden sm:inline" />
                    <span className="text-purple-800">Services</span>
                  </h1> */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-none mb-8 font-display">
                    <span className="text-muted">Engineering</span> <br />
                    <span className="text-purple-900">Services</span>
                  </h1>
                </ScrollReveal>
                <ScrollReveal delay={0.2} direction="up">
                  <p className="text-sm sm:text-base text-muted font-semibold leading-relaxed max-w-xl">
                    Request precision 2D Drafting & 3D Visualization, quantity estimation take-offs, or structural computations. Fully stampable and executed offline by licensed engineering experts.
                  </p>
                </ScrollReveal>
              </div>

              {/* Blueprints Floating Image Column */}
              <div className="lg:col-span-5 flex items-center justify-center mt-12 lg:mt-0">
                <ScrollReveal delay={0.25} direction="right">
                  <Card3D className="group relative bg-transparent rounded-[2.5rem]" maxTilt={10}>
                    {/* Floating Glowing Orb (Best Premium Combination) */}
                    <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-accent/30 to-blue-400/10 blur-3xl pointer-events-none -z-10 floating-orb group-hover:scale-150 transition-transform duration-[2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" />
                    
                    {/* Clean Borderless Showcase */}
                    <div className="relative w-full h-[280px] sm:h-[360px] overflow-hidden rounded-[2.5rem] shadow-2xl">
                      <img 
                        src={engineeringserviceBlueprints} 
                        alt="SkillCite CAD drawings & calculations blueprints mockup"
                        className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02] rounded-[2.5rem] transform group-hover:scale-108 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                        // className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.02] transform group-hover:scale-108 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]" 
                      />
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-bg-page/40 to-transparent pointer-events-none rounded-[2.5rem]"></div> */}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-page/40 to-transparent pointer-events-none rounded-[2.5rem]"></div>
                    </div>
                  </Card3D>
                </ScrollReveal>
              </div>

            </div>

          </div>
        </section>

        {/* 2. Process & Showcases Section */}
        <section className="py-24 bg-transparent border-y border-border relative overflow-hidden">
          <IsometricGridBackground />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            {/* Detailed Service Showcases */}
            <div className="flex flex-col gap-24">
              
              {/* AutoCAD & Shop Drawings */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
                <div className="md:col-span-6 flex flex-col items-start order-1 md:order-1">
                  <ScrollReveal delay={0.1} direction="up">
                    <span className="text-[11px] font-bold text-purple-800 tracking-widest uppercase mb-3 block bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
                      CAD Documentation
                    </span>
                  </ScrollReveal>
                  <ScrollReveal delay={0.15} direction="up">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-4 tracking-tight font-display">
                      Precision 2D Drafting & 3D Visualization
                    </h2>
                  </ScrollReveal>
                  <ScrollReveal delay={0.2} direction="up">
                    <p className="text-sm sm:text-base text-muted mb-6 leading-relaxed font-medium">
                      From technical 2D plans to immersive 3D models, we deliver clarity and precision to meet client's requirement. Our team transforms design concepts into detailed documentation and visual models that enhance coordination and reduce on-site errors.
                    </p>
                  </ScrollReveal>
                  <ul className="space-y-3.5 mb-8 w-full">
                    {[
                      'Precision 2D Drafting & 3D Visualization',
                      'Structural, architectural, and services shop drawings',
                      'As-built drawings and revisions'
                    ].map((item, i) => (
                      <ScrollReveal key={i} delay={0.25 + i * 0.05} direction="up">
                        <li className="flex items-start text-muted text-sm font-semibold">
                          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5 border border-purple-200 shrink-0 text-purple-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-700"></span>
                          </div>
                          <span>{item}</span>
                        </li>
                      </ScrollReveal>
                    ))}
                  </ul>
                  <ScrollReveal delay={0.4} direction="up">
                    <Button variant="outlined" onClick={() => scrollToForm('autocad')} 
                            className="px-10 py-3.5 w-full sm:w-auto font-bold tracking-wide shadow-lg shadow-purple-800/20 hover:shadow-xl hover:shadow-purple-800/30 transition-all duration-300 transform hover:-translate-y-0.5 text-black bg-purple-950 border-purple-950 hover:bg-purple-900 hover:text-white hover:border-cyan-600"
                            >
                      Request Design <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </ScrollReveal>
                </div>

                <div className="md:col-span-6 order-2 md:order-2 relative group w-full">
                  <ScrollReveal delay={0.25} direction="right">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-700 to-blue-400 rounded-[2rem] blur opacity-15 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-surface rounded-[2rem] overflow-hidden shadow-xl sm:shadow-2xl">
                      <img 
                        src={engineeringBlueprints} 
                        alt="AutoCAD Technical Drawing" 
                        className="w-full h-[240px] sm:h-[300px] object-cover transform transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-[10px] font-bold text-white uppercase tracking-widest font-sans">Technical Documentation Portal</div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>

              {/* Quantity & Cost Estimation */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
                <div className="md:col-span-6 order-2 md:order-1 relative group w-full">
                  <ScrollReveal delay={0.25} direction="left">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-400 to-purple-700 rounded-[2rem] blur opacity-15 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-surface rounded-[2rem] overflow-hidden shadow-xl sm:shadow-2xl">
                      <img 
                        src={heroComposition} 
                        alt="Bill of Quantities Sample" 
                        className="w-full h-[240px] sm:h-[300px] object-cover transform transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-[10px] font-bold text-white uppercase tracking-widest font-sans">Precision Estimation Suite</div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                <div className="md:col-span-6 flex flex-col items-start order-1 md:order-2">
                  <ScrollReveal delay={0.1} direction="up">
                    <span className="text-[11px] font-bold text-purple-800 tracking-widest uppercase mb-3 block bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
                      Precision Estimation
                    </span>
                  </ScrollReveal>
                  <ScrollReveal delay={0.15} direction="up">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-4 tracking-tight font-display">
                      Quantity & Cost Estimation
                    </h2>
                  </ScrollReveal>
                  <ScrollReveal delay={0.2} direction="up">
                    <p className="text-sm sm:text-base text-muted mb-6 leading-relaxed font-medium">
                      We combine technical expertise with digital tools to produce reliable cost estimates and quantity schedules. Each report is tailored to meet project specifications, ensuring accuracy and accountability from design through delivery.
                    </p>
                  </ScrollReveal>
                  <ul className="space-y-3.5 mb-8 w-full">
                    {[
                      'Quantity take-offs with precise material counts',
                      'Comprehensive Bills of Quantities (BOQs)',
                      'Tender & bid documentation support'
                    ].map((item, i) => (
                      <ScrollReveal key={i} delay={0.25 + i * 0.05} direction="up">
                        <li className="flex items-start text-muted text-sm font-semibold">
                          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5 border border-purple-200 shrink-0 text-purple-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-700"></span>
                          </div>
                          <span>{item}</span>
                        </li>
                      </ScrollReveal>
                    ))}
                  </ul>
                  <ScrollReveal delay={0.4} direction="up">
                    <Button variant="outlined" onClick={() => scrollToForm('estimation')} className="px-10 py-3.5 w-full sm:w-auto font-bold tracking-wide shadow-lg shadow-purple-800/20 hover:shadow-xl hover:shadow-purple-800/30 transition-all duration-300 transform hover:-translate-y-0.5 text-black bg-purple-950 border-purple-950 hover:bg-purple-900 hover:text-white hover:border-cyan-600"
                            >
                      Request Estimation <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </ScrollReveal>
                </div>
              </div>

              {/* Engineering Calculations */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
                <div className="md:col-span-6 flex flex-col items-start order-1 md:order-1">
                  <ScrollReveal delay={0.1} direction="up">
                    <span className="text-[11px] font-bold text-emerald-600 tracking-widest uppercase mb-3 block bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      Structural Engineering
                    </span>
                  </ScrollReveal>
                  <ScrollReveal delay={0.15} direction="up">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-4 tracking-tight font-display">
                      Calculations & Verifications
                    </h2>
                  </ScrollReveal>
                  <ScrollReveal delay={0.2} direction="up">
                    <p className="text-sm sm:text-base text-muted mb-6 leading-relaxed font-medium">
                      Get certified structural design assessments and rigorous stress analysis. Our qualified structural engineers deliver comprehensive verification reports matching your local guidelines.
                    </p>
                  </ScrollReveal>
                  <ul className="space-y-3.5 mb-8 w-full">
                    {[
                      'Structural design calculations',
                      'Temporary work calculations',
                      'On-site structural verifications'
                    ].map((item, i) => (
                      <ScrollReveal key={i} delay={0.25 + i * 0.05} direction="up">
                        <li className="flex items-start text-muted text-sm font-semibold">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mr-3 mt-0.5 border border-emerald-100 shrink-0 text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          </div>
                          <span>{item}</span>
                        </li>
                      </ScrollReveal>
                    ))}
                  </ul>
                  <ScrollReveal delay={0.4} direction="up">
                    <Button variant="outlined" onClick={() => scrollToForm('calculations')} className="px-10 py-3.5 w-full sm:w-auto font-bold tracking-wide shadow-lg shadow-purple-800/20 hover:shadow-xl hover:shadow-purple-800/30 transition-all duration-300 transform hover:-translate-y-0.5 text-black bg-purple-950 border-purple-950 hover:bg-purple-900 hover:text-white hover:border-cyan-600"
                      >
                      Request Calculations <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </ScrollReveal>
                </div>

                <div className="md:col-span-6 order-2 md:order-2 relative group w-full">
                  <ScrollReveal delay={0.25} direction="right">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-[2rem] blur opacity-15 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-surface rounded-[2rem] overflow-hidden shadow-xl sm:shadow-2xl">
                      <img 
                        src={aboutTeam} 
                        alt="Engineering Calculations Report" 
                        className="w-full h-[240px] sm:h-[300px] object-cover transform transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-[10px] font-bold text-white uppercase tracking-widest font-sans">Structural Compliance Engine</div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Form Section */}
        <section id="specification-form-container" className="py-24 bg-[#F7F5F0] border-t border-border">
          <div className="max-w-3xl mx-auto px-6">
            <ScrollReveal delay={0.1} direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-primary tracking-tight font-display mb-3">
                  Submit Project <span className="text-purple-700">Specifications</span>
                </h2>
                <p className="text-sm text-muted font-semibold max-w-md mx-auto">
                  Provide your detailed requirements and sketches. Our in-house engineering team will personally review your specifications and contact you.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} direction="up">
              <div id="specification-form" className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xl text-left">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Full Name *"
                      placeholder="e.g. John Miller"
                      icon={<User className="w-4 h-4" />}
                      error={errors.fullName}
                      {...register('fullName')}
                    />
                    <Input
                      label="Email Address *"
                      placeholder="john.miller@gmail.com"
                      type="email"
                      icon={<Mail className="w-4 h-4" />}
                      error={errors.email}
                      {...register('email')}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number"
                      placeholder="e.g. +1 555-019-2834"
                      icon={<Phone className="w-4 h-4" />}
                      error={errors.phone}
                      {...register('phone')}
                    />
                    <Input
                      label="Company Name"
                      placeholder="e.g. Miller & Partners"
                      icon={<Building2 className="w-4 h-4" />}
                      error={errors.company}
                      {...register('company')}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Select
                      label="Requested Service Type *"
                      placeholder="Select service"
                      options={[
                        { value: 'autocad', label: 'Precision 2D Drafting & 3D Visualization' },
                        { value: 'estimation', label: 'Quantity & Cost Estimation' },
                        { value: 'calculations', label: 'Calculations & Verifications' },
                        { value: 'consultation', label: 'Engineering Consultation' },
                      ]}
                      error={errors.serviceType}
                      {...register('serviceType')}
                    />
                    <Input
                      label="Preferred Delivery Deadline *"
                      type="date"
                      icon={<Calendar className="w-4 h-4" />}
                      error={errors.deadline}
                      {...register('deadline')}
                    />
                  </div>

                  <div className="w-full flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                      Project Description & Specifications *
                    </label>
                    <textarea
                      maxLength={800}
                      placeholder="Detailed project requirements. Describe the dimensions, tools, materials, outputs required, or specific local codes to align with..."
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-primary bg-surface outline-none transition-all focus:ring-4 focus:ring-accent-light focus:border-accent resize-none
                        ${errors.description ? 'border-red-500' : 'border-border'}`}
                      {...register('description')}
                    />
                    {errors.description && (
                      <span className="text-xs text-red-500 mt-0.5">{errors.description.message}</span>
                    )}
                  </div>

                  <Input
                    label="Estimated Project Budget (Optional)"
                    placeholder="e.g. $5,000 - $10,000"
                    icon={<DollarSign className="w-4 h-4" />}
                    error={errors.budget}
                    {...register('budget')}
                  />

                  <Controller
                    name="files"
                    control={control}
                    render={({ field }) => (
                      <FileDropzone
                        label="Upload Supporting Plans, Sketches, or DWG specs"
                        multiple={true}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.files}
                      />
                    )}
                  />

                  <div className="border-t border-border/60 mt-6 pt-6 flex justify-end">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="px-10 py-3.5 w-full sm:w-auto font-bold tracking-wide shadow-lg shadow-purple-800/20 hover:shadow-xl hover:shadow-purple-800/30 transition-all duration-300 transform hover:-translate-y-0.5 text-white bg-purple-950 border-purple-950 hover:bg-purple-700 hover:text-white hover:border-cyan-600"
                    >
                      {loading ? 'Logging Request...' : 'Submit Request'}
                    </Button>
                  </div>

                </form>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </>
  );
}
