import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export default function FileDropzone({
  label,
  onChange,
  value = [],
  multiple = false,
  accept = '.pdf,.doc,.docx,.dwg,.dxf,.png,.jpg,.jpeg,.webp',
  maxSizeMb = 10,
  error,
  className = ''
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFiles = (fileList) => {
    const validFiles = [];
    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxSizeBytes) {
        alert(`File ${file.name} is too large. Max size is ${maxSizeMb}MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      if (multiple) {
        onChange([...value, ...validFiles]);
      } else {
        onChange([validFiles[0]]);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (idxToRemove) => {
    const updated = value.filter((_, idx) => idx !== idxToRemove);
    onChange(updated);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-primary/80 tracking-wide uppercase">
          {label}
        </label>
      )}
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`w-full py-8 px-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer select-none transition-all duration-300
          ${isDragActive 
            ? 'border-accent bg-accent-light/50 scale-[1.01]' 
            : error 
              ? 'border-red-400 bg-red-50/20 hover:bg-red-50/30' 
              : 'border-border bg-bg-page hover:bg-accent-light/20 hover:border-accent/40'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center text-accent">
          <Upload className="w-5 h-5" />
        </div>
        
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">
            Drag & drop files here, or <span className="text-accent underline">browse</span>
          </p>
          <p className="text-xs text-muted mt-1">
            Supports PDF, DOCX, DWG, DXF, images (Max {maxSizeMb}MB)
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {value.map((file, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-light/60 flex items-center justify-center text-accent">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-primary max-w-[200px] sm:max-w-xs md:max-w-md truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted">
                    {formatSize(file.size)}
                  </span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 text-muted hover:text-red-500 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <span className="text-xs text-red-500 mt-0.5 ml-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
}
