// cSpell:disable
import React from 'react';
import { calculateFinalScore } from '../../../utils/gradeCalculations';

export default function TeacherGradeTable({
  students = [],
  filteredStudents = [],
  gradeSheet = {},
  currentWeights = { att: 0.1, mid: 0.3, fin: 0.6 },
  studentSearch = '',
  loading = false,
  handleGradeChange,
  handleGradeBlur,
  handleGradeKeyDown,
  handleSaveSingleGrade,
}) {
  return (
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
                      aria-label={`Điểm chuyên cần của ${st.fullName}`}
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
                      aria-label={`Điểm giữa kỳ của ${st.fullName}`}
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
                      aria-label={`Điểm cuối kỳ của ${st.fullName}`}
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
  );
}

