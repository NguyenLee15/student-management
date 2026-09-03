// cSpell:disable
import React from 'react';
import { Award, GraduationCap, BookOpen, CreditCard } from 'lucide-react';

export default function StudentKpiGrid({ overview }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* GPA Thang 10 & 4 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">GPA Tích Lũy</span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="my-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-800">
            {overview?.cumulativeGpa10 || '0.0'}
          </span>
          <span className="text-xs font-bold text-slate-400">/ 10.0</span>
          <span className="ml-auto text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {overview?.cumulativeGpa4 || '0.00'} / 4.0
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Xếp loại:</span>
          <span className="font-bold text-emerald-600">{overview?.academicStanding || 'Chưa xét'}</span>
        </div>
      </div>

      {/* Tiến độ tín chỉ */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tiến Độ Tích Lũy</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-3xl font-black text-slate-800">
              {overview?.totalAccumulatedCredits || '0'}
            </span>
            <span className="text-xs font-bold text-slate-400">/ {overview?.requiredCredits || 0} TC</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
              style={{ width: `${overview?.progressPercentage || 0}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Hoàn thành:</span>
          <span className="font-bold text-indigo-600">{overview?.progressPercentage || 0}% chương trình</span>
        </div>
      </div>

      {/* Học kỳ này */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Học Phần Kỳ Này</span>
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        <div className="my-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-800">
            {overview?.registeredClassesThisSemester || '0'}
          </span>
          <span className="text-xs font-bold text-slate-400">lớp học phần</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Tổng tín chỉ ĐK:</span>
          <span className="font-bold text-purple-600">{overview?.registeredCreditsThisSemester || 0} tín chỉ</span>
        </div>
      </div>

      {/* Học phí công nợ */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Công Nợ Học Phí</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
        <div className="my-3">
          <div className="text-2xl font-black text-slate-800 truncate">
            {overview?.tuitionOutstandingBalance 
              ? Number(overview.tuitionOutstandingBalance).toLocaleString('vi-VN') + ' đ'
              : '0 đ'}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Trạng thái:</span>
          <span className={`font-bold ${overview?.tuitionOutstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {overview?.tuitionOutstandingBalance > 0 ? 'Cần thanh toán' : 'Đã hoàn tất'}
          </span>
        </div>
      </div>
    </div>
  );
}
