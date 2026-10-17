// cSpell:disable
import React from 'react';
import { BookOpen, ArrowRight, UserCheck, School } from 'lucide-react';

export default function StudentWelcomeBanner({ overview, onNavigateTab }) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg">
            <School className="w-3.5 h-3.5" />
            <span>{overview?.className || 'Chưa xếp lớp'}</span>
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Khoa: <strong className="text-slate-700">{overview?.facultyName || 'Chưa phân khoa'}</strong>
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            <span>Đang học</span>
          </span>
        </div>

        <div className="pt-0.5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Xin chào, {overview?.fullName || 'Sinh viên'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Mã số sinh viên: <span className="font-mono font-semibold text-slate-700">{overview?.studentId || 'Chưa có'}</span> • Năm học: 2026-2027. Dưới đây là tổng hợp kết quả rèn luyện và tiến trình đào tạo của bạn.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
        <button
          onClick={() => onNavigateTab?.('registration')}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <BookOpen className="w-4 h-4" />
          <span>Đăng ký học phần</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

