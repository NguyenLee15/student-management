// cSpell:disable
import React from 'react';
import { GraduationCap, UserSquare2, ShieldCheck } from 'lucide-react';

export const ROLE_PRESETS = {
  student: {
    label: 'Sinh Viên',
    icon: GraduationCap,
    placeholder: 'Mã sinh viên hoặc tên đăng nhập (student hoặc SV001)',
    demoUser: 'student',
    demoPass: 'student123',
    demoName: 'Nguyễn Hữu Đạt (SV001)',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  },
  teacher: {
    label: 'Giảng Viên',
    icon: UserSquare2,
    placeholder: 'Mã giảng viên hoặc tên đăng nhập (teacher hoặc GV001)',
    demoUser: 'teacher',
    demoPass: 'teacher123',
    demoName: 'TS. Nguyễn Văn An (GV001)',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
  },
  admin: {
    label: 'Quản Trị Viên',
    icon: ShieldCheck,
    placeholder: 'Tài khoản quản trị viên (admin)',
    demoUser: 'admin',
    demoPass: 'admin123',
    demoName: 'Quản trị hệ thống đào tạo',
    badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
  },
};

export default function RolePresetSelector({ activeRole, onRoleSelect }) {
  const currentPreset = ROLE_PRESETS[activeRole] || ROLE_PRESETS.student;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span id="login-role-label" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Chọn Vai Trò Đăng Nhập
        </span>
        <span className="text-[10px] text-indigo-400 font-medium">
          Tự động điền tài khoản
        </span>
      </div>
      <div
        className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/90 border border-slate-800 rounded-xl"
        role="group"
        aria-labelledby="login-role-label"
      >
        {Object.entries(ROLE_PRESETS).map(([key, item]) => {
          const Icon = item.icon;
          const isSelected = activeRole === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onRoleSelect(key)}
              className={`min-h-[40px] flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hiển thị tài khoản & mật khẩu mẫu tương ứng */}
      <div className="mt-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300" aria-live="polite">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-slate-400 font-medium">Tài khoản mẫu:</span>
          <code className="text-indigo-400 font-mono font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
            {currentPreset.demoUser}
          </code>
          <span className="text-slate-500">•</span>
          <span className="text-[10px] text-slate-400 truncate">
            {currentPreset.demoName}
          </span>
        </div>
      </div>
    </div>
  );
}
