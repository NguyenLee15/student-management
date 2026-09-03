// cSpell:disable
import React from 'react';
import { Search, Download, Save, Sparkles } from 'lucide-react';
import { getWeights } from '../../utils/gradeCalculations';
import { exportGradeSheetCsv } from '../../utils/exportCsv';
import EmptyState from '../common/EmptyState';
import TeacherGradeStatsBar from './gradeSheet/TeacherGradeStatsBar';
import TeacherGradeTable from './gradeSheet/TeacherGradeTable';

export default function TeacherGradeSheetTab({
  classes = [],
  selectedClass,
  handleSelectClassSafe,
  students = [],
  filteredStudents = [],
  gradeSheet = {},
  gradeStats = {},
  studentSearch = '',
  setStudentSearch,
  saving = false,
  loading = false,
  handleGradeChange,
  handleGradeBlur,
  handleGradeKeyDown,
  handleQuickFillAttendance,
  handleSaveAllGrades,
  handleSaveSingleGrade,
  teacherInfo,
  currentTeacherId,
  onNotify
}) {
  const onExport = () => {
    exportGradeSheetCsv(selectedClass, teacherInfo, currentTeacherId, students, gradeSheet, onNotify);
  };

  const currentWeights = getWeights(selectedClass);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Class Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Bảng Nhập Điểm Học Phần</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Nhập điểm thành phần trực tiếp theo tỷ lệ chuẩn và lưu về phòng đào tạo
          </p>
        </div>

        {classes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Chọn lớp:</span>
            <select
              value={selectedClass?.creditClassId || ''}
              onChange={(e) => {
                const found = classes.find((c) => String(c.creditClassId) === e.target.value);
                if (found) handleSelectClassSafe(found);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white px-3 py-2 focus:outline-none focus:border-emerald-500 transition"
            >
              {classes.map((c) => (
                <option key={c.creditClassId} value={c.creditClassId}>
                  Lớp #{c.creditClassId} - {c.subjectName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {classes.length === 0 ? (
        <EmptyState
          title="Chưa có lớp học phần"
          description="Thầy/Cô hiện chưa được phân công phụ trách lớp tín chỉ nào để thực hiện nhập điểm."
        />
      ) : (
        <div className="panel-card overflow-hidden flex flex-col justify-between">
          {/* Action Toolbar */}
          <div className="p-5 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/60">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Bảng Nhập Điểm: {selectedClass?.subjectName || `Lớp #${selectedClass?.creditClassId}`}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {students.length} Sinh viên
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhập số thập phân (0-10). Dùng phím mũi tên Lên/Xuống hoặc Enter để chuyển nhanh ô điểm.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Lọc sinh viên..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 w-44 sm:w-52"
                />
              </div>

              <button
                onClick={handleQuickFillAttendance}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs font-semibold text-indigo-300 transition active:scale-95"
                title="Điền nhanh điểm chuyên cần 10 cho toàn bộ sinh viên chưa có điểm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Điền nhanh CC 10</span>
              </button>

              <button
                onClick={onExport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-300 transition active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>Xuất Bảng Điểm (CSV)</span>
              </button>

              <button
                onClick={handleSaveAllGrades}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition active:scale-95 self-start sm:self-auto disabled:opacity-50"
              >
                <Save className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
                <span>{saving ? 'Đang lưu CSDL...' : 'Lưu Toàn Bộ Điểm'}</span>
              </button>
            </div>
          </div>

          {/* Phổ điểm & Tỷ lệ đạt */}
          <TeacherGradeStatsBar
            gradeStats={gradeStats}
            totalStudents={students.length}
          />

          {/* Detailed Grade Sheet Table */}
          <TeacherGradeTable
            students={students}
            filteredStudents={filteredStudents}
            gradeSheet={gradeSheet}
            currentWeights={currentWeights}
            studentSearch={studentSearch}
            loading={loading}
            handleGradeChange={handleGradeChange}
            handleGradeBlur={handleGradeBlur}
            handleGradeKeyDown={handleGradeKeyDown}
            handleSaveSingleGrade={handleSaveSingleGrade}
          />
        </div>
      )}
    </div>
  );
}
