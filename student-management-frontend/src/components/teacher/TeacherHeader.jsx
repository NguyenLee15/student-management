// cSpell:disable
import React from 'react';
import { Menu, X, ShieldCheck, LogOut, PanelLeftClose, PanelLeft, Calendar, Wifi } from 'lucide-react';

export default function TeacherHeader({
  teacherInfo,
  currentTeacherId,
  onRoleSwitch,
  onLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 px-4 md:px-6 flex items-center justify-between shrink-0 z-40 select-none">
      {/* Left: Sidebar Toggle, Brand, Academic Context */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        {onToggleSidebarCollapse && (
          <button
            onClick={onToggleSidebarCollapse}
            className="hidden md:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title={isSidebarCollapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
            aria-label="Thu gọn/Mở rộng sidebar"
          >
            {isSidebarCollapsed ? <PanelLeft className="w-4 h-4 text-emerald-400" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}

        {/* Portal Brand Icon & Name */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shadow-sm">
            GV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight">Cổng Thông Tin Giảng Viên</span>
              <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Chính Quy
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400">
              Quản lý tiến độ giảng dạy, lịch học và điểm học phần
            </p>
          </div>
        </div>

        {/* Academic Session Context */}
        <div className="hidden xl:flex items-center gap-1.5 ml-4 px-3 py-1 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Niên khóa: <strong className="text-white font-medium">2026 - 2027</strong> • HK1</span>
        </div>
      </div>

      {/* Right: Server Status, Role Switch, User Profile, Logout */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Real-time Status Indicator */}
        <div 
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/60 border border-slate-800 rounded-lg text-xs"
          title="Kết nối máy chủ ổn định"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-slate-300">12ms</span>
        </div>

        {/* Role Switcher if Admin testing */}
        {onRoleSwitch && (
          <button
            onClick={onRoleSwitch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/60 transition"
            title="Chuyển sang giao diện Quản trị"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Về Admin</span>
          </button>
        )}

        {/* Teacher Identity Card */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white leading-tight">
              {teacherInfo?.fullName || 'Giảng Viên'}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              {teacherInfo?.teacherId || currentTeacherId || 'GV-001'}
            </div>
          </div>
          <div className="h-9 w-9 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center font-bold text-xs shadow-sm">
            {teacherInfo?.fullName ? teacherInfo.fullName.charAt(0) : 'G'}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          aria-label="Đăng xuất khỏi hệ thống"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
