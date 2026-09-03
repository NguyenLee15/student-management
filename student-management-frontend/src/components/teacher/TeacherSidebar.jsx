// cSpell:disable
import React from 'react';
import { Home, Calendar, Layers, FileSpreadsheet, User, ShieldCheck } from 'lucide-react';

export const TEACHER_NAV_ITEMS = [
  { id: 'overview', label: 'Bảng Điều Khiển Giảng Dạy', icon: Home },
  { id: 'schedule', label: 'Lịch Dạy Tuần Này', icon: Calendar },
  { id: 'classes', label: 'Lớp Học Phần Đứng Lớp', icon: Layers },
  { id: 'grades', label: 'Bảng Nhập Điểm Học Phần', icon: FileSpreadsheet },
  { id: 'profile', label: 'Hồ Sơ Giảng Viên', icon: User },
];

export default function TeacherSidebar({
  activeTab,
  setActiveTab,
  classesCount = 0,
  studentsCount = 0,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onRoleSwitch
}) {
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed md:static top-16 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800/80 p-4 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out shrink-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Nghiệp Vụ Giảng Dạy
          </div>
          {TEACHER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Stats & Mobile Admin Switch */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="text-[11px] font-bold text-slate-300">Tổng quan phụ trách</div>
            <div className="flex justify-between items-center mt-2 text-xs">
              <span className="text-slate-400">Lớp tín chỉ:</span>
              <span className="font-bold text-emerald-400 font-mono">{classesCount}</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-xs">
              <span className="text-slate-400">Sinh viên:</span>
              <span className="font-bold text-cyan-400 font-mono">{studentsCount}</span>
            </div>
          </div>

          {onRoleSwitch && (
            <button
              onClick={onRoleSwitch}
              className="sm:hidden w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chuyển về Quản trị</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
