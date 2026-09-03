// cSpell:disable
import React from 'react';
import { BookOpen, GitBranch, Edit3, Trash2 } from 'lucide-react';
import { msg } from '../../../lib/messages';
import Skeleton from '../../common/Skeleton';
import EmptyState from '../../common/EmptyState';
import Pagination from '../../common/Pagination';

export default function SubjectTable({
  subjects = [],
  loading = false,
  isAdmin = false,
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
      <div className="overflow-x-auto" aria-live="polite">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Mã Môn</th>
              <th className="px-5 py-3.5">Tên Môn Học</th>
              <th className="px-5 py-3.5">Phân Loại & Khoa</th>
              <th className="px-5 py-3.5">Số Tín Chỉ</th>
              <th className="px-5 py-3.5">Tỷ Lệ Điểm</th>
              <th className="px-5 py-3.5">Môn Tiên Quyết</th>
              <th className="px-5 py-3.5">Học Phí / Tín</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-8" /></td>
                </tr>
              ))
            ) : subjects.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-0">
                  <EmptyState title="Không tìm thấy môn học" message="Không có môn học nào khớp với điều kiện tìm kiếm hiện tại." />
                </td>
              </tr>
            ) : (
              subjects.map((s) => (
                <tr key={s.subjectId} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5 font-bold text-cyan-400 font-mono">{s.subjectId}</td>
                  <td className="px-5 py-3.5 font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <span>{s.subjectName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-medium">
                      {msg.enum.subjectType[s.subjectType] || 'Chuyên ngành'}
                    </span>
                    <span className="ml-2 text-slate-400">({s.facultyName || s.facultyId})</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-400">{s.credits} TC</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-[11px] text-cyan-300 font-semibold whitespace-nowrap">
                      {Math.round((s.attendanceWeight ?? 0.10) * 100)}% - {Math.round((s.midtermWeight ?? 0.30) * 100)}% - {Math.round((s.finalExamWeight ?? 0.60) * 100)}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {s.prerequisiteSubjectId ? (
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <GitBranch className="h-3.5 w-3.5" />
                        <span className="font-mono">{s.prerequisiteSubjectId}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">Không</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-300">
                    {s.tuitionPerCredit ? `${Number(s.tuitionPerCredit).toLocaleString('vi-VN')} đ` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onOpenEdit(s)}
                          title="Sửa môn học"
                          className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 active:scale-95 transition"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onOpenDelete(s)}
                          title="Xóa môn học"
                          className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
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
