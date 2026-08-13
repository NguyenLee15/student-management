import React from 'react';
import { 
  BarChart3, Users, UserSquare2, Building2, CalendarRange, 
  School, BookOpen, DoorOpen, Layers, CalendarDays, Award, 
  ShieldAlert, Sparkles, Database, GraduationCap
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, counts = {}, currentUser = null }) {
  const menuSections = [
    {
      title: 'Dedicated Portals (Mới)',
      items: [
        { id: 'student-portal', label: 'Cổng Sinh Viên (Portal)', icon: GraduationCap, badge: 'PORTAL', roles: ['ROLE_ADMIN', 'ROLE_STUDENT', 'ROLE_TEACHER'] },
        { id: 'teacher-portal', label: 'Cổng Giảng Viên (Portal)', icon: UserSquare2, badge: 'PORTAL', roles: ['ROLE_ADMIN', 'ROLE_TEACHER'] },
      ]
    },
    {
      title: 'Analytics & Overview',
      items: [
        { id: 'overview', label: 'Overview Analytics', icon: BarChart3, badge: null },
      ]
    },
    {
      title: 'People & Organization',
      items: [
        { id: 'students', label: 'Students Directory', icon: Users, badge: counts.students },
        { id: 'teachers', label: 'Lecturers / Teachers', icon: UserSquare2, badge: counts.teachers },
        { id: 'faculties', label: 'Academic Faculties', icon: Building2, badge: counts.faculties },
        { id: 'academic-years', label: 'Academic Years (Khóa)', icon: CalendarRange, badge: counts.academicYears },
        { id: 'student-classes', label: 'Student Classes (Lớp)', icon: School, badge: counts.classes },
      ]
    },
    {
      title: 'Curriculum & Facilities',
      items: [
        { id: 'subjects', label: 'Subjects & Modules', icon: BookOpen, badge: counts.subjects },
        { id: 'classrooms', label: 'Classrooms & Buildings', icon: DoorOpen, badge: counts.classrooms },
        { id: 'credit-classes', label: 'Credit Classes (Tín chỉ)', icon: Layers, badge: counts.creditClasses },
        { id: 'schedules', label: 'Timetable & Schedules', icon: CalendarDays, badge: counts.schedules },
      ]
    },
    {
      title: 'Grading & System',
      items: [
        { id: 'grades', label: 'Academic Grades & GPA', icon: Award, badge: counts.grades, roles: ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT'] },
        { id: 'users', label: 'Users & Roles (Admin)', icon: ShieldAlert, badge: counts.users, roles: ['ROLE_ADMIN'] },
        { id: 'audit-logs', label: 'Audit Logs & History', icon: Layers, badge: null, roles: ['ROLE_ADMIN'] },
      ]
    }
  ];

  // Helper function to check role
  const hasAccess = (itemRoles) => {
    if (!itemRoles) return true; // if no roles specified, everyone has access
    if (!currentUser) return false;
    return itemRoles.includes(currentUser.role);
  };

  // Filter sections
  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => hasAccess(item.roles))
  })).filter(section => section.items.length > 0);

  return (
    <aside className="w-72 bg-slate-900/60 border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto hidden md:flex shrink-0">
      <div className="space-y-6">
        {filteredSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== null && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 mt-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Spring Boot 3 + React 18</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Pure REST API Backend with JWT Security, JPA, and Vite SPA.
        </p>
      </div>
    </aside>
  );
}
