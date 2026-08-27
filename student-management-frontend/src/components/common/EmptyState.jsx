import React from 'react';
import { FileSearch } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = FileSearch, 
  title = "Không có dữ liệu", 
  message = "Chưa có dữ liệu nào được tìm thấy hoặc danh sách đang trống.", 
  action 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6">{message}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
