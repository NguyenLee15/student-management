// cSpell:disable
import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function StudentWelcomeBanner({ overview, onNavigateTab }) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50/20 text-blue-100 border border-blue-400/30 text-xs font-bold rounded-full">
            {overview?.className || 'Chưa xếp lớp'} • {overview?.facultyName || 'Chưa phân khoa'}
          </span>
          <span className="text-blue-200 text-xs font-medium">
            Mã SV: <strong>{overview?.studentId || 'Chưa có'}</strong>
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          Xin chào, {overview?.fullName || 'Sinh viên'}! 👋
        </h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-xl">
          Chào mừng bạn đến với Cổng thông tin Đào tạo Đại học Thế hệ mới. Theo dõi tiến độ học tập, đăng ký tín chỉ và công nợ học phí theo thời gian thực.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigateTab?.('registration')}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
        >
          <BookOpen className="w-4 h-4" />
          <span>Đăng Ký Học Phần</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

