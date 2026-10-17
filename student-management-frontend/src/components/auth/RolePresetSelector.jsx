// cSpell:disable
import React from 'react';
import { GraduationCap, UserSquare2, ShieldCheck, Building2, Sparkles, Check } from 'lucide-react';

export const ROLE_PRESETS = {
  student: {
    label: 'Sinh viên',
    roleName: 'ROLE_STUDENT',
    tagline: 'Học chế tín chỉ • Đăng ký học phần & Xem điểm',
    icon: GraduationCap,
    placeholder: 'Nhập mã số sinh viên (VD: SV001)',
    demoUser: 'student',
    demoPass: 'student123',
    demoName: 'Nguyễn Hữu Đạt (SV001)',
    codeBadge: 'SV001',
  },
  teacher: {
    label: 'Giảng viên',
    roleName: 'ROLE_TEACHER',
    tagline: 'Quản lý lớp tín chỉ • Nhập điểm & Lịch giảng dạy',
    icon: UserSquare2,
    placeholder: 'Nhập mã giảng viên (VD: GV001)',
    demoUser: 'teacher',
    demoPass: 'teacher123',
    demoName: 'TS. Nguyễn Văn An (GV001)',
    codeBadge: 'GV001',
  },
  faculty_admin: {
    label: 'Giáo vụ Khoa',
    roleName: 'ROLE_FACULTY_ADMIN',
    tagline: 'Quản trị hồ sơ & phân lớp theo phạm vi Khoa',
    icon: Building2,
    placeholder: 'Nhập tài khoản giáo vụ (VD: admin_cntt)',
    demoUser: 'admin_cntt',
    demoPass: 'admin123',
    demoName: 'Giáo vụ Khoa CNTT',
    codeBadge: 'CNTT',
  },
  admin: {
    label: 'Quản trị viên',
    roleName: 'ROLE_ADMIN',
    tagline: 'Quản trị hệ sinh thái đào tạo toàn trường',
    icon: ShieldCheck,
    placeholder: 'Nhập tài khoản quản trị (VD: admin)',
    demoUser: 'admin',
    demoPass: 'admin123',
    demoName: 'Ban Quản trị Đào tạo',
    codeBadge: 'Admin',
  },
};

export default function RolePresetSelector({ activeRole, onRoleSelect, onQuickLogin, disabled = false }) {
  return (
    <div className="pt-4 border-t border-slate-800/80 space-y-2">
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-medium text-slate-400 flex items-center gap-1.5">
          <span>Điền nhanh tài khoản mẫu:</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">Dành cho đánh giá / demo</span>
      </div>

      {/* Clean 4-Pill Segmented List */}
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Tài khoản mẫu">
        {Object.entries(ROLE_PRESETS).map(([key, item]) => {
          const isSelected = activeRole === key;
          const Icon = item.icon;

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onRoleSelect(key)}
              title={`Điền tài khoản ${item.label} (${item.demoUser})`}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-medium transition select-none ${
                isSelected
                  ? 'bg-blue-600/10 border-blue-500/50 text-blue-300 ring-1 ring-blue-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-700'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <span className={`text-[10px] font-mono px-1 py-0.2 rounded shrink-0 ${
                isSelected ? 'bg-blue-500/20 text-blue-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {item.codeBadge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
