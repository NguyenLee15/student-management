import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
  if (totalPages <= 1 && totalElements <= size) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
      <div>
        Showing <span className="font-semibold text-slate-200">{page * size + 1}</span> to{' '}
        <span className="font-semibold text-slate-200">{Math.min((page + 1) * size, totalElements || 0)}</span> of{' '}
        <span className="font-semibold text-slate-200">{totalElements || 0}</span> records
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let p = i;
            if (totalPages > 5) {
              if (page >= 3) {
                p = page - 2 + i;
                if (p >= totalPages) p = totalPages - 5 + i;
              }
            }
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`min-w-[32px] h-8 px-2 rounded-lg font-semibold transition ${
                  page === p
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {p + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
