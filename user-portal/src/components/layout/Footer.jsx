import { Link } from 'react-router-dom';
import useCms from '../../hooks/useCms';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const { getCms } = useCms();

  return (
    <footer className="w-full bg-primary text-white border-t border-white/5 select-none">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-xl font-bold font-display text-accent flex items-center gap-1.5">
            {/* <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-display font-extrabold text-lg">S</span> */}
            {/* SkillCite */}
            {/* <img src="/src/assets/logo_white.png" alt="SkillCite Logo" className="w-24 h-auto" /> */}
          <span className="group relative inline-flex items-center">
            {/* Soft background glow */}
            <span className="absolute inset-0 rounded-xl bg-cyan-100 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-20" />

            {/* Brand text */}
            <span className="relative bg-gradient-to-r from-slate-500 via-slate-700 to-cyan-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent transition-all duration-300 group-hover:scale-105">
              SkillCite
            </span>

            {/* Animated underline */}
            {/* <span className="absolute -bottom-1 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out group-hover:w-full" /> */}

            {/* Floating accent dot */}
            {/* <span className="absolute -right-3 top-1 h-2 w-2 rounded-full bg-cyan-500 shadow-md transition-all duration-300 group-hover:scale-125 group-hover:shadow-cyan-400/60" /> */}
          </span>
          </Link>
          <p className="text-xs text-hint leading-relaxed max-w-xs mt-1">
            Professional recruitment and consultancy services delivered personally. We manually review every submission to ensure the right alignment.
          </p>
          <span className="text-[10px] text-hint/55 mt-4">
            {getCms('footer.copyright', '© 2026 SkillCite. All rights reserved.')}
          </span>
        </div>

        {/* Column 2: Navigation Services */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-xs tracking-wider uppercase text-hint">Services</h3>
          <ul className="flex flex-col gap-2.5 text-xs text-hint font-medium">
            <li><Link to="/request-talent" className="hover:text-accent transition-colors">Request Hire Talent</Link></li>
            <li><Link to="/submit-your-cv" className="hover:text-accent transition-colors">Submit Resume / CV</Link></li>
            <li><Link to="/engineering-services" className="hover:text-accent transition-colors">Engineering & Technical Services</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About Our Platform</Link></li>
          </ul>
        </div>

        {/* Column 3: Specialized Divisions */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-xs tracking-wider uppercase text-hint">Recruitment Divisions</h3>
          <ul className="flex flex-col gap-2.5 text-xs text-hint font-medium">
            <li className="hover:text-accent transition-colors cursor-pointer">Engineering Recruitment</li>
            <li className="hover:text-accent transition-colors cursor-pointer">Accounting Recruitment</li>
            <li className="hover:text-accent transition-colors cursor-pointer">Administration Recruitment</li>
            <li className="hover:text-accent transition-colors cursor-pointer">Operations Recruitment</li>
          </ul>
        </div>

        {/* Column 4: Contact and Address Details */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-xs tracking-wider uppercase text-hint">Contact Information</h3>
          <ul className="flex flex-col gap-3 text-xs text-hint">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <span>{getCms('contact.phone', '+1 (555) 019-2834')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-accent shrink-0" />
              <span>{getCms('contact.email', 'admin@skillcite.com')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span>{getCms('contact.address', '100 Pine Street, San Francisco, CA')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-accent shrink-0" />
              <span>{getCms('contact.hours', 'Monday - Friday: 9:00 AM - 6:00 PM')}</span>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
