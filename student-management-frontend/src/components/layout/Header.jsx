import React, { useState } from 'react';
import { 
  GraduationCap, RefreshCw, LogOut, FileText, Menu, X, 
  Settings, Shield, UserSquare2, Sparkles, Command
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
  onRoleSwitch
}) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 py-2.5 flex items-center justify-between shadow-sm">
      {/* Left: Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          aria-label="Mở Menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                EduPortal
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-indigo-300 border border-slate-700 rounded">
                Quản Trị Đào Tạo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Active Academic Session & Global Scope */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
        <span className="text-slate-400">Niên khóa:</span>
        <span className="font-semibold text-slate-200">2026 - 2027 (Học kỳ 1)</span>
      </div>

      {/* Right: Server Status, Search, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Backend Status indicator */}
        <div 
          onClick={onRefreshHealth}
          title="Bấm để kiểm tra kết nối máy chủ"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 hover:border-slate-700 cursor-pointer transition select-none"
        >
          <span className={`h-2 w-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="hidden xl:inline text-slate-300 font-medium">
            {isBackendConnected ? 'API Sẵn sàng' : 'Đang kết nối...'}
          </span>
          <RefreshCw className={`h-3 w-3 text-slate-400 ${apiChecking ? 'animate-spin text-indigo-400' : ''}`} />
        </div>

        {/* Universal Search Command Button */}
        <button
          onClick={onOpenCommand}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 text-xs transition"
        >
          <Command className="w-3.5 h-3.5" />
          <span>Tìm kiếm...</span>
          <kbd className="px-1.5 py-0.2 bg-slate-800 text-[10px] rounded border border-slate-700 font-mono text-slate-300">Ctrl+K</kbd>
        </button>

        <div className="h-5 w-[1px] bg-slate-800 mx-0.5 hidden sm:block"></div>

        {/* User Profile with Enterprise Dropdown */}
        {currentUser ? (
          <div className="relative">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2.5 bg-slate-950/80 hover:bg-slate-800/80 cursor-pointer border border-slate-800 hover:border-indigo-500/40 px-2.5 py-1.5 rounded-xl transition"
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
              
              {/* Optional Role Switcher for Developer/Admin Sandbox */}
              {onRoleSwitch && (
                <div className="hidden xl:flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-[11px]">
                  <span className="text-slate-500 text-[10px] font-medium mr-0.5">Mô phỏng:</span>
                  <button
                    onClick={() => onRoleSwitch('ROLE_TEACHER')}
                    title="Chuyển sang xem thử Cổng Giảng Viên"
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition text-[11px]"
                  >
                    <UserSquare2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Giảng viên</span>
                  </button>
                  <button
                    onClick={() => onRoleSwitch('ROLE_STUDENT')}
                    title="Chuyển sang xem thử Cổng Sinh Viên"
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition text-[11px]"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    <span>Sinh viên</span>
                  </button>
                </div>
              )}

              <button
                onClick={onLogout}
                title="Đăng xuất"
                className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 active:scale-95 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button 
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