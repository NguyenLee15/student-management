// cSpell:disable
import React from 'react';
import { Search, Download, Save, Sparkles } from 'lucide-react';
import { getWeights, calculateFinalScore } from '../../utils/gradeCalculations';
import { exportGradeSheetCsv } from '../../utils/exportCsv';
import EmptyState from '../common/EmptyState';

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

          {/* 📊 THỐNG KÊ PHỔ ĐIỂM & TỶ LỆ ĐẠT */}
          {gradeStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-3 bg-slate-900/40 border-b border-slate-800 text-xs">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Đã chấm</div>
                <div className="text-sm font-black text-white">{gradeStats.totalGraded || 0}/{students.length}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Tỷ lệ đạt</div>
                <div className={`text-sm font-black ${(gradeStats.passRate || 0) >= 80 ? 'text-emerald-400' : (gradeStats.passRate || 0) >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {gradeStats.passRate || 0}%
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">ĐTB lớp</div>
                <div className="text-sm font-black text-cyan-400">{gradeStats.avgScore || '--'}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
                <div className="text-[10px] text-emerald-400 uppercase font-semibold">Điểm A</div>
                <div className="text-sm font-black text-emerald-400">{gradeStats.distribution?.A || 0}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
                <div className="text-[10px] text-indigo-400 uppercase font-semibold">Điểm B/B+</div>
                <div className="text-sm font-black text-indigo-400">
                  {(gradeStats.distribution?.B || 0) + (gradeStats.distribution?.BPlus || 0)}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
                <div className="text-[10px] text-cyan-400 uppercase font-semibold">Điểm C/C+</div>
                <div className="text-sm font-black text-cyan-400">
                  {(gradeStats.distribution?.C || 0) + (gradeStats.distribution?.CPlus || 0)}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
                <div className="text-[10px] text-amber-400 uppercase font-semibold">Điểm D/D+</div>
                <div className="text-sm font-black text-amber-400">
                  {(gradeStats.distribution?.D || 0) + (gradeStats.distribution?.DPlus || 0)}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
                <div className="text-[10px] text-rose-400 uppercase font-semibold">Điểm F</div>
                <div className="text-sm font-black text-rose-400">{gradeStats.distribution?.F || 0}</div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Mã SV</th>
                  <th className="px-5 py-3">Họ và Tên</th>
                  <th className="px-5 py-3 text-center">Chuyên cần ({Math.round(currentWeights.att * 100)}%)</th>
                  <th className="px-5 py-3 text-center">Giữa kỳ ({Math.round(currentWeights.mid * 100)}%)</th>
                  <th className="px-5 py-3 text-center">Thi cuối kỳ ({Math.round(currentWeights.fin * 100)}%)</th>
                  <th className="px-5 py-3 text-center font-bold">Tổng kết</th>
                  <th className="px-5 py-3 text-center font-bold">Điểm chữ</th>
                  <th className="px-5 py-3 text-center">Trạng thái</th>
                  <th className="px-5 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-5 py-8 text-center text-slate-400">
                      Đang tải bảng điểm...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-5 py-6 text-center text-xs text-slate-500 italic">
                      Không tìm thấy sinh viên nào phù hợp với từ khóa "{studentSearch}"
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st, idx) => {
                    const entry = gradeSheet[st.studentId] || {};
                    const calc = calculateFinalScore(entry, currentWeights);

                    return (
                      <tr key={st.studentId} className="hover:bg-slate-800/40 transition">
                        <td className="px-5 py-3 font-mono font-bold text-emerald-400">{st.studentId}</td>
                        <td className="px-5 py-3 font-semibold text-white truncate max-w-[180px] sm:max-w-[240px]" title={st.fullName}>{st.fullName}</td>
                        <td className="px-5 py-3 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            data-field="attendanceScore"
                            data-idx={idx}
                            value={entry.attendanceScore ?? ''}
                            onChange={(e) => handleGradeChange(st.studentId, 'attendanceScore', e.target.value)}
                            onBlur={() => handleGradeBlur(st.studentId, 'attendanceScore')}
                            onKeyDown={(e) => handleGradeKeyDown(e, idx, 'attendanceScore')}
                            placeholder="--"
                            className="w-16 px-2 py-1 text-center bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500 font-mono transition"
                          />
                        </td>
                        <td className="px-5 py-3 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            data-field="midtermScore"
                            data-idx={idx}
                            value={entry.midtermScore ?? ''}
                            onChange={(e) => handleGradeChange(st.studentId, 'midtermScore', e.target.value)}
                            onBlur={() => handleGradeBlur(st.studentId, 'midtermScore')}
                            onKeyDown={(e) => handleGradeKeyDown(e, idx, 'midtermScore')}
                            placeholder="--"
                            className="w-16 px-2 py-1 text-center bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500 font-mono transition"
                          />
                        </td>
                        <td className="px-5 py-3 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            data-field="finalExamScore"
                            data-idx={idx}
                            value={entry.finalExamScore ?? ''}
                            onChange={(e) => handleGradeChange(st.studentId, 'finalExamScore', e.target.value)}
                            onBlur={() => handleGradeBlur(st.studentId, 'finalExamScore')}
                            onKeyDown={(e) => handleGradeKeyDown(e, idx, 'finalExamScore')}
                            placeholder="--"
                            className="w-16 px-2 py-1 text-center bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500 font-mono transition"
                          />
                        </td>
                        <td className="px-5 py-3 text-center font-mono font-bold text-white text-sm">
                          {calc.scoreText}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              !calc.isComplete
                                ? 'bg-slate-800 text-slate-500'
                                : calc.letterGrade === 'A'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : calc.letterGrade.startsWith('B')
                                ? 'bg-indigo-500/10 text-indigo-400'
                                : calc.letterGrade.startsWith('C')
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : calc.letterGrade.startsWith('D')
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {calc.letterGrade}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          {entry.isSaved ? (
                            <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Đã lưu
                            </span>
                          ) : (
                            <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              Chưa lưu
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => handleSaveSingleGrade(st)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white text-[11px] font-semibold transition"
                            title="Lưu riêng điểm sinh viên này"
                          >
                            Lưu
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
