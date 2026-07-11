import { useEffect, useState } from 'react';
import { getContactsApi, markContactReadApi } from '../../services/api';
import { Check, CheckCheck, MessageSquare, Mail } from 'lucide-react';

import AdminLayout from '../../components/layout/AdminLayout';
import DataTable from '../../components/ui/DataTable';
import EmailCompose from '../../components/ui/EmailCompose';

export default function ContactsIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState(null);
  const [emailTo, setEmailTo] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await getContactsApi();
        if (res.success && res.data) {
          setData(res.data.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleToggleRead = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await markContactReadApi(id, newStatus);
      setData(prev => prev.map(item => item.id === id ? { ...item, isRead: newStatus } : item));
    } catch (err) {
      console.error('Failed to toggle read status:', err);
    }
  };

  const handleReadMessage = async (row) => {
    setActiveMessage(row);
  };

  const columns = [
    { 
      label: 'Sender Name', 
      field: 'fullName',
      sortable: true,
      render: (row) => <span className="font-bold text-primary">{row.fullName}</span>
    },
    { label: 'Email', field: 'email', sortable: true },
    { 
      label: 'Category', 
      field: 'enquiryType', 
      sortable: true,
      render: (row) => (
        <span className="px-3.5 py-1.5 rounded-full text-[11.5px] font-black capitalize bg-amber-50 text-amber-600 border border-amber-100/70 inline-block tracking-wider shadow-sm">
          {row.enquiryType}
        </span>
      )
    },
    { 
      label: 'Date Received', 
      field: 'submittedAt', 
      sortable: true,
      render: (row) => {
        if (!row.submittedAt) return 'N/A';
        const d = new Date(row.submittedAt);
        if (isNaN(d.getTime())) return 'N/A';
        const dateStr = d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
        return (
          <div className="flex flex-col text-left">
            <span className="font-semibold text-primary">{dateStr}</span>
            <span className="text-[10px] text-muted font-medium mt-0.5">{timeStr}</span>
          </div>
        );
      }
    },
    {
      label: 'Actions',
      field: 'id',
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleReadMessage(row)}
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-bg-page text-primary transition-all flex items-center justify-center"
            title="Read Message"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEmailTo(row.email)}
            className="p-1.5 rounded-lg bg-accent-light text-accent hover:bg-accent hover:text-white transition-all flex items-center justify-center"
            title="Send Email"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="General Contact Messages">
      <div className="flex flex-col gap-6 select-none">
        
        <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col gap-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-primary">Contacts Messages Intake</h2>
            <p className="text-xs text-muted font-medium mt-0.5">
              Read general, candidate support, or employer support messages sent directly from the public portal contact forms.
            </p>
          </div>

          {loading ? (
            <div className="w-full h-40 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
            </div>
          ) : (
          <DataTable
            columns={columns}
            data={data}
            searchField="fullName"
            searchPlaceholder="Search contacts..."
            onRowClick={handleReadMessage}
            filterField="enquiryType"
            filterPlaceholder="All Enquiry Types"
            filterOptions={[
              { label: 'General', value: 'general' },
              { label: 'Support', value: 'support' },
              { label: 'Sales', value: 'sales' },
              { label: 'Partnership', value: 'partnership' }
            ]}
            rowClassName={(row) => !row.isRead ? 'bg-amber-50/40 font-bold' : ''}
            actionsRender={(row) => (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleRead(row.id, row.isRead);
                }}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg border transition-colors flex items-center gap-1.5
                  ${!row.isRead 
                    ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
              >
                {!row.isRead ? (
                  <>
                    <Check className="w-3 h-3" />
                    Read
                  </>
                ) : (
                  <>
                    <CheckCheck className="w-3 h-3" />
                    Read
                  </>
                )}
              </button>
            )}
          />
        )}
        </div>

        {/* Read Message Modal overlay */}
        {activeMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-surface border border-border rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl flex flex-col gap-5 relative text-left">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-lg font-display text-primary">Contact Query Message</h3>
                <span className="text-[10px] text-muted font-bold tracking-wider uppercase mt-1 block">
                  Sender: {activeMessage.fullName} ({activeMessage.email})
                </span>
                <span className="text-[10px] text-muted font-bold tracking-wider uppercase mt-1 block">
                  Received: {(() => {
                    if (!activeMessage.submittedAt) return 'N/A';
                    const d = new Date(activeMessage.submittedAt);
                    if (isNaN(d.getTime())) return 'N/A';
                    const dateStr = d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const timeStr = d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
                    return `${dateStr} at ${timeStr}`;
                  })()}
                </span>
              </div>
              <p className="text-sm text-primary/80 leading-relaxed whitespace-pre-wrap font-medium">
                {activeMessage.message}
              </p>
              <div className="flex items-center justify-end gap-3 border-t border-border/60 pt-4 mt-2">
                <button
                  onClick={() => {
                    const subject = `Re: Response to your SkillCite Contact Query`;
                    const body = `Hi ${activeMessage.fullName},\n\nThank you for reaching out to SkillCite.\n\nWe have received your support inquiry regarding: "${activeMessage.enquiryType || 'General support'}".\n\n[Type your reply here]\n\nBest regards,\nSkillCite Admin Team`;
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(activeMessage.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.open(gmailUrl, '_blank', 'width=800,height=650,scrollbars=yes,resizable=yes');
                  }}
                  className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> Reply in Gmail
                </button>
                <button
                  onClick={() => setActiveMessage(null)}
                  className="px-5 py-2 rounded-full bg-accent text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md"
                >
                  Close Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email composer modal */}
        {emailTo && (
          <EmailCompose
            toEmail={emailTo}
            defaultSubject="Response to your SkillCite Contact Query"
            onClose={() => setEmailTo(null)}
          />
        )}

      </div>
    </AdminLayout>
  );
}
