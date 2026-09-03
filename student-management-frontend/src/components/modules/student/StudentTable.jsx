// cSpell:disable
import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, Award, Edit3, Trash2, Users } from 'lucide-react';
import { msg } from '../../../lib/messages';
import EmptyState from '../../common/EmptyState';
import Skeleton from '../../common/Skeleton';
import Pagination from '../../common/Pagination';

export default function StudentTable({
  students = [],
  selectedIds = new Set(),
  onSelectAll,
  onToggleSelect,
  sortField,
  sortOrder,
  onSort,
  loading = false,
  isAdmin = false,
  onOpenTranscript,
  onOpenEdit,
  onOpenDelete,
  onOpenBatchClass,
  onBatchDelete,
  page = 0,
  size = 10,
  totalPages = 1,
  totalElements = 0,
  onPageChange,
}) {
  return (
    <div className="panel-card overflow-hidden shadow-sm space-y-3">
      {/* Batch Action Bar if items selected */}
      {selectedIds.size > 0 && isAdmin && (
        <div className="mx-4 mt-4 p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-indigo-200">
            <span className="font-bold">{selectedIds.size}</span> sinh viên đã được chọn
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBatchClass}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Chuyển lớp</span>
            </button>
            <button
              onClick={onBatchDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa các mục đã chọn</span>
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto" aria-live="polite">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 select-none">
            <tr>
              <th className="px-4 py-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.size === students.length && students.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th 
                onClick={() => onSort('studentId')}
                className="px-5 py-3.5 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>Mã sinh viên</span>
                  {sortField === 'studentId' ? (sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-400" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />) : <ArrowUpDown className="w-3 h-3 text-slate-600" />}
                </div>
              </th>
              <th 
                onClick={() => onSort('fullName')}
                className="px-5 py-3.5 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>Họ và Tên & Giới tính</span>
                  {sortField === 'fullName' ? (sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-400" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />) : <ArrowUpDown className="w-3 h-3 text-slate-600" />}
                </div>
              </th>
              <th 
                onClick={() => onSort('className')}
                className="px-5 py-3.5 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>Lớp / Khoa</span>
                  {sortField === 'className' ? (sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-400" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />) : <ArrowUpDown className="w-3 h-3 text-slate-600" />}
                </div>
              </th>
              <th 
                onClick={() => onSort('academicYearId')}
                className="px-5 py-3.5 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>Niên khóa</span>
                  {sortField === 'academicYearId' ? (sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-400" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />) : <ArrowUpDown className="w-3 h-3 text-slate-600" />}
                </div>
              </th>
              <th className="px-5 py-3.5">Thông tin liên hệ</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><Skeleton className="h-4 w-4 mx-auto" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-0">
                  <EmptyState title="Không tìm thấy sinh viên" message="Không có sinh viên nào khớp với điều kiện tìm kiếm hiện tại." />
                </td>
              </tr>
            ) : (
              students.map((st) => (
                <tr key={st.studentId} className={`hover:bg-slate-800/40 transition ${selectedIds.has(st.studentId) ? 'bg-indigo-950/20' : ''}`}>
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(st.studentId)}
                      onChange={() => onToggleSelect(st.studentId)}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-3.5 font-bold text-indigo-400 font-mono">{st.studentId}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shadow-md">
                        {st.fullName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <div className="font-semibold text-white truncate max-w-[180px] sm:max-w-[260px]" title={st.fullName}>{st.fullName}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{msg.enum.gender[st.gender] || st.gender || 'Nam'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    <div>
                      <div className="font-medium text-slate-200 truncate max-w-[140px]" title={st.className || st.classId}>{st.className || st.classId || ''}</div>
                      <div className="text-[10px] text-slate-500">{st.facultyName || st.facultyId || 'Chưa phân khoa'}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono font-medium">
                    {st.academicYearId || st.academicYearName || 'K65'}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-slate-300 truncate max-w-[160px]" title={st.email}>{st.email || '—'}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{st.phoneNumber || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    <button
                      onClick={() => onOpenTranscript(st)}
                      title="Xem Bảng Điểm & GPA Chi Tiết"
                      className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500 transition"
                    >
                      <Award className="h-4 w-4" />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onOpenEdit(st)}
                          title="Sửa Sinh Viên"
                          className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onOpenDelete(st)}
                          title="Xóa Sinh viên"
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
