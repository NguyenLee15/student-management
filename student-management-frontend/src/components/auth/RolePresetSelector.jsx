// cSpell:disable
import React from 'react';
import { GraduationCap, UserSquare2, ShieldCheck } from 'lucide-react';

export const ROLE_PRESETS = {
  student: {
    label: 'Sinh Viên',
    icon: GraduationCap,
    placeholder: 'Mã sinh viên (VD: SV001 hoặc student)',
    demoUser: 'student',
    demoPass: 'student123',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  },
  teacher: {
    label: 'Giảng Viên',
    icon: UserSquare2,
    placeholder: 'Mã giảng viên hoặc tên đăng nhập (VD: teacher)',
    demoUser: 'teacher',
    demoPass: 'teacher123',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
  },
  admin: {
    label: 'Quản Trị Viên',
    icon: ShieldCheck,
    placeholder: 'Tài khoản quản trị viên (VD: admin)',
    demoUser: 'admin',
    demoPass: 'admin123',
    badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
  },
};

export default function RolePresetSelector({ activeRole, onRoleSelect }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
        Chọn Vai Trò Đăng Nhập
      </label>
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/90 border border-slate-800 rounded-xl">
        {Object.entries(ROLE_PRESETS).map(([key, item]) => {
          const Icon = item.icon;
          const isSelected = activeRole === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onRoleSelect(key)}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

