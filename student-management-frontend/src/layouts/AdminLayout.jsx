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
import RegistrationPeriodModule from '../components/modules/RegistrationPeriodModule';
import TuitionPolicyModule from '../components/modules/TuitionPolicyModule';
import { Home, ChevronRight } from 'lucide-react';

const TAB_TITLES = {
  'overview': { title: 'Bảng Điều Khiển & Phân Tích', group: 'Tổng Quan' },
  'faculties': { title: 'Quản Lý Khoa & Viện Đào Tạo', group: 'Quản Lý Đào Tạo' },
  'academic-years': { title: 'Niên Khóa & Khóa Học', group: 'Quản Lý Đào Tạo' },
  'student-classes': { title: 'Lớp Sinh Viên Hành Chính', group: 'Quản Lý Đào Tạo' },
  'subjects': { title: 'Môn Học & Chương Trình Đào Tạo', group: 'Quản Lý Đào Tạo' },
  'classrooms': { title: 'Phòng Học & Giảng Đường', group: 'Quản Lý Đào Tạo' },
  'registration-periods': { title: 'Đợt Đăng Ký Tín Chỉ & Thời Gian', group: 'Giảng Dạy & Học Tập' },
  'tuition-policies': { title: 'Chính Sách & Đơn Giá Học Phí', group: 'Giảng Dạy & Học Tập' },
  'credit-classes': { title: 'Lớp Tín Chỉ (Học Phần)', group: 'Giảng Dạy & Học Tập' },
  'schedules': { title: 'Thời Khóa Biểu & Lịch Học', group: 'Giảng Dạy & Học Tập' },
  'grades': { title: 'Quản Lý Điểm Số & GPA', group: 'Giảng Dạy & Học Tập' },
  'students': { title: 'Hồ Sơ & Danh Sách Sinh Viên', group: 'Hồ Sơ Nhân Sự' },
  'teachers': { title: 'Hồ Sơ & Danh Sách Giảng Viên', group: 'Hồ Sơ Nhân Sự' },
  'users': { title: 'Tài Khoản & Phân Quyền Hệ Thống', group: 'Hệ Thống & Bảo Mật' },
  'audit-logs': { title: 'Nhật Ký Hoạt Động', group: 'Hệ Thống & Bảo Mật' },
};

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

  const currentTabInfo = TAB_TITLES[activeTab] || { title: 'Quản Trị', group: 'Hệ Thống' };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* 🟢 TOP HEADER */}
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
        onRoleSwitch={onRoleSwitch}
      />

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 🚀 MAIN BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* 📱 SIDEBAR */}
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

        {/* 📊 WORKSPACE ROUTER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pb-1">
            <button 
              onClick={() => setActiveTab('overview')} 
              className="flex items-center gap-1 hover:text-indigo-400 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Quản trị</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-500">{currentTabInfo.group}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-semibold text-slate-200">{currentTabInfo.title}</span>
          </div>

          {activeTab === 'overview' && (
            <DashboardModule
              stats={counts}
              faculties={facultiesList}
              onNavigate={(tab) => setActiveTab(tab)}
              currentUser={currentUser}
              isBackendConnected={isBackendConnected}
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

          {activeTab === 'registration-periods' && (
            <RegistrationPeriodModule onNotify={showToast} currentUser={currentUser} />
          )}

          {activeTab === 'tuition-policies' && (
            <TuitionPolicyModule onNotify={showToast} currentUser={currentUser} />
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