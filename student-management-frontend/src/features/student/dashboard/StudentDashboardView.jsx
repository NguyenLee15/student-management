import { msg } from '../../../lib/messages';
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Award, BookOpen, CreditCard, 
  Calendar, Clock, CheckCircle, ArrowRight, UserCheck, 
  TrendingUp, AlertCircle, RefreshCw 
} from 'lucide-react';
import { studentPortalApi } from '../../../api';

import Skeleton from '../../../components/common/Skeleton';

export default function StudentDashboardView({ onNavigateTab }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await studentPortalApi.getMyOverview();
      setOverview(res.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu tổng quan', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Banner Skeleton */}
        <Skeleton className="h-40 w-full rounded-2xl" />
        
        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>

        {/* Bottom Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
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

      {/* KPI Cards Grid */}
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

      {/* Today Schedule Timeline & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800">Lịch Học Tuần Này</h3>
            </div>
            <button
              onClick={() => onNavigateTab?.('timetable')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Xem ma trận TKB <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {(!overview?.todaySchedule || overview.todaySchedule.length === 0) ? (
              <div className="py-10 text-center text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                <p className="text-sm">Chưa có lịch học nào trong học kỳ này.</p>
              </div>
            ) : (
              overview.todaySchedule.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4 hover:border-blue-300 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-xs rounded">
                      {item.subjectId}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm">{item.subjectName}</h4>
                    <p className="text-xs text-slate-500">
                      GV: {item.teacherName || 'Chưa phân công'} • {item.credits} Tín chỉ
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800 text-xs">{item.roomName || 'Chưa xếp phòng'}</div>
                    <div className="text-xs text-slate-400">{item.studyTime || item.shiftName}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Shortcuts */}
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
      </div>
    </div>
  );
}
