// cSpell:disable
import React from 'react';

export default function TeacherGradeStatsBar({ gradeStats, totalStudents = 0 }) {
  if (!gradeStats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-3 bg-slate-900/40 border-b border-slate-800 text-xs">
      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
        <div className="text-[10px] text-slate-400 uppercase font-semibold">Đã chấm</div>
        <div className="text-sm font-black text-white">{gradeStats.totalGraded || 0}/{totalStudents}</div>
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
  );
}
