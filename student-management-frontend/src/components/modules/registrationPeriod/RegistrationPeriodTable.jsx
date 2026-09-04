// cSpell:disable
import React from 'react';
import { Clock, Calendar, CheckCircle2, XCircle, Edit3, Trash2, Power } from 'lucide-react';
import EmptyState from '../../common/EmptyState';
import Skeleton from '../../common/Skeleton';

export default function RegistrationPeriodTable({
  periods = [],
  loading = false,
  isAdmin = false,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
  onToggleActive,
}) {
  if (loading) {
    return (
      <div className="panel-card p-5 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-slate-800/60 last:border-0">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <EmptyState
        title="Chưa có đợt đăng ký tín chỉ nào"
        description="Hiện chưa có đợt đăng ký học phần nào được cấu hình trong hệ thống."
        actionText={isAdmin ? "Tạo Đợt Đăng Ký Mới" : undefined}
        onAction={isAdmin ? onOpenCreate : undefined}
      />
    );
  }

  return (
    <div className="panel-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Tên Đợt Đăng Ký</th>
              <th className="px-5 py-3.5">Học Kỳ / Niên Khóa</th>
              <th className="px-5 py-3.5">Thời Gian Mở - Đóng</th>
              <th className="px-5 py-3.5 text-center">TC Tối Đa</th>
              <th className="px-5 py-3.5 text-center">Trạng Thái</th>
              <th className="px-5 py-3.5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {periods.map((p) => {
              const isOpen = p.isCurrentlyOpen;
              const isActive = p.active;

              return (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5 font-medium text-white">
                    <div className="font-bold text-slate-100">{p.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Mã đợt: #{p.id}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    <div>{p.semesterName || `Học kỳ ${p.semesterId}`}</div>
                    <div className="text-[10px] text-indigo-400 font-medium">
                      {p.academicYearName || p.semesterCode || '2026-2027'}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{p.startTime ? new Date(p.startTime).toLocaleString('vi-VN') : '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-400 mt-0.5">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{p.endTime ? new Date(p.endTime).toLocaleString('vi-VN') : '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center font-bold text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-indigo-400">
                      {p.maxCreditsAllowed || 24} TC
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {isOpen ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                          ĐANG MỞ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                          ĐÃ ĐÓNG
                        </span>
                      )}

                      {!isActive && (
                        <span className="text-[9px] text-rose-400 font-mono">(Vô hiệu hóa)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onToggleActive(p)}
                          title={isActive ? "Tắt kích hoạt" : "Bật kích hoạt"}
                          className={`p-1.5 rounded-lg transition ${
                            isActive 
                              ? 'text-emerald-400 hover:text-amber-400 hover:bg-slate-800' 
                              : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800'
                          }`}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenEdit(p)}
                          title="Sửa đợt đăng ký"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenDelete(p)}
                          title="Xóa đợt đăng ký"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
