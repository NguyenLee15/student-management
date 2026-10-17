// cSpell:disable
import React from 'react';
import { Layers, Users, BookOpen, Clock, Award, ArrowRight, Calendar, AlertCircle } from 'lucide-react';

export default function TeacherOverviewTab({
  teacherInfo,
  currentTeacherId,
  classes = [],
  students = [],
  schedules = [],
  totalGradedCount = 0,
  gradeProgressPercent = 0,
  setActiveTab,
  handleSelectClassSafe
}) {
  const activeSemester = classes[0]?.semesterName || classes[0]?.semester || 'Học kỳ 1';
  const activeYear = classes[0]?.academicYearName || '2026 - 2027';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Welcome Executive Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeSemester} • Niên khóa {activeYear}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Xin chào Thầy/Cô, {teacherInfo?.fullName || 'Giảng Viên'}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mã giảng viên: <strong className="text-emerald-400 font-mono">{teacherInfo?.teacherId || currentTeacherId || 'GV-001'}</strong> • Bộ môn / Khoa: <strong className="text-slate-200">{teacherInfo?.facultyName || 'Khoa Công Nghệ Thông Tin'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('grades')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 flex items-center gap-2"
            >
              <span>Vào chấm điểm ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition active:scale-95"
            >
              Xem lịch dạy tuần này
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 4 High-Density Management Metrics (Clickable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Classes Card */}
        <button
          type="button"
          onClick={() => setActiveTab('classes')}
          className="panel-card p-5 text-left transition hover:border-slate-700 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lớp Đứng Lớp</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-3 font-mono">{classes.length}</div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Lớp học phần kỳ này</span>
            <span className="text-[11px] text-emerald-400 group-hover:translate-x-0.5 transition font-semibold">Xem DS &rarr;</span>
          </p>
        </button>

        {/* Current Class Students Card */}
        <button
          type="button"
          onClick={() => setActiveTab('grades')}
          className="panel-card p-5 text-left transition hover:border-slate-700 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sinh Viên Lớp Đang Chọn</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-3 font-mono">{students.length}</div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Sinh viên cần đánh giá</span>
            <span className="text-[11px] text-cyan-400 group-hover:translate-x-0.5 transition font-semibold">Bảng điểm &rarr;</span>
          </p>
        </button>

        {/* Grade Progress Card */}
        <div className="panel-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tiến Độ Nhập Điểm</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-bold text-white font-mono">{gradeProgressPercent}%</span>
            <span className="text-[11px] text-slate-400 font-mono">{totalGradedCount}/{students.length} SV</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${gradeProgressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {gradeProgressPercent === 100 ? 'Đã hoàn tất nhập điểm lớp này' : 'Chưa hoàn tất toàn bộ'}
          </p>
        </div>

        {/* Schedule Card */}
        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className="panel-card p-5 text-left transition hover:border-slate-700 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ca Giảng Dạy Tuần Này</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-3 font-mono">{schedules.length}</div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Ca đã xếp phòng</span>
            <span className="text-[11px] text-amber-400 group-hover:translate-x-0.5 transition font-semibold">Xem TKB &rarr;</span>
          </p>
        </button>
      </div>

      {/* 3. Operational Quick Roster & Regulation Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class List & Direct Grade Action (2 cols) */}
        <div className="panel-card p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              Lớp Học Phần Đang Giảng Dạy ({classes.length})
            </h3>
            <button
              onClick={() => setActiveTab('classes')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
            >
              Xem tất cả
            </button>
          </div>

          {classes.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 italic">
              Hiện Thầy/Cô chưa có lớp học phần nào được phân công trong học kỳ này.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {classes.slice(0, 6).map((c) => (
                <button
                  type="button"
                  key={c.creditClassId}
                  onClick={() => {
                    handleSelectClassSafe(c);
                    setActiveTab('grades');
                  }}
                  className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/40 text-left transition group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-emerald-400">
                        #{c.creditClassId}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {c.credits || 3} Tín chỉ
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1.5 line-clamp-1 group-hover:text-emerald-300 transition">
                      {c.subjectName || `Học phần #${c.creditClassId}`}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <span>Sĩ số: {c.enrolledCount ?? c.currentEnrollment ?? 0} SV</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                      Chấm điểm &rarr;
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Regulations & Academic Deadlines (1 col) */}
        <div className="panel-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            Quy Định & Hướng Dẫn Nghiệp Vụ
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">
                Tỷ lệ tính điểm học phần (TT 08/2021/TT-BGDĐT):
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Chuyên cần (10%) • Giữa kỳ (30%) • Cuối kỳ (60%). Thang điểm 10 quy đổi tự động sang thang 4 và điểm chữ.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-amber-400 block mb-1">
                Lưu ý chốt điểm cuối kỳ:
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Sau khi kết thúc đợt thi, Thầy/Cô vui lòng bấm "Lưu Tất Cả Điểm" và xuất biên bản CSV để lưu trữ hồ sơ giảng dạy.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-indigo-400 block mb-1">
                Điều hướng nhanh bàn phím:
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Khi nhập điểm, Thầy/Cô có thể sử dụng các phím mũi tên &uarr; &darr; &larr; &rarr; để di chuyển giữa các ô như Microsoft Excel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
