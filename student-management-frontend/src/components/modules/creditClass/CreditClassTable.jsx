// cSpell:disable
import React from 'react';
import { Users, Edit3, Trash2 } from 'lucide-react';
import { msg } from '../../../lib/messages';
import EmptyState from '../../common/EmptyState';
import Skeleton from '../../common/Skeleton';

export default function CreditClassTable({
  creditClasses = [],
  loading = false,
  isAdmin = false,
  onOpenStudents,
  onOpenEdit,
  onOpenDelete,
}) {
  return (
    <div className="panel-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Mã Lớp</th>
              <th className="px-5 py-3.5">Môn Học</th>
              <th className="px-5 py-3.5">Giảng Viên</th>
              <th className="px-5 py-3.5">Phòng / Học Kỳ</th>
              <th className="px-5 py-3.5 text-center">Sĩ Số</th>
              <th className="px-5 py-3.5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-5 py-4 text-center"><Skeleton className="h-4 w-16 mx-auto" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                </tr>
              ))
            ) : creditClasses.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-0">
                  <EmptyState title="Chưa có lớp tín chỉ" message="Chưa có lớp học phần nào được mở trong học kỳ này." />
                </td>
              </tr>
            ) : (
              creditClasses.map((c) => {
                const isFull = (c.enrolledCount || 0) >= (c.maxStudents || 60);

                return (
                  <tr key={c.creditClassId || c.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-400">
                      #{c.creditClassId || c.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white text-xs">{c.subjectName || c.subjectId}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {c.subjectId} • {c.credits || 3} Tín chỉ
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      <div className="font-medium text-white">{c.teacherName || 'Chưa phân công'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{c.teacherId || '—'}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      <div>{c.roomName || 'Chưa xếp phòng'}</div>
                      <div className="text-[10px] text-indigo-400 font-medium">
                        {msg.enum.semester[c.semester] || c.semester} • {c.academicYearName || c.academicYearId || '2026-2027'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        isFull ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {c.enrolledCount || 0} / {c.maxStudents || 60}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => onOpenStudents(c)}
                        title="Danh sách sinh viên trong lớp"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                      >
                        <Users className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onOpenEdit(c)}
                            title="Sửa lớp tín chỉ"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onOpenDelete(c)}
                            title="Xóa lớp tín chỉ"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
