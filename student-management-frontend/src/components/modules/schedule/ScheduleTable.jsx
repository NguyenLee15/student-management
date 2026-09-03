// cSpell:disable
import React from 'react';
import { Edit3, Trash2, User } from 'lucide-react';
import { msg } from '../../../lib/messages';
import Pagination from '../../common/Pagination';

export default function ScheduleTable({
  schedules = [],
  isAdmin = false,
  page = 0,
  size = 10,
  totalPages = 1,
  totalElements = 0,
  onPageChange,
  onEdit,
  onDelete,
}) {
  return (
    <div className="panel-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto" aria-live="polite">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Thứ Trong Tuần & Ca Học</th>
              <th className="px-5 py-3.5">Học Phần</th>
              <th className="px-5 py-3.5">Giảng Viên Phụ Trách</th>
              <th className="px-5 py-3.5">Phòng Học / Giảng Đường</th>
              <th className="px-5 py-3.5">Học kỳ</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {schedules.map((s) => (
              <tr key={s.scheduleId} className="hover:bg-slate-800/40 transition">
                <td className="px-5 py-3.5 font-bold text-teal-400">
                  <div>
                    <div>{msg.enum.weekday[s.dayOfWeek] || 'Không xác định'}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-normal mt-0.5">
                      {msg.enum.shift[s.classShift] || 'Ca 1'}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-white">
                    {s.subjectName || `Credit Class #${s.creditClassId}`}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Class ID: {s.creditClassId}</div>
                </td>
                <td className="px-5 py-3.5 text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{s.teacherName || s.teacherId || 'Chưa phân công'}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-300">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-300 font-mono font-semibold">
                    {s.roomName || s.roomId || 'Chưa xếp phòng'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-400">
                  {s.semester} ({s.academicYear || '2026-2027'})
                </td>
                <td className="px-5 py-3.5 text-right space-x-1">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEdit(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(s)}
                        className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={onPageChange}
      />
    </div>
  );
}
