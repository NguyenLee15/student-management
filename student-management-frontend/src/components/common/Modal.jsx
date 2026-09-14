import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

let openModalCount = 0;
let previousBodyOverflow = '';
const openModalIds = [];

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  const modalId = useId();
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const subtitleId = useId();

  onCloseRef.current = onClose;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (openModalIds.at(-1) !== modalId) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll(focusableSelector) ?? []
      );

      if (focusableElements.length === 0) {
        e.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!focusableElements.includes(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? lastElement : firstElement).focus();
      } else if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      openModalIds.push(modalId);

      if (openModalCount === 0) {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      openModalCount += 1;

      window.addEventListener('keydown', handleKeyDown);
      dialogRef.current?.focus();
    }

    return () => {
      if (!isOpen) return;

      const modalIndex = openModalIds.lastIndexOf(modalId);
      if (modalIndex !== -1) openModalIds.splice(modalIndex, 1);

      openModalCount -= 1;
      if (openModalCount === 0) document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, modalId]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={subtitle ? subtitleId : undefined}
        tabIndex={-1}
        className={`panel-card w-full ${maxWidth} max-h-[90vh] flex flex-col my-8 p-6 rounded-2xl border border-slate-700/80 shadow-2xl space-y-5 transform transition-all animate-scale-up`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 shrink-0">
          <div>
            <h3 id={titleId} className="text-lg font-bold text-white tracking-tight">{title}</h3>
            {subtitle && <p id={subtitleId} className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button 
            type="button"
            onClick={onClose} 
            aria-label="Đóng cửa sổ"
            title="Đóng (ESC)"
            className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95 transition focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
