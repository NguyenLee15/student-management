// cSpell:disable
import React from 'react';
import { 
  BarChart3, Users, UserSquare2, Building2, CalendarRange, 
  School, BookOpen, DoorOpen, Layers, CalendarDays, Award, 
  ShieldAlert, FileText, CalendarClock, Receipt
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  counts = {}, 
  currentUser = null, 
  isMobileMenuOpen = false,
  isCollapsed = false 
}) {
  const menuSections = [
    {
      title: 'TỔNG QUAN',
      items: [
        { id: 'overview', label: 'Bảng Điều Khiển', icon: BarChart3, badge: null },
      ]
    },
    {
      title: 'QUẢN LÝ ĐÀO TẠO',
      items: [
        { id: 'faculties', label: 'Khoa & Viện Đào Tạo', icon: Building2, badge: counts.faculties },
        { id: 'academic-years', label: 'Niên Khóa & Khóa Học', icon: CalendarRange, badge: counts.academicYears },
        { id: 'student-classes', label: 'Lớp Sinh Viên (HC)', icon: School, badge: counts.classes },
        { id: 'subjects', label: 'Môn Học & Chương Trình', icon: BookOpen, badge: counts.subjects },
        { id: 'classrooms', label: 'Phòng Học & Giảng Đường', icon: DoorOpen, badge: counts.classrooms },
      ]
    },
    {
      title: 'GIẢNG DẠY & HỌC TẬP',
      items: [
        { id: 'registration-periods', label: 'Đợt Đăng Ký Tín Chỉ', icon: CalendarClock, badge: null },
        { id: 'tuition-policies', label: 'Chính Sách Học Phí', icon: Receipt, badge: null },
        { id: 'credit-classes', label: 'Lớp Tín Chỉ (Học Phần)', icon: Layers, badge: counts.creditClasses },
        { id: 'schedules', label: 'Thời Khóa Biểu & Lịch Học', icon: CalendarDays, badge: counts.schedules },
        { id: 'grades', label: 'Quản Lý Điểm Số & GPA', icon: Award, badge: counts.grades },
      ]
    },
    {
      title: 'HỒ SƠ NHÂN SỰ',
      items: [
        { id: 'students', label: 'Hồ Sơ Sinh Viên', icon: Users, badge: counts.students },
        { id: 'teachers', label: 'Hồ Sơ Giảng Viên', icon: UserSquare2, badge: counts.teachers },
      ]
    },
    {
      title: 'HỆ THỐNG & BẢO MẬT',
      items: [
        { id: 'users', label: 'Tài Khoản & Phân Quyền', icon: ShieldAlert, badge: counts.users },
        { id: 'audit-logs', label: 'Nhật Ký Hoạt Động', icon: FileText, badge: null },
      ]
    }
  ];

  return (
    <aside 
      aria-label="Điều Hướng Phân Hệ Quản Trị"
      className={`bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between overflow-y-auto shrink-0 fixed inset-y-0 left-0 z-40 md:static md:h-full md:flex transition-all duration-300 select-none ${
        isCollapsed ? 'w-64 md:w-20 p-2.5' : 'w-64 p-3.5'
      } ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <nav className="space-y-4" aria-label="Sidebar Menu">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!isCollapsed ? (
              <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase truncate" aria-hidden="true">
                {section.title}
              </p>
            ) : (
              <div className="h-[1px] bg-slate-800/80 my-2 mx-1" aria-hidden="true" />
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const badgeCount = item.badge;
              const hasBadge = badgeCount !== undefined && badgeCount !== null && badgeCount > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  title={`${item.label}${hasBadge ? ` (${badgeCount})` : ''}`}
                  className={`w-full flex items-center rounded-xl text-xs font-medium transition-all group relative ${
                    isCollapsed 
                      ? 'justify-center p-2.5 min-h-[42px]' 
                      : 'justify-between px-3 py-2 min-h-[40px]'
                  } ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <div className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
                    <Icon className={`h-4 w-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'
                    }`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && hasBadge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ml-1.5 shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    }`}>
                      {badgeCount}
                    </span>
                  )}

                  {isCollapsed && hasBadge && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-400 border border-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer Info */}
      <div className="pt-3 mt-3 border-t border-slate-800/80">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-semibold text-slate-300">EduPortal v3.5 LTS</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Bản chuẩn</span>
          </div>
        ) : (
          <div className="flex justify-center p-2 rounded-xl bg-slate-950/70 border border-slate-800" title="EduPortal v3.5 LTS • Hệ Thống Sẵn Sàng">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          </div>
        )}
      </div>
    </aside>
  );
}
