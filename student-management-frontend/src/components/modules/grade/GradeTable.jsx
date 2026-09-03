// cSpell:disable
import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { msg } from '../../../lib/messages';
import Skeleton from '../../common/Skeleton';
import EmptyState from '../../common/EmptyState';
import Pagination from '../../common/Pagination';

export default function GradeTable({
  grades = [],
  loading = false,
  canManage = false,
  onOpenEdit,
  onOpenDelete,
  page = 0,
  size = 10,
  totalPages = 1,
  totalElements = 0,
  onPageChange,
}) {
  return (
    <div className="panel-card overflow-hidden shadow-sm space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Sinh Viên</th>
              <th className="px-5 py-3.5">Môn Học</th>
              <th className="px-3 py-3.5 text-center">Chuyên Cần</th>
              <th className="px-3 py-3.5 text-center">Giữa Kỳ</th>
              <th className="px-3 py-3.5 text-center">Cuối Kỳ</th>
              <th className="px-3 py-3.5 text-center font-bold">Tổng Kết</th>
              <th className="px-3 py-3.5 text-center">Hệ 4</th>
              <th className="px-3 py-3.5 text-center">Điểm Chữ</th>
              <th className="px-5 py-3.5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-36" /></td>
                  <td className="px-3 py-4 text-center"><Skeleton className="h-4 w-10 mx-auto" /></td>
                  <td className="px-3 py-4 text-center"><Skeleton className="h-4 w-10 mx-auto" /></td>
                  <td className="px-3 py-4 text-center"><Skeleton className="h-4 w-10 mx-auto" /></td>
                  <td className="px-3 py-4 text-center"><Skeleton className="h-4 w-10 mx-auto" /></td>
                  <td className="px-3 py-4 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                  <td className="px-3 py-4 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                  <td className="px-5 py-4 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                </tr>
              ))
            ) : grades.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-0">
                  <EmptyState title="Chưa có dữ liệu điểm" message="Không có bản ghi điểm nào phù hợp với bộ lọc." />
                </td>
              </tr>
            ) : (
              grades.map((g) => {
                const s10 = g.scoreScale10 != null ? Number(g.scoreScale10).toFixed(1) : '--';
                const s4 = g.scoreScale4 != null ? Number(g.scoreScale4).toFixed(2) : '--';

                return (
                  <tr key={g.gradeId || `${g.studentId}-${g.subjectId}`} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{g.studentName || g.studentId}</div>
                      <div className="text-[10px] text-indigo-400 font-mono">Mã SV: {g.studentId}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-200">{g.subjectName || g.subjectId}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {msg.enum.semester[g.semester] || g.semester} • {g.academicYear || '2026-2027'}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono text-slate-300">
                      {g.attendanceScore != null ? Number(g.attendanceScore).toFixed(1) : '--'}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono text-slate-300">
                      {g.midtermScore != null ? Number(g.midtermScore).toFixed(1) : '--'}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono text-slate-300">
                      {g.finalExamScore != null ? Number(g.finalExamScore).toFixed(1) : '--'}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono font-bold text-white text-sm">
                      {s10}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono font-medium text-cyan-400">
                      {s4}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        g.letterGrade === 'A' ? 'bg-emerald-500/10 text-emerald-400' :
                        g.letterGrade?.startsWith('B') ? 'bg-indigo-500/10 text-indigo-400' :
                        g.letterGrade?.startsWith('C') ? 'bg-cyan-500/10 text-cyan-400' :
                        g.letterGrade?.startsWith('D') ? 'bg-amber-500/10 text-amber-400' :
                        'bg-rose-500/10 text-rose-400'
                      }`}>
                        {g.letterGrade || '--'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      {canManage && (
                        <>
                          <button
                            onClick={() => onOpenEdit(g)}
                            title="Sửa điểm"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onOpenDelete(g)}
                            title="Xóa điểm"
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

      {/* Pagination Bar */}
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

