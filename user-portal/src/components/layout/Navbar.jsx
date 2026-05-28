import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ChevronDown, Award, Briefcase, Cpu } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const servicesRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return undefined;

    const handlePointerDown = (event) => {
      if (servicesRef.current?.contains(event.target)) return;
      setDropdownOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  // Close mobile menu on page change
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsOpen(false);
      setDropdownOpen(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const servicesActive = ['/request-talent', '/submit-your-cv', '/engineering-services'].includes(location.pathname);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const serviceLinks = [
    {
      label: 'Request Talent',
      description: 'Hire premium contractors',
      to: '/request-talent',
      icon: Briefcase,
    },
    {
      label: 'Submit Resume',
      description: 'Join our talent network',
      to: '/submit-your-cv',
      icon: Award,
    },
    {
      label: 'Engineering Services',
      description: 'AutoCAD drawings & estimation',
      to: '/engineering-services',
      icon: Cpu,
    },
  ];

  const mobileLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Request Talent', to: '/request-talent' },
    { label: 'Submit Your CV', to: '/submit-your-cv' },
    { label: 'Engineering Services', to: '/engineering-services' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-[90] transition-all duration-300 border-b select-none
      ${scrolled 
        ? 'py-6 bg-transparent border-transparent' 
        : 'py-6 bg-transparent border-transparent'
      }`}
    >
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

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2 font-medium text-sm bg-white border border-white/50 rounded-full px-2 py-1.5 shadow-sm shadow-primary/5">
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 rounded-full transition-colors duration-300 hover:text-purple-800 ${isActive(link.to) ? 'text-purple-800' : 'text-primary/70'}`}
            >
              {isActive(link.to) && (
                <motion.span
                  layoutId="desktop-nav-active"
                  className="absolute inset-0 rounded-full bg-purple-100 border border-purple-300"
                  transition={{ type: 'spring', stiffness: 430, damping: 34 }}
                />
              )}
              <span className="mask-link relative z-10">
                <span className="mask-link-text">{link.label}</span>
                <span className="mask-link-clone text-purple-800">{link.label}</span>
              </span>
            </Link>
          ))}

          {/* Recruitment Dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              onFocus={() => setDropdownOpen(true)}
              className={`relative flex items-center gap-1 px-4 py-2 rounded-full transition-colors duration-300 hover:text-purple-800 focus:outline-none ${servicesActive || dropdownOpen ? 'text-purple-800' : 'text-primary/70'}`}
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
            >
              {(servicesActive || dropdownOpen) && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-purple-100 border border-purple-300"
                  transition={{ type: 'spring', stiffness: 430, damping: 34 }}
                />
              )}
              <span className="mask-link relative z-10 flex items-center gap-1">
                <span className="mask-link-text">Services</span>
                <span className="mask-link-clone text-purple-800">Services</span>
              </span>
              <ChevronDown className={`relative z-10 w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="
                    absolute top-[calc(100%+0.75rem)] 
                    left-0 lg:left-auto lg:right-0
                    z-[120]

                    w-[20rem] sm:w-[13rem] md:w-[15rem]
                    max-h-[calc(100vh-6rem)]

                    overflow-y-auto
                    rounded-3xl
                    border border-white/40
                    bg-white/85
                    backdrop-blur-2xl

                    shadow-[0_10px_40px_rgba(0,0,0,0.08)]

                    p-3
                    flex flex-col gap-2

                    transition-all duration-300
                  "
                  role="menu"
                >
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-l border-t border-border rotate-45" />
                  {serviceLinks.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.2 }}
                      >
                        <Link to={item.to} role="menuitem" className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-100 transition-colors text-primary">
                          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-800 transition-transform duration-300 group-hover:scale-105">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">{item.label}</span>
                            <span className="text-[10px] text-muted">{item.description}</span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.slice(2).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 rounded-full transition-colors duration-300 hover:text-purple-800 ${isActive(link.to) ? 'text-purple-800' : 'text-primary/70'}`}
            >
              {isActive(link.to) && (
                <motion.span
                  layoutId="desktop-nav-active"
                  className="absolute inset-0 rounded-full bg-purple-100 border border-purple-300"
                  transition={{ type: 'spring', stiffness: 430, damping: 34 }}
                />
              )}
              <span className="mask-link relative z-10">
                <span className="mask-link-text">{link.label}</span>
                <span className="mask-link-clone text-purple-800">{link.label}</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop CTA Action
        <div className="hidden md:block">
          <Link to="/request-talent">
            <Button variant="filled" bg="violet-900">
              Request Engineers
            </Button>
          </Link>
        </div> */}

        {/* Mobile Menu Icon Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-primary hover:bg-accent-light transition-colors"
          aria-label="Toggle navigation menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? 'close' : 'menu'}
              initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
              transition={{ duration: 0.16 }}
              className="block"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute top-full inset-x-0 bg-surface/95 backdrop-blur-xl border-b border-border shadow-xl shadow-primary/10 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-2">
              {mobileLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.035, duration: 0.2 }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center justify-between text-base font-semibold px-3 py-3 rounded-xl border border-transparent transition-colors ${isActive(link.to) ? 'text-purple-800 bg-purple-100 border-purple-300' : 'text-primary hover:bg-purple-100/70'}`}
                  >
                    {link.label}
                    {isActive(link.to) && <span className="w-1.5 h-1.5 rounded-full bg-purple-800" />}
                  </Link>
                </motion.div>
              ))}
              {/* <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.22 }}
              >
                <Link to="/request-talent" className="mt-3 block">
                  <Button variant="filled" className="w-full" bg="violet-900">
                    Request Engineers
                  </Button>
                </Link>
              </motion.div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
