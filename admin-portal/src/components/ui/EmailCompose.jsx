import { useState } from 'react';
import { Mail, Send, X } from 'lucide-react';
import { sendAdminEmailApi } from '../../services/api';

export default function EmailCompose({ toEmail, defaultSubject = 'Regarding your SkillCite Submission', onClose }) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    setSending(true);
    try {
      const res = await sendAdminEmailApi(toEmail, subject, body);
      if (res.success) {
        alert('Email sent successfully via Brevo!');
        onClose();
      } else {
        throw new Error(res.error || 'Failed to dispatch email');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm select-none">
      <div className="bg-surface rounded-3xl border border-border w-full max-w-lg p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5 text-accent">
            <Mail className="w-5 h-5" />
            <h2 className="text-lg font-bold font-display text-primary">Compose Email</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-bg-page text-muted transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Recipient */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
              To (Recipient)
            </label>
            <input
              type="text"
              value={toEmail}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg-page text-sm text-primary cursor-not-allowed outline-none"
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject line"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
              Message Body *
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Compose your personalized email response here..."
              rows={6}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none resize-none focus:ring-4 focus:ring-accent-light focus:border-accent"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-border text-sm font-semibold text-primary hover:bg-bg-page transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !body.trim() || !subject.trim()}
              className="px-6 py-2.5 rounded-full bg-accent text-white hover:bg-blue-700 active:scale-95 transition-all text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send Response'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
