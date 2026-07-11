import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  LayoutDashboard, 
  Briefcase, 
  UserSquare2, 
  Cpu, 
  Mail, 
  Settings, 
  LogOut,
  User,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const location = useLocation();
  const [counts, setCounts] = useState({ employers: 0, candidates: 0, engineering: 0, contacts: 0 });

  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const { data } = await api.get('/admin/analytics/notifications/counts');
        if (isMounted && data.success) {
          setCounts(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch notification counts", err);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 5000); // Poll every 5s for fast updates
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [location.pathname]); // Fetch immediately when navigating (e.g. going into or out of a detail view)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'employers', label: 'Employers', path: '/employers', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'candidates', label: 'Candidates', path: '/candidates', icon: <UserSquare2 className="w-5 h-5" /> },
    { id: 'engineering', label: 'Engineering Services', path: '/engineering', icon: <Cpu className="w-5 h-5" /> },
    { id: 'contacts', label: 'Contacts', path: '/contacts', icon: <Mail className="w-5 h-5" /> },
    { id: 'cms', label: 'CMS Editor', path: '/cms', icon: <Settings className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile Settings', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200/60 h-screen flex flex-col justify-between select-none shrink-0 shadow-xl
        transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:bg-white/80 md:backdrop-blur-2xl md:shadow-xl md:shadow-slate-100/40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo */}
            <div className="hidden md:flex items-center gap-2 font-medium text-sm bg-white border border-white/50 rounded-full px-2 py-1.5 shadow-sm shadow-primary/5">
              <Link to="/" className="group text-xl font-bold font-display tracking-tight text-accent flex items-center gap-2" data-cursor="expand">
                <span className="group relative inline-flex items-center">
                  <span className="absolute inset-0 rounded-xl bg-cyan-100 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100" />
                  <span className="relative bg-gradient-to-r from-slate-900 via-slate-700 to-cyan-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent transition-all duration-300 group-hover:scale-105">
                    SkillCite
                  </span>
                  <span className="absolute -bottom-1 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out group-hover:w-full" />
                </span>
              </Link>
            </div>
          </div>
          <div className="py-6 px-6 border-b border-slate-100 flex items-center justify-between gap-3">
            <span className="font-extrabold text-base font-display text-slate-800 tracking-tight">Admin Cite</span>
            <button 
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-1.5 p-4 mt-6">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const count = item.id ? counts[item.id] : 0;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300
                  ${active
                    ? 'nav-pill-active translate-x-1'
                    : 'text-slate-500 hover:bg-blue-50/50 hover:text-blue-600'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`transition-transform duration-300 ${active ? 'scale-110 text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}>
                    {item.icon}
                  </div>
                  {item.label}
                </div>
                {count > 0 && (
                  <span className="flex items-center justify-center bg-red-500 text-white text-[10px] font-black h-5 min-w-[20px] px-1.5 rounded-full shadow-sm shadow-red-500/30 transition-all duration-300 animate-in fade-in zoom-in">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 mt-4 px-3 py-2.5 rounded-xl text-xs font-bold text-red-100 bg-red-600 hover:bg-red-700 shadow-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  </>
  );
}
