import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  UserSquare2, 
  Cpu, 
  Mail, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Employers', path: '/employers', icon: <Briefcase className="w-5 h-5" /> },
    { label: 'Candidates', path: '/candidates', icon: <UserSquare2 className="w-5 h-5" /> },
    { label: 'Engineering Services', path: '/engineering', icon: <Cpu className="w-5 h-5" /> },
    { label: 'Contacts', path: '/contacts', icon: <Mail className="w-5 h-5" /> },
    { label: 'CMS Editor', path: '/cms', icon: <Settings className="w-5 h-5" /> },
    { label: 'Profile Settings', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-60 bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 h-screen flex flex-col justify-between select-none shrink-0 shadow-xl shadow-slate-100/40">
      <div className="flex flex-col">
        {/* Brand Header */}
        {/* <div className="py-6 px-6 border-b border-slate-100 flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-display font-extrabold text-xl shadow-lg shadow-blue-600/20 animate-pulse">S</span>
          <span className="font-extrabold text-base font-display text-slate-800 tracking-tight">Admin Cite</span>
        </div> */}

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="hidden md:flex items-center gap-2 font-medium text-sm bg-white border border-white/50 rounded-full px-2 py-1.5 shadow-sm shadow-primary/5">
        <Link to="/" className="group text-xl font-bold font-display tracking-tight text-accent flex items-center gap-2" data-cursor="expand">
          {/* <motion.span
            whileHover={{ rotate: -6, scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="relative w-9 h-9 rounded-lg bg-accent text-white flex items-center justify-center font-display font-extrabold text-lg shadow-lg shadow-accent/20 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 skew-x-[-20deg]" />
            <span className="relative">S</span>
          </motion.span> */}
          <span className="group relative inline-flex items-center">
            {/* Soft background glow */}
            <span className="absolute inset-0 rounded-xl bg-cyan-100 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100" />

            {/* Brand text */}
            <span className="relative bg-gradient-to-r from-slate-900 via-slate-700 to-cyan-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent transition-all duration-300 group-hover:scale-105">
              SkillCite
            </span>

            {/* Animated underline */}
            <span className="absolute -bottom-1 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out group-hover:w-full" />

            {/* Floating accent dot */}
            {/* <span className="absolute -right-3 top-1 h-2 w-2 rounded-full bg-cyan-500 shadow-md transition-all duration-300 group-hover:scale-125 group-hover:shadow-cyan-400/60" /> */}
          </span>
        </Link>
        
        </div>
        </div>
        <div className="py-6 px-6 border-b border-slate-100 flex items-center gap-3">
          {/* <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-display font-extrabold text-xl shadow-lg shadow-blue-600/20 animate-pulse">S</span> */}
          <span className="font-extrabold text-base font-display text-slate-800 tracking-tight">Admin Cite</span>
        </div>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-1.5 p-4 mt-6">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300
                  ${active
                    ? 'nav-pill-active translate-x-1'
                    : 'text-slate-500 hover:bg-blue-50/50 hover:text-blue-600'
                  }`}
              >
                <div className={`transition-transform duration-300 ${active ? 'scale-110 text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide text-red-500 hover:bg-red-50/70 transition-all duration-300"
        >
          <LogOut className="w-5 h-5 text-red-400" />
          Logout
        </button>
      </div>
    </aside>
  );
}
