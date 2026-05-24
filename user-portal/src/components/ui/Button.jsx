import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'filled', 
  type = 'button', 
  onClick, 
  disabled = false,
  className = '',
  icon
}) {
  const baseStyle = "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 select-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const variants = {
    filled: "bg-accent text-white hover:bg-blue-700 active:scale-[0.98]",
    outlined: "border border-border bg-transparent text-primary hover:bg-accent hover:border-accent hover:text-white active:scale-[0.98]",
    ghost: "bg-transparent text-muted hover:bg-accent-light hover:text-accent active:scale-[0.98]"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      data-cursor="expand"
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      {children}
    </motion.button>
  );
}
