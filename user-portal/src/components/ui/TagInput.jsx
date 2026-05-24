import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

export default function TagInput({ 
  label, 
  value = [], 
  onChange, 
  placeholder = 'Type skill & press Enter',
  error,
  className = '' 
}) {
  const [inputVal, setInputVal] = useState('');

  const addTag = () => {
    const trimmed = inputVal.trim();
    if (trimmed && !value.includes(trimmed)) {
      const updated = [...value, trimmed];
      onChange(updated);
      setInputVal('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (indexToRemove) => {
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-primary/80 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className={`w-full p-2 rounded-xl border bg-surface flex flex-wrap gap-2 transition-all duration-200 min-h-[48px] focus-within:ring-4 focus-within:ring-accent-light focus-within:border-accent
        ${error ? 'border-red-500' : 'border-border'}`}
      >
        <AnimatePresence>
          {value.map((tag, idx) => (
            <motion.span
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-accent-light text-accent text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-accent/15 text-accent transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        
        <div className="flex-1 min-w-[120px] flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={value.length === 0 ? placeholder : ''}
            className="w-full bg-transparent border-none outline-none text-sm text-primary py-1"
          />
        </div>
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-0.5 ml-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
}
