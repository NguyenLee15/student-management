// cSpell:disable
import React, { useState } from 'react';
import { 
  GraduationCap, RefreshCw, LogOut, Menu, X, 
  Settings, Command, PanelLeftClose, PanelLeft,
  Calendar, CheckCircle2
} from 'lucide-react';
import ProfileSettingsModal from '../profile/ProfileSettingsModal';

export default function Header({ 
  isBackendConnected, 
  apiChecking, 
  onRefreshHealth, 
  currentUser, 
  onOpenLogin, 
  onLogout,
  onOpenCommand,
  onToggleMobileMenu,
  isMobileMenuOpen,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse
}) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 py-2.5 flex items-center justify-between shadow-sm select-none">
      {/* Left: Brand, Desktop Sidebar Collapse & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onToggleMobileMenu}
          aria-label="Mở Menu Di Động"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        {onToggleSidebarCollapse && (
          <button
            type="button"
            onClick={onToggleSidebarCollapse}
            aria-label={isSidebarCollapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
            title={isSidebarCollapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
            className="hidden md:flex p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700/80 transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {isSidebarCollapsed ? <PanelLeft className="w-4 h-4 text-indigo-400" /> : <PanelLeftClose className="w-4 h-4 text-slate-400" />}
          </button>
        )}

        {/* Logo and Brand Title */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">
                EduPortal
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-indigo-300 border border-slate-700/80 rounded-md">
                Quản Trị Đào Tạo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Active Academic Session */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
        <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span className="text-slate-400">Niên khóa:</span>
        <span className="font-semibold text-slate-200">2026 - 2027</span>
        <span className="text-slate-600">•</span>
        <span className="font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/20">
          Học kỳ 1
        </span>
      </div>

      {/* Right: Server Status, Search, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Backend Status indicator */}
        <button
          type="button"
          onClick={onRefreshHealth}
          aria-label="Làm mới trạng thái kết nối máy chủ"
          title="Bấm để kiểm tra kết nối máy chủ"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 hover:border-slate-700 cursor-pointer transition select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span className={`h-2 w-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="hidden sm:inline text-slate-300 font-medium">
            {isBackendConnected ? 'Máy chủ: Hoạt động' : 'Đang kết nối...'}
          </span>
          <RefreshCw className={`h-3 w-3 text-slate-400 ${apiChecking ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        {/* Universal Search Command Button */}
        <button
          type="button"
          onClick={onOpenCommand}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 text-xs transition"
        >
          <Command className="w-3.5 h-3.5" />
          <span>Tìm kiếm...</span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 text-[10px] rounded border border-slate-700 font-mono text-slate-300">Ctrl+K</kbd>
        </button>

        <div className="h-5 w-[1px] bg-slate-800 mx-0.5 hidden sm:block"></div>

        {/* User Profile Controls */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              title="Cài đặt tài khoản"
              className="flex items-center gap-2.5 bg-slate-950/80 hover:bg-slate-800/80 cursor-pointer border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-xl transition"
            >
              <div className="h-6 w-6 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                {currentUser.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-white leading-tight">{currentUser.username}</div>
                <div className="text-[10px] text-emerald-400 font-mono">Quản trị viên</div>
              </div>
              <Settings className="h-3.5 w-3.5 text-slate-400 hover:text-white transition" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              title="Đăng xuất khỏi hệ thống"
              className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 active:scale-95 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button 
            type="button"
            onClick={onOpenLogin}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow transition"
          >
            <span>Đăng nhập</span>
          </button>
        )}
      </div>

      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </header>
  );
}
