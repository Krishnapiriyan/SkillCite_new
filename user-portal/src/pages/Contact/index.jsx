import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, User as UserIcon } from 'lucide-react';
import { submitContactMessageApi } from '../../services/api';
import useCms from '../../hooks/useCms';

import PageSEO from '../../components/ui/PageSEO';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import SuccessScreen from '../../components/ui/SuccessScreen';
import Button from '../../components/ui/Button';
import ScrollReveal from '../../components/animations/ScrollReveal';


// Validation Schema
const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  enquiryType: z.string().min(1, 'Please select an enquiry type'),
  message: z.string().min(1, 'Message content is required')
});

export default function Contact() {
  const { getCms } = useCms();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      enquiryType: 'general',
      message: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await submitContactMessageApi(data);
      if (res.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-20 bg-bg-page min-h-screen flex items-center justify-center">
        <SuccessScreen
          title="Message Sent Successfully"
          message={`Thank you, ${watch('fullName')}. Your enquiry has been routed directly to our support desk. We manually review all contact requests and will email you back personally within 24 hours.`}
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
        title="Contact Us | Support & Enquiries | SkillCite"
        description="Get in touch with the SkillCite staff directly. Submit general, candidate, or employer recruitment questions."
        canonical="/contact"
      />

      <div className="pt-32 pb-24 bg-bg-page min-h-screen select-none" style={{ backgroundColor: 'rgba(153, 186, 180, 0.7)' }}>
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-primary mb-3">
              Get In Touch Directly
            </h1>
            <p className="text-sm text-muted max-w-md mx-auto">
              Have questions about candidate CV submissions or custom estimation consulting? Fill out the form, and our staff will respond within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side: details card */}
            <ScrollReveal className="lg:col-span-5 w-full" delay={0.1}>
              <div className="flex flex-col gap-6 bg-primary text-white p-8 sm:p-10 rounded-3xl shadow-xl h-full">
                <h2 className="text-xl font-bold font-display">Contact Details</h2>
                <p className="text-xs text-hint leading-relaxed">
                  Connect with our administrative hub offline. Our offices are open Monday through Friday for phone and email support.
                </p>
                
                <ul className="flex flex-col gap-5 mt-4 text-xs tracking-wide">
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-white/60 text-[9px] uppercase font-bold">Call Us</span>
                      <span className="font-semibold">{getCms('contact.phone', '+1 (555) 019-2834')}</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-white/60 text-[9px] uppercase font-bold">Email Us</span>
                      <span className="font-semibold">{getCms('contact.email', 'admin@skillcite.com')}</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-accent shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-white/60 text-[9px] uppercase font-bold">Office Hub</span>
                      <span className="font-semibold">{getCms('contact.address', '100 Pine Street, San Francisco, CA')}</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-accent shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-white/60 text-[9px] uppercase font-bold">Business Hours</span>
                      <span className="font-semibold">{getCms('contact.hours', 'Monday - Friday: 9:00 AM - 6:00 PM')}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Right side: Form */}
            <ScrollReveal className="lg:col-span-7 w-full" delay={0.2}>
              <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xl">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  
                  <Input
                    label="Full Name *"
                    placeholder="e.g. John Doe"
                    icon={<UserIcon className="w-4 h-4" />}
                    error={errors.fullName}
                    {...register('fullName')}
                  />
                  
                  <Input
                    label="Email Address *"
                    placeholder="john.doe@gmail.com"
                    type="email"
                    icon={<Mail className="w-4 h-4" />}
                    error={errors.email}
                    {...register('email')}
                  />

                  <Select
                    label="Enquiry Category *"
                    placeholder="Select category"
                    options={[
                      { value: 'general', label: 'General Information' },
                      { value: 'candidate', label: 'Candidate & CV Enquiries' },
                      { value: 'employer', label: 'Employer Placements' },
                      { value: 'engineering', label: 'Engineering Calculations & DWG' },
                    ]}
                    error={errors.enquiryType}
                    {...register('enquiryType')}
                  />

                  <div className="w-full flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                      Your Message *
                    </label>
                    <textarea
                      placeholder="Describe your question or requirement details..."
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-primary bg-surface outline-none transition-all focus:ring-4 focus:ring-accent-light focus:border-accent resize-none
                        ${errors.message ? 'border-red-500' : 'border-border'}`}
                      {...register('message')}
                    />
                    {errors.message && (
                      <span className="text-xs text-red-500 mt-0.5">{errors.message.message}</span>
                    )}
                  </div>

                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      variant="filled"
                      disabled={loading}
                      className="w-full sm:w-auto"
                      icon={<Send className="w-4 h-4" />}
                    >
                      {loading ? 'Sending Message...' : 'Send Message'}
                    </Button>
                  </div>

                </form>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </>
  );
}
