// cSpell:disable
import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import EmptyState from '../../common/EmptyState';
import Skeleton from '../../common/Skeleton';
import Pagination from '../../common/Pagination';

export default function TeacherTable({
  teachers = [],
  loading = false,
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
              <th className="px-5 py-3.5">Mã Giảng Viên</th>
              <th className="px-5 py-3.5">Họ và tên</th>
              <th className="px-5 py-3.5">Khoa / Viện Đào Tạo</th>
              <th className="px-5 py-3.5">Email Công Vụ</th>
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
                  <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-8" /></td>
                </tr>
              ))
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-0">
                  <EmptyState
                    title="Không tìm thấy giảng viên"
                    message="Không có giảng viên nào khớp với điều kiện tìm kiếm hiện tại."
                  />
                </td>
              </tr>
            ) : (
              teachers.map((t) => (
                <tr key={t.teacherId} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5 font-bold text-emerald-400 font-mono">{t.teacherId}</td>
                  <td className="px-5 py-3.5 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shadow-md">
                        {t.fullName?.charAt(0) || 'G'}
                      </div>
                      <span>{t.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
                      {t.facultyName || t.facultyId || 'Chưa phân khoa'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{t.email || '—'}</td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onEdit(t)}
                          title="Sửa Giảng Viên"
                          className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(t)}
                          title="Xóa Giảng viên"
                          className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500 transition"
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
