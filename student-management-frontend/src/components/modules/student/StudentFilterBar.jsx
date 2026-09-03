// cSpell:disable
import React from 'react';
import { Search, RefreshCw, X } from 'lucide-react';

export default function StudentFilterBar({
  keyword,
  setKeyword,
  selectedFaculty,
  setSelectedFaculty,
  selectedClass,
  setSelectedClass,
  selectedYear,
  setSelectedYear,
  selectedStatus,
  setSelectedStatus,
  faculties = [],
  classes = [],
  academicYears = [],
  onSearchSubmit,
  onClearFilters,
  onReload,
  loading = false,
}) {
  return (
    <div className="panel-card p-4 space-y-3">
      <div className="flex flex-col lg:flex-row items-center gap-3">
        <form onSubmit={onSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm theo họ tên hoặc mã sinh viên (VD: SV001)..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">Tất cả Khoa</option>
            {faculties.map((f) => (
              <option key={f.facultyId} value={f.facultyId}>
                {f.facultyName || f.facultyId}
              </option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">Tất cả Lớp</option>
            {classes.map((c) => (
              <option key={c.classId} value={c.classId}>
                {c.className || c.classId}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition font-mono"
          >
            <option value="">Tất cả Niên khóa</option>
            {academicYears.map((y) => (
              <option key={y.academicYearId} value={y.academicYearId}>
                {y.academicYearName || y.academicYearId}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">Tất cả Trạng thái</option>
            <option value="ACTIVE">Đang học bình thường</option>
            <option value="WARNING">⚠️ Cảnh báo học vụ (GPA &lt; 2.0)</option>
          </select>

          {(keyword || selectedFaculty || selectedClass || selectedYear || selectedStatus) && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-xs px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-slate-800 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Xóa lọc</span>
            </button>
          )}

          <button
            onClick={onReload}
            title="Tải lại dữ liệu"
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

