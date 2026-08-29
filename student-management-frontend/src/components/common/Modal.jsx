import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`glass-card w-full ${maxWidth} max-h-[90vh] flex flex-col my-8 p-6 rounded-2xl border border-slate-700/80 shadow-2xl space-y-5 transform transition-all animate-scale-up`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 shrink-0">
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button 
            onClick={onClose} 
            aria-label="Đóng cửa sổ"
            title="Đóng (ESC)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
