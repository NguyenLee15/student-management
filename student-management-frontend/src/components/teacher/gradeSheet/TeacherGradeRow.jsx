// cSpell:disable
import React, { memo } from 'react';

/**
 * TeacherGradeRow.jsx
 * Dòng bảng điểm cho từng sinh viên - Memoized để triệt tiêu re-render toàn bộ bảng khi gõ phím
 */
const TeacherGradeRow = memo(function TeacherGradeRow({
  st,
  idx,
  entry = {},
  calc,
  handleGradeChange,
  handleGradeBlur,
  handleGradeKeyDown,
  handleSaveSingleGrade,
}) {
  return (
    <tr className="hover:bg-slate-800/40 transition">
      <td className="px-5 py-3 font-mono font-bold text-emerald-400">{st.studentId}</td>
      <td className="px-5 py-3 font-semibold text-white truncate max-w-[180px] sm:max-w-[240px]" title={st.fullName}>
        {st.fullName}
      </td>
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
});

export default TeacherGradeRow;

