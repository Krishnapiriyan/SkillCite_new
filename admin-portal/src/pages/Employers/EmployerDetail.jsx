import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployerByIdApi } from '../../services/api';
import { Briefcase, ArrowLeft, Mail, Globe, MapPin, Phone, User, Calendar, DollarSign, Download, FileText, CheckCircle2, Award } from 'lucide-react';

import AdminLayout from '../../components/layout/AdminLayout';
import EmailCompose from '../../components/ui/EmailCompose';

export default function EmployerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailOpen, setEmailOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getEmployerByIdApi(id);
        if (res.success && res.data) {
          setRequest(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const formatSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <AdminLayout title="Employer Details">
        <div className="w-full h-96 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!request) {
    return (
      <AdminLayout title="Employer Details">
        <div className="text-center py-12">
          <p className="text-sm font-semibold text-muted">Employer request not found.</p>
          <button onClick={() => navigate('/employers')} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-full text-xs font-bold hover:bg-slate-900 transition-colors shadow-sm">
            Back to Employers List
          </button>
        </div>
      </AdminLayout>
    );
  }

  const companyToDisplay = request.company || request.companyName || 'Company';
  const contactToDisplay = request.contactPerson || `${request.contactFirstName || ''} ${request.contactLastName || ''}`.trim() || 'Contact';
  const emailToDisplay = request.workEmail || request.email || 'Email';

  return (
    <AdminLayout title={`Employer Detail: ${companyToDisplay}`}>
      <div className="flex flex-col gap-6 select-none">
        
        {/* Back and Email Action header bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <button 
            onClick={() => navigate('/employers')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-full shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Employers
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const subject = `Re: Your Talent Request on SkillCite - ${companyToDisplay}`;
                const body = `Hi ${contactToDisplay},\n\nThank you for requesting talent through SkillCite for ${companyToDisplay}.\n\nWe have received your requirements for the ${request.specialty || ''} - ${request.jobTitle || request.requiredRole || ''} position. Our team is currently shortlisting candidates that match your criteria.\n\n[Type your reply here]\n\nBest regards,\nSkillCite Admin Team`;
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailToDisplay)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

        {/* Info Grid (Company vs Role) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Card 1: Company Profile Info */}
          <div className="lg:col-span-5 bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-5 text-left">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
              Company Profile
            </h3>
            
            <ul className="flex flex-col gap-4 text-xs">
              <li className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Company</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{companyToDisplay}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <User className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Contact Person</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{contactToDisplay}</span>
                </div>
              </li>
              {request.position && (
                <li className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-accent shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted font-bold text-[9px] uppercase">Contact Position / Title</span>
                    <span className="font-bold text-primary text-sm mt-0.5">{request.position}</span>
                  </div>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Email</span>
                  <span className="font-bold text-primary text-sm mt-0.5 break-all">{emailToDisplay}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Phone</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{request.phone}</span>
                </div>
              </li>
              {request.state && (
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted font-bold text-[9px] uppercase">State Location</span>
                    <span className="font-bold text-primary text-sm mt-0.5">{request.state}</span>
                  </div>
                </li>
              )}
              {request.location && (
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted font-bold text-[9px] uppercase">Office Location</span>
                    <span className="font-bold text-primary text-sm mt-0.5">{request.location}</span>
                  </div>
                </li>
              )}
              {request.website && (
                <li className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-accent shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-muted font-bold text-[9px] uppercase">Website</span>
                    <a href={request.website} target="_blank" rel="noreferrer" className="font-bold text-accent text-sm mt-0.5 underline">
                      {request.website}
                    </a>
                  </div>
                </li>
              )}
              <li className="flex items-center gap-3 border-t border-border/40 pt-3 mt-1">
                <Calendar className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Received Date & Time</span>
                  <span className="font-bold text-primary text-sm mt-0.5">
                    {(() => {
                      if (!request.submittedAt) return 'N/A';
                      const d = new Date(request.submittedAt);
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

          {/* Card 2: Role Details specs */}
          <div className="lg:col-span-7 bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-6 text-left">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
              Recruitment Requirements
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {request.engagementNeed && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Engagement Need</span>
                  <span className="font-bold text-primary text-sm mt-0.5 text-accent">{request.engagementNeed}</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-muted font-bold text-[9px] uppercase">Division Specialty</span>
                <span className="font-bold text-primary text-sm mt-0.5 capitalize">{request.specialty}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted font-bold text-[9px] uppercase">Required Role / Title</span>
                <span className="font-bold text-primary text-sm mt-0.5">{request.jobTitle || request.requiredRole}</span>
              </div>
              {request.jobLocation && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Job Location</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{request.jobLocation}</span>
                </div>
              )}
              {request.jobType && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Job Type</span>
                  <span className="font-bold text-primary text-sm mt-0.5 capitalize">{request.jobType}</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-muted font-bold text-[9px] uppercase">Experience Level</span>
                <span className="font-bold text-primary text-sm mt-0.5 capitalize">{request.experienceLevel}</span>
              </div>
              {request.projectType && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Project Type</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{request.projectType}</span>
                </div>
              )}
              {request.timeline && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Start Timeline</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{request.timeline}</span>
                </div>
              )}
              {request.employmentType && request.employmentType.length > 0 && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Employment Type Options</span>
                  <span className="font-bold text-primary text-sm mt-0.5">
                    {request.employmentType.join(', ')}
                  </span>
                </div>
              )}
              {request.budgetRange && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Budget Range</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{request.budgetRange}</span>
                </div>
              )}
              {request.teamSize !== undefined && request.teamSize !== null && (
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Team Size Needed</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{request.teamSize}</span>
                </div>
              )}
            </div>

            {/* Skills */}
            {request.requiredSkills && request.requiredSkills.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-muted font-bold text-[9px] uppercase">Required Technical Skills</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {request.requiredSkills.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* JD description */}
        {request.description && (
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-3 text-left">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
              Detailed Role & Project Description
            </h3>
            <p className="text-sm text-primary/80 leading-relaxed font-medium whitespace-pre-wrap mt-1">
              {request.description}
            </p>
          </div>
        )}

        {/* JD files download links */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-4 text-left">
          <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
            Uploaded Specs & Supporting Documents
          </h3>
          
          <div className="flex flex-col gap-2.5">
            {request.files && request.files.length > 0 ? (
              request.files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg-page/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center text-accent shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-primary max-w-[200px] sm:max-w-xs truncate">{file.originalName}</span>
                      <span className="text-[10px] text-muted font-medium mt-0.5">{formatSize(file.sizeBytes)} • {file.mimeType}</span>
                    </div>
                  </div>

                  <a 
                    href={file.publicUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-accent hover:bg-blue-700 text-white transition-colors flex items-center justify-center"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted font-medium">No specs files uploaded with this recruitment request.</p>
            )}
          </div>
        </div>

        {/* Manual email composer modal overlay */}
        {emailOpen && (
          <EmailCompose
            toEmail={emailToDisplay}
            defaultSubject={`Regarding your talent request for ${companyToDisplay} — SkillCite`}
            onClose={() => setEmailOpen(false)}
          />
        )}

      </div>
    </AdminLayout>
  );
}
