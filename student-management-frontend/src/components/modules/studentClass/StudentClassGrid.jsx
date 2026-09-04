// cSpell:disable
import React from 'react';
import { School, Edit3, Trash2 } from 'lucide-react';
import EmptyState from '../../common/EmptyState';

export default function StudentClassGrid({
  classes = [],
  loading = false,
  isAdmin = false,
  onOpenEdit,
  onOpenDelete,
  onOpenCreate,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="panel-card p-6 space-y-4 animate-pulse">
            <div className="h-10 w-10 bg-slate-800 rounded-xl"></div>
            <div className="h-5 w-3/4 bg-slate-800 rounded-lg"></div>
            <div className="h-4 w-1/2 bg-slate-800 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <EmptyState
        title="Chưa có lớp sinh viên nào"
        description="Hiện chưa có lớp hành chính nào khớp với bộ lọc. Hãy thêm lớp mới để bắt đầu."
        actionText={isAdmin ? 'Thêm Lớp Mới' : undefined}
        onAction={isAdmin ? onOpenCreate : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {classes.map((c) => (
        <div
          key={c.classId}
          className="panel-card p-6 space-y-4 hover:border-sky-500/40 transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-105 transition">
              <School className="h-6 w-6" />
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-sky-300 rounded-lg">
              {c.classId}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{c.className || c.classId}</h3>
            <p className="text-xs text-slate-400 mt-1">{c.facultyName || c.facultyId || 'Chưa phân khoa'}</p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Trạng thái: <span className="text-emerald-400">Đang hoạt động</span></span>
            {isAdmin && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenEdit(c)}
                  title="Chỉnh sửa"
                  className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-500 transition"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onOpenDelete(c)}
                  title="Xóa lớp học"
                  className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

