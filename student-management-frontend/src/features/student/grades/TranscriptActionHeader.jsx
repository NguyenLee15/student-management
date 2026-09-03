// cSpell:disable
import React from 'react';
import { Award, Download, Printer } from 'lucide-react';

export default function TranscriptActionHeader({ onExportCSV, onPrint }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
      <div>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
          <Award className="w-6 h-6 text-blue-600" />
          Bảng Điểm Kết Quả Học Tập
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tra cứu kết quả học tập toàn khóa và in bảng điểm chuẩn A4
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onExportCSV}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Xuất Bảng Điểm (CSV)</span>
        </button>

        <button
          onClick={onPrint}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>In Bảng Điểm Chuẩn A4</span>
        </button>
      </div>
    </div>
  );
}

