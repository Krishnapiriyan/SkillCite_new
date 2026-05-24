import { useAuth } from '../../context/AuthContext';
import { UserCircle } from 'lucide-react';

export default function Topbar({ title = 'Dashboard' }) {
  const { admin } = useAuth();

  return (
    <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-slate-200/40 flex items-center justify-between px-8 select-none shrink-0 relative z-20 shadow-sm shadow-slate-100/10">
      {/* Title context */}
      <h1 className="text-lg font-extrabold font-display text-slate-800 tracking-tight">
        {title}
      </h1>

      {/* Admin details */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100/60 shadow-sm">
          {admin?.name ? admin.name.substring(0, 2).toUpperCase() : 'AD'}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 leading-tight">{admin?.name || 'System Admin'}</span>
          <span className="text-[9px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">{admin?.role || 'Administrator'}</span>
        </div>
      </div>
    </header>
  );
}
