import { Link } from 'react-router-dom';
import useCms from '../../hooks/useCms';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const { getCms } = useCms();

  return (
    // <footer className="relative overflow-hidden bg-[#f5f3f0] text-white">
    //     <div className="absolute inset-0">
    //       <div className="blob blob-1"></div>
    //       <div className="blob blob-2"></div>
    //       <div className="blob blob-3"></div>
    //     </div>

    <footer className="relative overflow-hidden bg-[#221725] text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-200px] top-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#D8C8D9]/40 rounded-full blur-[120px] opacity-70" />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-4">
          

        <Link to="/" className="group text-xl font-bold font-display tracking-tight text-accent flex items-center gap-1.5" data-cursor="expand">
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
            <span className="absolute inset-0 rounded-xl bg-cyan-100 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-20" />

            {/* Brand text */}
            <span className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-purple-950 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent transition-all duration-300 group-hover:scale-105 ">
              SkillCite
            </span>

            {/* Animated underline */}
            <span className="absolute -bottom-1 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r from-purple-950 to-gray-800-500 transition-all duration-500 ease-out group-hover:w-full" />

            {/* Floating accent dot */}
            {/* <span className="absolute -right-3 top-1 h-2 w-2 rounded-full bg-purple-500 shadow-md transition-all duration-300 group-hover:scale-125 group-hover:shadow-purple-400/60" /> */}
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
            <li><Link to="/request-talent" className="hover:text-purple-900 transition-colors">Request Hire Talent</Link></li>
            <li><Link to="/submit-your-cv" className="hover:text-purple-900 transition-colors">Submit Resume / CV</Link></li>
            <li><Link to="/engineering-services" className="hover:text-purple-900 transition-colors">Engineering & Technical Services</Link></li>
            <li><Link to="/about" className="hover:text-purple-900 transition-colors">About Our Platform</Link></li>
          </ul>
        </div>

        {/* Column 3: Specialized Divisions */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-xs tracking-wider uppercase text-hint">Recruitment Divisions</h3>
          <ul className="flex flex-col gap-2.5 text-xs text-hint font-medium">
            <li className="hover:text-purple-900 transition-colors cursor-pointer">Engineering Recruitment</li>
            <li className="hover:text-purple-900 transition-colors cursor-pointer">Accounting Recruitment</li>
            <li className="hover:text-purple-900 transition-colors cursor-pointer">Administration Recruitment</li>
            <li className="hover:text-purple-900 transition-colors cursor-pointer">Other Recruitment</li>
          </ul>
        </div>

        {/* Column 4: Contact and Address Details */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-xs tracking-wider uppercase text-hint">Contact Information</h3>
          <ul className="flex flex-col gap-3 text-xs text-hint">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-purple-900 shrink-0" />
              <span>{getCms('contact.phone', '+1 (555) 019-2834')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-purple-900 shrink-0" />
              <span>{getCms('contact.email', 'admin@skillcite.com')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-purple-900 shrink-0" />
              <span>{getCms('contact.address', '100 Pine Street, San Francisco, CA')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-purple-900 shrink-0" />
              <span>{getCms('contact.hours', 'Monday - Friday: 9:00 AM - 6:00 PM')}</span>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}