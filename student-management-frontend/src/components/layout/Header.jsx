import React, { useState } from 'react';
import { GraduationCap, RefreshCw, LogIn, LogOut, ShieldCheck, UserCheck, FileText, Menu, X, Settings } from 'lucide-react';
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
  isMobileMenuOpen
}) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 py-3 flex items-center justify-between">
      {/* Brand & System Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          aria-label="Toggle Mobile Menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg transition"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 hidden sm:flex">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              EduPortal AI
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              Phiên bản 3.0
            </span>
          </div>
          <p className="hidden sm:block text-xs text-slate-400">Hệ thống Quản lý Đào tạo và Sinh viên</p>
        </div>
      </div>

      {/* Center Backend Status Badge */}
      <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs shadow-inner">
        <button 
          onClick={onRefreshHealth} 
          title="Kiểm tra kết nối"
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${apiChecking ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${isBackendConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="font-medium text-slate-300">
            {isBackendConnected ? 'Máy chủ API Đang hoạt động' : 'Máy chủ Offline / Chờ kết nối'}
          </span>
        </div>
      </div>

      {/* Action Buttons & Authentication */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenCommand}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 text-xs transition"
        >
          <span>Tìm kiếm...</span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 text-[10px] rounded border border-slate-700 font-mono text-slate-300">Ctrl+K</kbd>
        </button>

        <a 
          href="http://localhost:8080/swagger-ui/index.html" 
          target="_blank" 
          rel="noreferrer"
          className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3 py-2 rounded-xl border border-slate-700 transition"
        >
          <FileText className="h-4 w-4 text-indigo-400" />
          <span>Tài liệu API</span>
        </a>

        <div className="h-6 w-[1px] bg-slate-800 mx-1"></div>

        {currentUser ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 cursor-pointer border border-slate-800 hover:border-indigo-500/50 px-3 py-1.5 rounded-xl transition-all"
            >
              <div className="h-6 w-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                {currentUser.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="text-left hidden sm:block pr-2">
                <div className="text-xs font-semibold text-white leading-none">{currentUser.username}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{currentUser.role}</div>
              </div>
              <Settings className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
            </button>
            <button
              onClick={onLogout}
              title="Đăng xuất"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenLogin}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition active:scale-95"
          >
            <LogIn className="h-4 w-4" />
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
