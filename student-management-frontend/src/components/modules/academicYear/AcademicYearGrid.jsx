// cSpell:disable
import React from 'react';
import { CalendarRange, Edit3, Trash2 } from 'lucide-react';
import EmptyState from '../../common/EmptyState';
import Skeleton from '../../common/Skeleton';

export default function AcademicYearGrid({
  years = [],
  loading = false,
  isAdmin = false,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="panel-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (years.length === 0) {
    return (
      <EmptyState
        title="Chưa có niên khóa nào"
        description="Hiện chưa có dữ liệu niên khóa đào tạo. Hãy thêm niên khóa mới để bắt đầu xếp lớp sinh viên."
        actionText={isAdmin ? "Thêm Niên Khóa Mới" : undefined}
        onAction={isAdmin ? onOpenCreate : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {years.map((y) => (
        <div
          key={y.academicYearId}
          className="panel-card p-5 relative overflow-hidden group hover:border-slate-700/80 transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 shrink-0">
                <CalendarRange className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {y.academicYearName}
                </h3>
                <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                  Mã niên khóa: {y.academicYearId}
                </span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onOpenEdit(y)}
                  title="Sửa niên khóa"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenDelete(y)}
                  title="Xóa niên khóa"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
