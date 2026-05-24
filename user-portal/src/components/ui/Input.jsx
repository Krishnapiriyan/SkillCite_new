import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  placeholder, 
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
        <input
          ref={ref}
          type={type}
          placeholder=" "
          className={`w-full pt-6 pb-2 rounded-xl border text-sm text-primary bg-surface transition-all duration-300 outline-none peer
            ${icon ? 'pl-10' : 'pl-4'}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-border focus:border-accent focus:ring-4 focus:ring-accent/15 focus:shadow-lg focus:shadow-accent/10'
            }`}
          {...props}
        />
        {label && (
          <label className={`absolute transition-all duration-300 pointer-events-none select-none text-[10px] font-extrabold text-muted uppercase tracking-wider top-2
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-hint
            peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-accent peer-focus:font-extrabold
            ${icon ? 'left-10' : 'left-4'}`}
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-0.5 ml-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
