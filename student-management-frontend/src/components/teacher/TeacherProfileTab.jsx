// cSpell:disable
import React from 'react';
import { User, Mail, BookOpen, ShieldCheck } from 'lucide-react';

export default function TeacherProfileTab({ teacherInfo, currentTeacherId }) {
  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <h2 className="text-xl font-extrabold text-white">Hồ Sơ Giảng Viên</h2>
        <p className="text-xs text-slate-400 mt-0.5">Thông tin tài khoản công tác và quản lý hồ sơ đào tạo</p>
      </div>

      <div className="panel-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="h-24 w-24 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-600/30 shrink-0">
          {teacherInfo?.fullName ? teacherInfo.fullName.charAt(0) : 'T'}
        </div>

        <div className="space-y-4 flex-1 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-black text-white">{teacherInfo?.fullName || 'Giảng Viên'}</h3>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Mã GV: {teacherInfo?.teacherId || currentTeacherId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                {teacherInfo?.facultyName || 'Khoa Công Nghệ Thông Tin'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="h-4 w-4 text-slate-500" />
              <span>{teacherInfo?.email || 'giangvien@eduportal.edu.vn'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <BookOpen className="h-4 w-4 text-slate-500" />
              <span>Học phần chuyên trách: Lập trình, Cơ sở dữ liệu</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Quyền hạn: Giảng dạy, Điểm danh, Chấm điểm</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <User className="h-4 w-4 text-indigo-400" />
              <span>Trạng thái: Đang công tác chính thức</span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-card p-6 space-y-3">
        <h4 className="text-sm font-bold text-white">Hỗ trợ kỹ thuật đào tạo</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Trong trường hợp cần điều chỉnh lịch thi, mở lại cổng nhập điểm sau hạn hoặc thay đổi danh sách sinh viên lớp tín chỉ, kính mời Thầy/Cô liên hệ Phòng Đào tạo qua email{' '}
          <span className="text-emerald-400 font-semibold font-mono">daotao@eduportal.edu.vn</span> hoặc số điện thoại nội bộ <span className="text-emerald-400 font-semibold font-mono">(024) 3869-2345</span>.
        </p>
      </div>
    </div>
  );
}
