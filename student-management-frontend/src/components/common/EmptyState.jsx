import React from 'react';
import { FileSearch } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = FileSearch, 
  title = "Không có dữ liệu", 
  message,
  description,
  action,
  actionText,
  onAction 
}) {
  const displayMessage = description || message || "Chưa có dữ liệu nào được tìm thấy hoặc danh sách đang trống.";
  const actionButton = action || (actionText && onAction ? (
    <button
      type="button"
      onClick={onAction}
      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition active:scale-95"
    >
      {actionText}
    </button>
  ) : null);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6">{displayMessage}</p>
      {actionButton && (
        <div>{actionButton}</div>
      )}
    </div>
  );
}
