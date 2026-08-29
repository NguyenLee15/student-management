import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-400 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-slate-900/95 text-emerald-200',
    error: 'border-rose-500/30 bg-slate-900/95 text-rose-200',
    info: 'border-sky-500/30 bg-slate-900/95 text-sky-200',
    warning: 'border-amber-500/30 bg-slate-900/95 text-amber-200',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div role="alert" aria-label="Thông báo hệ thống" className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl ${borders[toast.type] || borders['info']}`}>
        {icons[toast.type] || icons['info']}
        <div className="text-xs font-medium pr-2">
          {toast.message}
        </div>
        <button onClick={onClose} aria-label="Đóng thông báo" className="text-slate-400 hover:text-white transition p-1">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
