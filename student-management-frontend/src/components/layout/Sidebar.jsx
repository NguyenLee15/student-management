import React from 'react';
import { 
  BarChart3, Users, UserSquare2, Building2, CalendarRange, 
  School, BookOpen, DoorOpen, Layers, CalendarDays, Award, 
  ShieldAlert, Sparkles, FileText, ChevronRight, Activity
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, counts = {}, currentUser = null, isMobileMenuOpen = false }) {
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
      aria-label="Điều Hướng Chính"
      className={`w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/80 p-3.5 flex flex-col justify-between overflow-y-auto shrink-0 fixed inset-y-0 left-0 z-40 md:static md:flex transition-transform duration-200 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <nav className="space-y-5" aria-label="Sidebar Menu">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase" aria-hidden="true">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition group ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ml-1.5 shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer System Info */}
      <div className="pt-4 mt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
            <span className="text-[11px] font-semibold text-slate-300">EduPortal v3.5</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">TiDB Cloud</span>
        </div>
      </div>
    </aside>
  );
}