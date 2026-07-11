import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCandidateByIdApi } from '../../services/api';
import { 
  User, ArrowLeft, Mail, MapPin, Phone, Briefcase, Award, 
  Globe, Download, FileText, CheckCircle2, MessageSquare, AlertCircle, Calendar
} from 'lucide-react';

import AdminLayout from '../../components/layout/AdminLayout';
import EmailCompose from '../../components/ui/EmailCompose';

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

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailOpen, setEmailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'coverLetter'

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getCandidateByIdApi(id);
        if (res.success && res.data) {
          setCandidate(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const resumeFile = candidate?.files?.find(f => !f.originalName.toLowerCase().includes('cover')) || candidate?.files?.[0];
  const coverLetterFile = candidate?.files?.find(f => f.originalName.toLowerCase().includes('cover')) || (candidate?.coverLetterUrl ? { publicUrl: candidate.coverLetterUrl, originalName: 'Cover Letter' } : null);

  if (loading) {
    return (
      <AdminLayout title="Candidate Details">
        <div className="w-full h-96 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!candidate) {
    return (
      <AdminLayout title="Candidate Details">
        <div className="text-center py-12">
          <p className="text-sm font-semibold text-muted">Candidate profile not found.</p>
          <button onClick={() => navigate('/candidates')} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-full text-xs font-bold hover:bg-slate-900 transition-colors shadow-sm">
            Back to Candidates List
          </button>
        </div>
      </AdminLayout>
    );
  }

  const fullName = `${candidate.firstName} ${candidate.lastName}`;

  return (
    <AdminLayout title={`Candidate Detail: ${fullName}`}>
      <div className="flex flex-col gap-6 select-none">
        
        {/* Navigation Action header bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <button 
            onClick={() => navigate('/candidates')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-full shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Candidates
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const subject = `Re: Your CV Submission on SkillCite - ${fullName}`;
                const body = `Hi ${candidate.firstName},\n\nThank you for submitting your CV to SkillCite.\n\nWe have successfully received your profile for ${candidate.specialty || ''} opportunities. Our team is currently reviewing your credentials against active requirements.\n\n[Type your reply here]\n\nBest regards,\nSkillCite Admin Team`;
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(candidate.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(gmailUrl, '_blank', 'width=800,height=650,scrollbars=yes,resizable=yes');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white text-xs font-bold shadow-md"
            >
              <Mail className="w-4 h-4" /> Reply via Gmail
            </button>
            <button
              onClick={() => setEmailOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white hover:bg-blue-700 active:scale-95 transition-all text-xs font-bold shadow-md"
            >
              <Mail className="w-4 h-4" /> Send Email (Internal)
            </button>
          </div>
        </div>

        {/* Info Grid (Personal vs Professional) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Card 1: Personal info */}
          <div className="lg:col-span-5 bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-5 text-left">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
              Personal Information
            </h3>
            
            <ul className="flex flex-col gap-4 text-xs">
              <li className="flex items-center gap-3">
                <User className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Full Name</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{fullName}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Email</span>
                  <span className="font-bold text-primary text-sm mt-0.5 break-all">{candidate.email}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Phone</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{candidate.phone}</span>
                </div>
              </li>
              {candidate.state && (
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted font-bold text-[9px] uppercase">Australian State</span>
                    <span className="font-bold text-primary text-sm mt-0.5">{candidate.state}</span>
                  </div>
                </li>
              )}
              {candidate.preferredCommunication && (
                <li className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-accent shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted font-bold text-[9px] uppercase">Preferred Contact</span>
                    <span className="font-bold text-primary text-sm mt-0.5">{candidate.preferredCommunication}</span>
                  </div>
                </li>
              )}
              {candidate.location && (
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted font-bold text-[9px] uppercase">Current Location</span>
                    <span className="font-bold text-primary text-sm mt-0.5">{candidate.location}</span>
                  </div>
                </li>
              )}
              {candidate.rightToWork && (
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted font-bold text-[9px] uppercase">Right to Work Status</span>
                    <span className="font-bold text-primary text-sm mt-0.5">{candidate.rightToWork}</span>
                  </div>
                </li>
              )}
              {candidate.nationality && (
                <li className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-accent shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted font-bold text-[9px] uppercase">Nationality</span>
                    <span className="font-bold text-primary text-sm mt-0.5">{candidate.nationality}</span>
                  </div>
                </li>
              )}
              <li className="flex items-center gap-3 border-t border-border/40 pt-3 mt-1">
                <Calendar className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Received Date & Time</span>
                  <span className="font-bold text-primary text-sm mt-0.5">
                    {(() => {
                      if (!candidate.submittedAt) return 'N/A';
                      const d = new Date(candidate.submittedAt);
                      if (isNaN(d.getTime())) return 'N/A';
                      const dateStr = d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
                      const timeStr = d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
                      return `${dateStr} at ${timeStr}`;
                    })()}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Card 2: Professional specs */}
          <div className="lg:col-span-7 bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-6 text-left">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
              Professional Profile
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="flex flex-col">
                <span className="text-muted font-bold text-[9px] uppercase">Specialty division</span>
                <span className="font-bold text-primary text-sm mt-0.5 capitalize">{candidate.specialty}</span>
              </div>
              {candidate.careerExperience && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Career Experience</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{candidate.careerExperience}</span>
                </div>
              )}
              {candidate.preferredRole && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Preferred Role</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{candidate.preferredRole}</span>
                </div>
              )}
              {candidate.experienceLevel && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Experience Level</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{candidate.experienceLevel}</span>
                </div>
              )}
              {candidate.yearsExperience !== undefined && candidate.yearsExperience > 0 && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Years of Experience</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{candidate.yearsExperience} Years</span>
                </div>
              )}
              {candidate.employmentStatus && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Employment Status</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{candidate.employmentStatus}</span>
                </div>
              )}
            </div>

            {/* Career Goals */}
            {candidate.careerGoals && candidate.careerGoals.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-muted font-bold text-[9px] uppercase">Candidate Career Goals</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {candidate.careerGoals.map(goal => {
                    const goalMap = {
                      'permanent': 'Permanent Opportunities',
                      'contract': 'Contract Opportunities',
                      'advice': 'Career Advice & Mentorship',
                      'exploring': 'Exploring the Market',
                      'chat': 'Just having a friendly Chat'
                    };
                    const cleanGoal = (goal || '').toLowerCase().trim();
                    const exactName = goalMap[cleanGoal] || goal;
                    return (
                      <span key={goal} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                        {exactName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-muted font-bold text-[9px] uppercase">Core Skills & Tooling</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {candidate.skills.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Cover Note */}
        {candidate.coverNote && (
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-3 text-left">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
              Candidate Cover Note
            </h3>
            <p className="text-sm text-primary/80 leading-relaxed font-medium mt-1">
              {candidate.coverNote}
            </p>
          </div>
        )}

        {/* Document Viewer Section with tabs for Cover Letter */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-5 text-left">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 flex-wrap gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('resume')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                  ${activeTab === 'resume' 
                    ? 'bg-accent text-white shadow-sm' 
                    : 'bg-bg-page text-muted border border-border hover:bg-border/30'}`}
              >
                Resume File
              </button>
              {coverLetterFile && (
                <button
                  onClick={() => setActiveTab('coverLetter')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                    ${activeTab === 'coverLetter' 
                      ? 'bg-accent text-white shadow-sm' 
                      : 'bg-bg-page text-muted border border-border hover:bg-border/30'}`}
                >
                  Cover Letter (Optional)
                </button>
              )}
            </div>

            {activeTab === 'resume' && resumeFile && (
              <a 
                href={resumeFile.publicUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-blue-700 text-white text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4" /> Download Resume
              </a>
            )}

            {activeTab === 'coverLetter' && coverLetterFile && (
              <a 
                href={coverLetterFile.publicUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-blue-700 text-white text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4" /> Download Cover Letter
              </a>
            )}
          </div>

          <div className="w-full bg-bg-page border border-border rounded-xl overflow-hidden h-[600px]">
            {activeTab === 'resume' ? (
              resumeFile ? (
                <iframe
                  src={resumeFile.publicUrl}
                  title="Candidate Resume"
                  className="w-full h-full border-none"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted">
                  <FileText className="w-10 h-10" />
                  <span className="text-xs font-semibold">No resume document uploaded for this candidate.</span>
                </div>
              )
            ) : (
              coverLetterFile ? (
                <iframe
                  src={coverLetterFile.publicUrl}
                  title="Candidate Cover Letter"
                  className="w-full h-full border-none"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted">
                  <FileText className="w-10 h-10" />
                  <span className="text-xs font-semibold">No cover letter document uploaded for this candidate.</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Email Compose Overlay Modal */}
        {emailOpen && (
          <EmailCompose
            toEmail={candidate.email}
            defaultSubject={`Regarding your SkillCite submission — Opportunity Match`}
            onClose={() => setEmailOpen(false)}
          />
        )}

      </div>
    </AdminLayout>
  );
}
