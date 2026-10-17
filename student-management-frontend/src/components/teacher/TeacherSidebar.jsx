// cSpell:disable
import React from 'react';
import { Home, Calendar, Layers, FileSpreadsheet, User, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export const TEACHER_NAV_ITEMS = [
  { id: 'overview', label: 'Bảng Điều Khiển', fullLabel: 'Bảng Điều Khiển Giảng Dạy', icon: Home },
  { id: 'schedule', label: 'Thời Khóa Biểu', fullLabel: 'Lịch Dạy Tuần Này', icon: Calendar },
  { id: 'classes', label: 'Lớp Học Phần', fullLabel: 'Lớp Học Phần Đứng Lớp', icon: Layers, badgeKey: 'classes' },
  { id: 'grades', label: 'Nhập Điểm', fullLabel: 'Bảng Nhập Điểm Học Phần', icon: FileSpreadsheet },
  { id: 'profile', label: 'Hồ Sơ Giảng Viên', fullLabel: 'Hồ Sơ & Công Tác', icon: User },
];

export default function TeacherSidebar({
  activeTab,
  setActiveTab,
  classesCount = 0,
  studentsCount = 0,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isCollapsed = false,
  onToggleCollapse,
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
        role="navigation"
        aria-label="Thanh điều hướng Giảng viên"
        className={`
          fixed md:static top-16 bottom-0 left-0 bg-slate-900 border-r border-slate-800 p-3 flex flex-col justify-between z-40 transition-all duration-300 ease-in-out shrink-0 select-none
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          ${isMobileMenuOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="space-y-1" role="tablist" aria-label="Các tab nghiệp vụ giảng dạy">
          {!isCollapsed ? (
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Nghiệp Vụ Giảng Dạy
            </div>
          ) : (
            <div className="h-4" />
          )}

          {TEACHER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.fullLabel : undefined}
                className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all group ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>{item.label}</span>
                    {item.badgeKey === 'classes' && classesCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                        {classesCount}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Stats & Footer Collapse Controls */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          {!isCollapsed && (
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
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
          )}

          {onRoleSwitch && (
            <button
              onClick={onRoleSwitch}
              className={`sm:hidden w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chuyển về Quản trị</span>
            </button>
          )}

          {/* Desktop Footer Collapse Toggle */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={`hidden md:flex items-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs font-medium ${
                isCollapsed ? 'justify-center p-2.5 w-full' : 'gap-2 px-3 py-2 w-full justify-start'
              }`}
              title={isCollapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Thu gọn sidebar</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
