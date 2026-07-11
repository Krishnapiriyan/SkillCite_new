import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEngineeringByIdApi } from '../../services/api';
import { Cpu, ArrowLeft, Mail, MapPin, Phone, User, Calendar, DollarSign, Download, FileText } from 'lucide-react';

import AdminLayout from '../../components/layout/AdminLayout';
import EmailCompose from '../../components/ui/EmailCompose';

export default function EngineeringDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailOpen, setEmailOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getEngineeringByIdApi(id);
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
      <AdminLayout title="Engineering Details">
        <div className="w-full h-96 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!request) {
    return (
      <AdminLayout title="Engineering Details">
        <div className="text-center py-12">
          <p className="text-sm font-semibold text-muted">Engineering service request not found.</p>
          <button onClick={() => navigate('/engineering')} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-full text-xs font-bold hover:bg-slate-900 transition-colors shadow-sm">
            Back to Engineering List
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Technical Proposal: ${request.fullName}`}>
      <div className="flex flex-col gap-6 select-none">
        
        {/* Back and Action bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <button 
            onClick={() => navigate('/engineering')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-full shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Engineering
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const subject = `Re: Your Engineering Services Request on SkillCite - ${request.serviceType}`;
                const body = `Hi ${request.fullName},\n\nThank you for contacting SkillCite regarding our Engineering Services.\n\nWe have received your request for ${request.serviceType || 'engineering'} services. Our technical team is reviewing your project details.\n\n[Type your reply here]\n\nBest regards,\nSkillCite Admin Team`;
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(request.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

        {/* Info Grid (Client Profile vs Service Specs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Card 1: Client profile */}
          <div className="lg:col-span-5 bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-5">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
              Client Profile
            </h3>
            
            <ul className="flex flex-col gap-4 text-xs">
              <li className="flex items-center gap-3">
                <User className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Client Full Name</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{request.fullName}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Email</span>
                  <span className="font-bold text-primary text-sm mt-0.5 break-all">{request.email}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Phone</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{request.phone}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="text-muted font-bold text-[9px] uppercase">Company Office</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{request.company || 'Personal submission'}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Card 2: Service Specs */}
          <div className="lg:col-span-7 bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-6">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
              Engineering Service Specifications
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="flex flex-col">
                <span className="text-muted font-bold text-[9px] uppercase">Service Competency</span>
                <span className="font-bold text-primary text-sm mt-0.5 capitalize">{request.serviceType}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted font-bold text-[9px] uppercase">Preferred Deadline</span>
                <span className="font-bold text-primary text-sm mt-0.5">
                  {(() => {
                    if (!request.deadline) return 'N/A';
                    const d = new Date(request.deadline);
                    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-AU');
                  })()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted font-bold text-[9px] uppercase">Estimated Budget</span>
                <span className="font-bold text-primary text-sm mt-0.5">{request.budget || 'Not specified'}</span>
              </div>
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
            </div>
          </div>

        </div>

        {/* Specs Description */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-3">
          <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
            Project Specs Details & Computations Proposal
          </h3>
          <p className="text-sm text-primary/80 leading-relaxed font-medium whitespace-pre-wrap mt-1">
            {request.description}
          </p>
        </div>

        {/* Uploaded Specs files */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-2">
            Uploaded Plan Sets & Sketches files
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
              <p className="text-xs text-muted font-medium">No specs files uploaded with this proposal.</p>
            )}
          </div>
        </div>

        {/* Compose manual response email overlay */}
        {emailOpen && (
          <EmailCompose
            toEmail={request.email}
            defaultSubject={`Regarding your SkillCite service request for ${request.serviceType} — Review completed`}
            onClose={() => setEmailOpen(false)}
          />
        )}

      </div>
    </AdminLayout>
  );
}
