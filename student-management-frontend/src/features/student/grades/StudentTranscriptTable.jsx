// cSpell:disable
import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function StudentTranscriptTable({ grades = [], loading = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border border-slate-300">
        <thead className="bg-slate-100 uppercase font-bold text-slate-700 border-b border-slate-300">
          <tr>
            <th className="p-2.5 border-r border-slate-300 w-12 text-center">STT</th>
            <th className="p-2.5 border-r border-slate-300">Mã Học Phần</th>
            <th className="p-2.5 border-r border-slate-300">Tên Môn Học</th>
            <th className="p-2.5 border-r border-slate-300 text-center">Số TC</th>
            <th className="p-2.5 border-r border-slate-300 text-center">Điểm Hệ 10</th>
            <th className="p-2.5 border-r border-slate-300 text-center">Điểm Hệ 4</th>
            <th className="p-2.5 text-center">Điểm Chữ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {loading ? (
            <tr>
              <td colSpan="7" className="py-8 text-center text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-1 text-blue-600" />
                Đang tải dữ liệu điểm...
              </td>
            </tr>
          ) : grades.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-8 text-center text-slate-400">
                Chưa có dữ liệu điểm học phần.
              </td>
            </tr>
          ) : (
            grades.map((g, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="p-2 border-r border-slate-300 text-center font-medium text-slate-500">
                  {idx + 1}
                </td>
                <td className="p-2 border-r border-slate-300 font-mono font-bold">
                  {g.subjectId || g.subject?.subjectId || ''}
                </td>
                <td className="p-2 border-r border-slate-300 font-bold text-slate-800">
                  {g.subjectName || g.subject?.subjectName || 'Học phần'}
                </td>
                <td className="p-2 border-r border-slate-300 text-center font-semibold">
                  {g.credits || 3}
                </td>
                <td className="p-2 border-r border-slate-300 text-center font-mono font-bold text-slate-800">
                  {g.scoreScale10 != null ? Number(g.scoreScale10).toFixed(1) : '--'}
                </td>
                <td className="p-2 border-r border-slate-300 text-center font-mono font-bold text-slate-800">
                  {g.scoreScale4 != null ? Number(g.scoreScale4).toFixed(2) : '--'}
                </td>
                <td className="p-2 text-center font-bold">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      g.letterGrade === 'A'
                        ? 'bg-emerald-100 text-emerald-800'
                        : g.letterGrade?.startsWith('B')
                        ? 'bg-blue-100 text-blue-800'
                        : g.letterGrade?.startsWith('C')
                        ? 'bg-cyan-100 text-cyan-800'
                        : g.letterGrade?.startsWith('D')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {g.letterGrade || '--'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
