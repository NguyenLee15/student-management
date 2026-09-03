// cSpell:disable
import React from 'react';

export default function GradeStatsBar({ grades = [] }) {
  let totalGraded = 0;
  let totalPassed = 0;
  let sumScore = 0;
  const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };

  grades.forEach((g) => {
    const s10 = g.scoreScale10 != null ? Number(g.scoreScale10) : null;
    if (s10 !== null) {
      totalGraded++;
      sumScore += s10;
      if (s10 >= 4.0) totalPassed++;
      const l = g.letterGrade || '';
      if (l === 'A') dist.A++;
      else if (l.startsWith('B')) dist.B++;
      else if (l.startsWith('C')) dist.C++;
      else if (l.startsWith('D')) dist.D++;
      else if (l === 'F') dist.F++;
    }
  });

  const avg = totalGraded > 0 ? (sumScore / totalGraded).toFixed(2) : '--';
  const passRate = totalGraded > 0 ? Math.round((totalPassed / totalGraded) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
      <div className="p-2 rounded-lg bg-slate-950 text-center">
        <div className="text-[10px] text-slate-400 uppercase font-semibold">Đã có điểm</div>
        <div className="text-sm font-black text-white">{totalGraded}</div>
      </div>
      <div className="p-2 rounded-lg bg-slate-950 text-center">
        <div className="text-[10px] text-slate-400 uppercase font-semibold">Tỷ lệ đạt</div>
        <div className={`text-sm font-black ${passRate >= 80 ? 'text-emerald-400' : passRate >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
          {passRate}%
        </div>
      </div>
      <div className="p-2 rounded-lg bg-slate-950 text-center">
        <div className="text-[10px] text-slate-400 uppercase font-semibold">Điểm TB (Hệ 10)</div>
        <div className="text-sm font-black text-cyan-400">{avg}</div>
      </div>
      <div className="p-2 rounded-lg bg-slate-950 text-center">
        <div className="text-[10px] text-emerald-400 uppercase font-semibold">Điểm A</div>
        <div className="text-sm font-black text-emerald-400">{dist.A}</div>
      </div>
      <div className="p-2 rounded-lg bg-slate-950 text-center">
        <div className="text-[10px] text-indigo-400 uppercase font-semibold">Điểm B/B+</div>
        <div className="text-sm font-black text-indigo-400">{dist.B}</div>
      </div>
      <div className="p-2 rounded-lg bg-slate-950 text-center">
        <div className="text-[10px] text-cyan-400 uppercase font-semibold">Điểm C/C+</div>
        <div className="text-sm font-black text-cyan-400">{dist.C}</div>
      </div>
      <div className="p-2 rounded-lg bg-slate-950 text-center">
        <div className="text-[10px] text-rose-400 uppercase font-semibold">Điểm F (Học lại)</div>
        <div className="text-sm font-black text-rose-400">{dist.F}</div>
      </div>
    </div>
  );
}

