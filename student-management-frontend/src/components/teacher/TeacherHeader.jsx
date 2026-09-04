// cSpell:disable
import React from 'react';
import { Menu, X, ShieldCheck, LogOut } from 'lucide-react';

export default function TeacherHeader({
  teacherInfo,
  currentTeacherId,
  onRoleSwitch,
  onLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between shrink-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg transition"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="h-10 w-10 rounded-xl bg-emerald-600 items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/30 hidden sm:flex">
          👨‍🏫
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white tracking-tight">CỔNG THÔNG TIN GIẢNG VIÊN</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CỔNG GIẢNG VIÊN
            </span>
          </div>
          <p className="hidden sm:block text-[11px] text-slate-400">Hệ thống Quản lý Giảng dạy & Chấm điểm EduPortal</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Teacher Identity Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white">{teacherInfo?.fullName || 'Giảng Viên'}</div>
            <div className="text-[10px] text-emerald-400 font-mono font-medium">Mã GV: {teacherInfo?.teacherId || currentTeacherId}</div>
          </div>
          <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            {teacherInfo?.fullName ? teacherInfo.fullName.charAt(0) : 'T'}
          </div>
        </div>

        {/* Role Switcher if Admin testing */}
        {onRoleSwitch && (
          <button
            onClick={onRoleSwitch}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
            title="Chuyển sang giao diện Quản trị"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Về Admin</span>
          </button>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          aria-label="Đăng xuất khỏi hệ thống"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
