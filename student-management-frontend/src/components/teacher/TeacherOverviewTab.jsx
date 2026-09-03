// cSpell:disable
import React from 'react';
import { Layers, Users, BookOpen, Clock, Award, ArrowRight } from 'lucide-react';

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
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <span>Học kỳ 1 • Năm học 2026 - 2027</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Kính chào Thầy/Cô, {teacherInfo?.fullName || 'Giảng Viên'}!
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Chào mừng Thầy/Cô quay trở lại Cổng quản lý giảng dạy. Hiện Thầy/Cô đang phụ trách{' '}
            <span className="text-emerald-400 font-bold">{classes.length} lớp học phần</span> với{' '}
            <span className="text-cyan-400 font-bold">{students.length} sinh viên</span> trong danh sách lớp đang chọn.
          </p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Lớp Đứng Lớp</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{classes.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Lớp tín chỉ được phân công</p>
        </div>

        <div className="panel-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Sinh Viên Phụ Trách</span>
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{students.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Trong lớp tín chỉ hiện tại</p>
        </div>

        <div className="panel-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tiến Độ Nhập Điểm</span>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{gradeProgressPercent}%</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${gradeProgressPercent}%` }}
            />
          </div>
        </div>

        <div className="panel-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Lịch Dạy Trong Tuần</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{schedules.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Ca học đã lên thời khóa biểu</p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="panel-card p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            Lớp học phần gần đây
          </h3>
          {classes.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">Chưa có lớp học phần nào được phân công.</p>
          ) : (
            <div className="space-y-2">
              {classes.slice(0, 4).map((c) => (
                <div
                  key={c.creditClassId}
                  onClick={() => {
                    handleSelectClassSafe(c);
                    setActiveTab('grades');
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <div>
                    <div className="text-xs font-bold text-white">
                      {c.subjectName || `Học phần #${c.creditClassId}`}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Mã lớp: #{c.creditClassId} • {c.credits || 3} Tín chỉ
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-emerald-400">Nhập điểm</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel-card p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-amber-400" />
            Thông báo đào tạo & Quy chế
          </h3>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="font-bold text-emerald-400 block mb-1">
                Quy chuẩn thang điểm Thông tư 08/2021/TT-BGDĐT:
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Tỷ lệ điểm thành phần: Chuyên cần (10%), Giữa kỳ (30%), Thi cuối kỳ (60%). Điểm tổng kết đạt từ 4.0 trở lên tính là qua môn.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="font-bold text-amber-400 block mb-1">
                Hạn chót nhập điểm học kỳ 1:
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Kính đề nghị Thầy/Cô hoàn tất nhập điểm thành phần và gửi về phòng đào tạo trước ngày kết thúc đợt thi 07 ngày.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
