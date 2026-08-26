import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import DashboardModule from '../components/modules/DashboardModule';
import StudentModule from '../components/modules/StudentModule';
import TeacherModule from '../components/modules/TeacherModule';
import FacultyModule from '../components/modules/FacultyModule';
import AcademicYearModule from '../components/modules/AcademicYearModule';
import StudentClassModule from '../components/modules/StudentClassModule';
import SubjectModule from '../components/modules/SubjectModule';
import ClassroomModule from '../components/modules/ClassroomModule';
import CreditClassModule from '../components/modules/CreditClassModule';
import ScheduleModule from '../components/modules/ScheduleModule';
import GradeModule from '../components/modules/GradeModule';
import UserModule from '../components/modules/UserModule';
import AuditLogModule from '../components/modules/AuditLogModule';
import StudentPortalModule from '../components/modules/StudentPortalModule';
import TeacherPortalModule from '../components/modules/TeacherPortalModule';

export default function AdminLayout({
  currentUser,
  isBackendConnected,
  apiChecking,
  onRefreshHealth,
  onOpenLogin,
  onOpenCommand,
  onLogout,
  showToast,
  counts,
  facultiesList,
  onRoleSwitch
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 👑 ADMIN TOP BAR WITH ROLE SIMULATOR */}
      <div className="bg-gradient-to-r from-purple-900/60 via-indigo-950/80 to-purple-900/60 border-b border-purple-500/20 px-6 py-1.5 flex flex-wrap items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-purple-300 font-semibold">
          <span>👑 Hệ thống Quản Trị Trung Tâm (Admin Control Center)</span>
          <span className="hidden sm:inline text-purple-400/60">• Toàn quyền điều hành cơ sở dữ liệu & phân quyền</span>
        </div>

        {/* 🎭 ROLE SIMULATOR BAR */}
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-medium text-[11px]">👁️ Xem thử góc nhìn:</span>
          <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-purple-500/30">
            <button
              onClick={() => onRoleSwitch('ROLE_ADMIN')}
              className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-600 text-white shadow"
            >
              Admin
            </button>
            <button
              onClick={() => onRoleSwitch('ROLE_TEACHER')}
              className="px-2.5 py-0.5 rounded-md text-[11px] font-medium text-slate-400 hover:text-emerald-400 transition"
            >
              Giảng Viên
            </button>
            <button
              onClick={() => onRoleSwitch('ROLE_STUDENT')}
              className="px-2.5 py-0.5 rounded-md text-[11px] font-medium text-slate-400 hover:text-indigo-400 transition"
            >
              Sinh Viên
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 STANDARD ADMIN HEADER */}
      <Header
        isBackendConnected={isBackendConnected}
        apiChecking={apiChecking}
        onRefreshHealth={onRefreshHealth}
        currentUser={currentUser}
        onOpenLogin={onOpenLogin}
        onOpenCommand={onOpenCommand}
        onLogout={onLogout}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 🚀 MAIN ADMIN BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* 📱 ADMIN SIDEBAR */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
          counts={counts}
          currentUser={currentUser}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* 📊 MODULE ROUTER */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {activeTab === 'student-portal' && (
            <StudentPortalModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'teacher-portal' && (
            <TeacherPortalModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'overview' && (
            <DashboardModule
              stats={counts}
              faculties={facultiesList}
              onNavigate={(tab) => setActiveTab(tab)}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'students' && (
            <StudentModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'teachers' && (
            <TeacherModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'faculties' && (
            <FacultyModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'academic-years' && (
            <AcademicYearModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'student-classes' && (
            <StudentClassModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'subjects' && (
            <SubjectModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'classrooms' && (
            <ClassroomModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'credit-classes' && (
            <CreditClassModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'schedules' && (
            <ScheduleModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'grades' && (
            <GradeModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'users' && (
            <UserModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'audit-logs' && (
            <AuditLogModule onNotify={showToast} currentUser={currentUser} />
          )}
        </main>
      </div>
    </div>
  );
}
