import React from 'react';

const Select = React.forwardRef(({ 
  label, 
  error, 
  options = [], 
  placeholder = 'Select an option', 
  icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      <div className="relative w-full">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-hint z-10">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          className={`w-full pt-6 pb-2 rounded-xl border text-sm text-primary bg-surface transition-all duration-300 outline-none appearance-none cursor-pointer peer
            ${icon ? 'pl-10' : 'pl-4'}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-border focus:border-accent focus:ring-4 focus:ring-accent/15 focus:shadow-lg focus:shadow-accent/10'
            }`}
          {...props}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
        
        {label && (
          <label className={`absolute transition-all duration-300 pointer-events-none select-none text-[10px] font-extrabold text-muted uppercase tracking-wider top-2
            peer-focus:text-accent peer-focus:font-extrabold
            ${icon ? 'left-10' : 'left-4'}`}
          >
            {label}
          </label>
        )}
        
        <div className="absolute inset-y-0 right-0 pr-10 flex items-center pointer-events-none text-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-0.5 ml-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
