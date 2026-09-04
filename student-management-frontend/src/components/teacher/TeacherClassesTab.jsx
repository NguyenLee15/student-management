// cSpell:disable
import React from 'react';
import { Users, BookOpen, Search, Download, CheckCheck, AlertCircle } from 'lucide-react';
import { msg } from '../../lib/messages';
import { exportAttendanceCsv } from '../../utils/exportCsv';
import EmptyState from '../common/EmptyState';

export default function TeacherClassesTab({
  classes = [],
  selectedClass,
  handleSelectClassSafe,
  students = [],
  filteredStudents = [],
  gradeSheet = {},
  studentSearch = '',
  setStudentSearch,
  loading = false,
  teacherInfo,
  currentTeacherId,
  onNotify
}) {
  const onExport = () => {
    exportAttendanceCsv(selectedClass, teacherInfo, currentTeacherId, students, gradeSheet, onNotify);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-extrabold text-white">Lớp Học Phần Đứng Lớp</h2>
        <p className="text-xs text-slate-400 mt-0.5">Danh sách các lớp tín chỉ được phân công và danh sách sinh viên tham gia</p>
      </div>

      {classes.length === 0 ? (
        <EmptyState
          title="Chưa có lớp học phần"
          description="Thầy/Cô hiện chưa được phân công phụ trách lớp học phần nào trong học kỳ này."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class List Selector */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Chọn Lớp Học Phần ({classes.length})
            </h3>
            <div className="space-y-2">
              {classes.map((c) => {
                const isSelected = selectedClass?.creditClassId === c.creditClassId;
                return (
                  <div
                    key={c.creditClassId}
                    onClick={() => handleSelectClassSafe(c)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        #{c.creditClassId}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {c.credits || 3} Tín chỉ
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1.5 line-clamp-1">
                      {c.subjectName || `Học phần #${c.creditClassId}`}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-cyan-400" />
                        {c.enrolledCount ?? c.currentEnrollment ?? 0}/{c.maxStudents || 50} SV
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-indigo-400" />
                        {msg.enum.semester[c.semester] || c.semester || 'HK1'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="panel-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Danh Sách Sinh Viên: {selectedClass?.subjectName || `Lớp #${selectedClass?.creditClassId}`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tổng số: <span className="text-emerald-400 font-bold">{students.length}</span> sinh viên đã đăng ký học phần
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Tìm sinh viên..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 w-40 sm:w-48"
                  />
                </div>

                <button
                  onClick={onExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-300 transition"
                  title="Xuất danh sách điểm danh ra file CSV"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Xuất Điểm Danh (CSV)</span>
                </button>
              </div>
            </div>

            <div className="panel-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3">Mã SV</th>
                      <th className="px-5 py-3">Họ và Tên</th>
                      <th className="px-5 py-3">Giới tính</th>
                      <th className="px-5 py-3">Lớp Hành Chính</th>
                      <th className="px-5 py-3">Trạng thái điểm danh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-5 py-8 text-center text-slate-400">
                          Đang tải danh sách sinh viên...
                        </td>
                      </tr>
                    ) : filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-5 py-8 text-center text-slate-500 italic">
                          Không tìm thấy sinh viên nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => {
                        const entry = gradeSheet[st.studentId];
                        const attScore = entry?.attendanceScore !== '' && entry?.attendanceScore != null ? Number(entry.attendanceScore) : null;
                        const isWarning = attScore !== null && attScore < 5.0;

                        return (
                          <tr key={st.studentId} className="hover:bg-slate-800/40 transition">
                            <td className="px-5 py-3 font-mono font-bold text-emerald-400">{st.studentId}</td>
                            <td className="px-5 py-3 font-semibold text-white truncate max-w-[180px] sm:max-w-[240px]" title={st.fullName}>{st.fullName}</td>
                            <td className="px-5 py-3 text-slate-400 capitalize">{msg.enum.gender[st.gender] || st.gender || 'Nam'}</td>
                            <td className="px-5 py-3 text-slate-300">{st.className || st.classId || 'Chưa xếp lớp'}</td>
                            <td className="px-5 py-3">
                              {isWarning ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                  <AlertCircle className="h-3 w-3" /> Cảnh báo vắng nhiều (CC: {attScore})
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  <CheckCheck className="h-3 w-3" /> {attScore !== null ? `Đủ điều kiện (CC: ${attScore})` : 'Đủ điều kiện dự thi'}
                                </span>
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
          </div>
        </div>
      )}
    </div>
  );
}
