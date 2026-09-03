// cSpell:disable
import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

export default function RecentActivityFeed({
  recentLogs = [],
  onNavigate,
}) {
  return (
    <div className="lg:col-span-2 panel-card p-5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Nhật Ký Hoạt Động & Biến Động Gần Đây</h3>
        </div>
        <button 
          onClick={() => onNavigate('audit-logs')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5"
        >
          <span>Xem tất cả</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-800/60">
        {recentLogs.length > 0 ? (
          recentLogs.slice(0, 5).map((log, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {log.action || 'THAO TÁC'}
                </span>
                <div>
                  <p className="font-semibold text-slate-200">
                    {log.entityName || log.description || 'Thao tác hệ thống'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Thực hiện bởi: {log.performedBy || 'Hệ thống'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {log.timestamp
                  ? new Date(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                  : 'Vừa xong'}
              </span>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">
            Chưa có ghi nhận biến động mới trong phiên làm việc này.
          </div>
        )}
      </div>
    </div>
  );
}

