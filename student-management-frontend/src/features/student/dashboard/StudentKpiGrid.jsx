// cSpell:disable
import React from 'react';
import { Award, GraduationCap, BookOpen, CreditCard } from 'lucide-react';

export default function StudentKpiGrid({ overview }) {
  const gpa = Number(overview?.cumulativeGpa4 || 0);
  const isWarning = gpa > 0 && gpa < 2.0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* GPA Thang 10 & 4 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">GPA Tích Lũy</span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {overview?.cumulativeGpa10 || '0.0'}
          </span>
          <span className="text-xs text-slate-400 font-medium">/ 10.0</span>
          <span className="ml-auto text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-mono">
            {overview?.cumulativeGpa4 || '0.00'} / 4.0
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>Xếp loại học lực:</span>
          <span className={`font-bold ${isWarning ? 'text-rose-600' : 'text-emerald-700'}`}>
            {isWarning ? 'Cảnh báo học vụ' : (overview?.academicStanding || 'Bình thường')}
          </span>
        </div>
      </div>

      {/* Tiến độ tín chỉ */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tiến Độ Tích Lũy</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {overview?.totalAccumulatedCredits || '0'}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ {overview?.requiredCredits || 0} Tín chỉ</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(overview?.progressPercentage || 0, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>Tiến trình hoàn thành:</span>
          <span className="font-semibold text-slate-800">{overview?.progressPercentage || 0}%</span>
        </div>
      </div>

      {/* Học kỳ này */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lớp Đang Học</span>
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {overview?.registeredClassesThisSemester || '0'}
          </span>
          <span className="text-xs text-slate-400 font-medium">lớp học phần</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>Tổng tín chỉ kỳ này:</span>
          <span className="font-semibold text-slate-800">{overview?.registeredCreditsThisSemester || 0} TC</span>
        </div>
      </div>

      {/* Học phí công nợ */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Học Phí Học Kỳ</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3">
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono truncate">
            {overview?.tuitionOutstandingBalance 
              ? Number(overview.tuitionOutstandingBalance).toLocaleString('vi-VN') + ' đ'
              : '0 đ'}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>Tình trạng nộp:</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
            overview?.tuitionOutstandingBalance > 0 
              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {overview?.tuitionOutstandingBalance > 0 ? 'Còn phải nộp' : 'Đã hoàn tất'}
          </span>
        </div>
      </div>
    </div>
  );
}

