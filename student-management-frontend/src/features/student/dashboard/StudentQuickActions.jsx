// cSpell:disable
import React from 'react';
import { BookOpen, Calendar, Award, CreditCard, ArrowRight, AlertCircle } from 'lucide-react';

export default function StudentQuickActions({ onNavigateTab }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-800 mb-4">Lối Tắt Học Vụ</h3>
        <div className="space-y-2.5">
          <button
            onClick={() => onNavigateTab?.('registration')}
            className="w-full p-3.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl font-bold text-sm text-left flex items-center justify-between border border-slate-200/60 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>Đăng ký môn học</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => onNavigateTab?.('timetable')}
            className="w-full p-3.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl font-bold text-sm text-left flex items-center justify-between border border-slate-200/60 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
              <span>Thời khóa biểu tuần</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => onNavigateTab?.('grades')}
            className="w-full p-3.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl font-bold text-sm text-left flex items-center justify-between border border-slate-200/60 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Award className="w-4 h-4" />
              </div>
              <span>Bảng điểm & In A4</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => onNavigateTab?.('tuition')}
            className="w-full p-3.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-xl font-bold text-sm text-left flex items-center justify-between border border-slate-200/60 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <CreditCard className="w-4 h-4" />
              </div>
              <span>Hóa đơn học phí</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          Hỗ trợ học vụ
        </p>
        <p className="text-blue-600">
          Phòng Đào tạo: phongdaotao@university.edu.vn | Hotline: 1900 6868
        </p>
      </div>
    </div>
  );
}

