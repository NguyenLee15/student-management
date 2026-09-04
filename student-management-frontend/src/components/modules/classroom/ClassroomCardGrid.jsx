// cSpell:disable
import React from 'react';
import { DoorOpen, Users, Edit3, Trash2 } from 'lucide-react';
import { msg } from '../../../lib/messages';
import EmptyState from '../../common/EmptyState';

export default function ClassroomCardGrid({
  classrooms = [],
  loading = false,
  isAdmin = false,
  onOpenEdit,
  onOpenDelete,
  onOpenCreate,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="panel-card p-6 space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl bg-slate-800"></div>
              <div className="h-6 w-16 rounded-lg bg-slate-800"></div>
            </div>
            <div className="h-5 w-3/4 rounded-lg bg-slate-800"></div>
            <div className="h-4 w-1/2 rounded-lg bg-slate-800"></div>
            <div className="pt-3 border-t border-slate-800 flex justify-between">
              <div className="h-4 w-20 rounded bg-slate-800"></div>
              <div className="h-6 w-16 rounded bg-slate-800"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (classrooms.length === 0) {
    return (
      <EmptyState
        title="Chưa có phòng học nào"
        description="Hiện chưa có phòng học hoặc giảng đường nào khớp với bộ lọc tòa nhà. Hãy thêm phòng học mới để phân công lịch giảng dạy."
        actionText={isAdmin ? 'Thêm Phòng Học Mới' : undefined}
        onAction={isAdmin ? onOpenCreate : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {classrooms.map((c) => (
        <div
          key={c.roomId}
          className="panel-card p-6 space-y-4 hover:border-rose-500/40 transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-105 transition">
              <DoorOpen className="h-6 w-6" />
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-rose-300 rounded-lg">
              {c.roomId}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{c.roomName || c.roomId}</h3>
            <p className="text-xs text-slate-400 mt-1">{msg.enum.building[c.building] || 'Tòa A'}</p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="h-3.5 w-3.5 text-slate-500" />
              <span>{c.capacity || 60} chỗ</span>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenEdit(c)}
                  title="Chỉnh sửa"
                  className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500 transition"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onOpenDelete(c)}
                  title="Xóa phòng học"
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

