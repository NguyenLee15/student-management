// cSpell:disable
import React from 'react';
import { GraduationCap, UserSquare2, ShieldCheck, Zap } from 'lucide-react';

export const ROLE_PRESETS = {
  student: {
    label: 'Sinh Viên',
    roleName: 'ROLE_STUDENT',
    tagline: 'Đăng ký tín chỉ • Xem điểm học phần & biểu học phí',
    icon: GraduationCap,
    placeholder: 'Mã sinh viên hoặc tên đăng nhập (student hoặc SV001)',
    demoUser: 'student',
    demoPass: 'student123',
    demoName: 'Nguyễn Hữu Đạt (SV001)',
    theme: {
      activeBg: 'bg-emerald-600',
      activeText: 'text-white',
      shadow: 'shadow-emerald-900/40',
      badge: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
      accentText: 'text-emerald-400',
      buttonBg: 'hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
  },
  teacher: {
    label: 'Giảng Viên',
    roleName: 'ROLE_TEACHER',
    tagline: 'Quản lý lớp tín chỉ • Nhập điểm thành phần & lịch dạy',
    icon: UserSquare2,
    placeholder: 'Mã giảng viên hoặc tên đăng nhập (teacher hoặc GV001)',
    demoUser: 'teacher',
    demoPass: 'teacher123',
    demoName: 'TS. Nguyễn Văn An (GV001)',
    theme: {
      activeBg: 'bg-sky-600',
      activeText: 'text-white',
      shadow: 'shadow-sky-900/40',
      badge: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
      accentText: 'text-sky-400',
      buttonBg: 'hover:bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
  },
  admin: {
    label: 'Quản Trị Viên',
    roleName: 'ROLE_ADMIN',
    tagline: 'Quản trị hệ thống • Quy chế đào tạo & danh mục học vụ',
    icon: ShieldCheck,
    placeholder: 'Tài khoản quản trị viên (admin)',
    demoUser: 'admin',
    demoPass: 'admin123',
    demoName: 'Ban Quản Trị Đào Tạo',
    theme: {
      activeBg: 'bg-indigo-600',
      activeText: 'text-white',
      shadow: 'shadow-indigo-900/40',
      badge: 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10',
      accentText: 'text-indigo-400',
      buttonBg: 'hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
  },
};

export default function RolePresetSelector({ activeRole, onRoleSelect, onQuickLogin, disabled = false }) {
  const currentPreset = ROLE_PRESETS[activeRole] || ROLE_PRESETS.student;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span id="login-role-label" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          Chọn vai trò đăng nhập
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          Tự động điền dữ liệu mẫu
        </span>
      </div>

      {/* 3-Column Role Tabs */}
      <div
        className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 border border-slate-800/90 rounded-2xl backdrop-blur-md"
        role="group"
        aria-labelledby="login-role-label"
      >
        {Object.entries(ROLE_PRESETS).map(([key, item]) => {
          const Icon = item.icon;
          const isSelected = activeRole === key;
          const theme = item.theme;

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              onClick={() => onRoleSelect(key)}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50 ${
                isSelected
                  ? `${theme.activeBg} ${theme.activeText} shadow-lg ${theme.shadow} scale-[1.02]`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Role Preset Banner with 1-Click Login Trigger */}
      <div
        className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs backdrop-blur-sm transition-all"
        aria-live="polite"
      >
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400">Tài khoản:</span>
            <code className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded border bg-slate-900 border-slate-700/80 text-white">
              {currentPreset.demoUser}
            </code>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-300 font-medium truncate">
              {currentPreset.demoName}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            {currentPreset.tagline}
          </p>
        </div>

        {onQuickLogin && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onQuickLogin(activeRole)}
            title="Đăng nhập ngay lập tức với tài khoản mẫu này"
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white text-[11px] font-semibold transition active:scale-95 disabled:opacity-50 shadow-sm shadow-indigo-950"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Đăng nhập 1-chạm</span>
          </button>
        )}
      </div>
    </div>
  );
}
