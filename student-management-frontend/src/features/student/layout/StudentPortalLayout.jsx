import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Calendar, Award, 
  CreditCard, LogOut, User, Bell, GraduationCap, 
  ChevronRight, Menu, X, Shield 
} from 'lucide-react';
import StudentDashboardView from '../dashboard/StudentDashboardView';
import CourseRegistrationView from '../registration/CourseRegistrationView';
import MatrixTimetableView from '../timetable/MatrixTimetableView';
import StudentTranscriptView from '../grades/StudentTranscriptView';
import TuitionLedgerView from '../tuition/TuitionLedgerView';
import ProfileSettingsModal from '../../../components/profile/ProfileSettingsModal';
import { useStudentPortal } from '../hooks/useStudentPortal';

export default function StudentPortalLayout({ user, onLogout, onNotify, onSwitchToAdmin }) {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    profile,
    studentDisplayName,
    studentDisplayId,
  } = useStudentPortal({ user, onNotify });

  const navItems = [
    { id: 'dashboard', label: 'Bảng Tổng Quan', icon: LayoutDashboard },
    { id: 'registration', label: 'Đăng Ký Học Phần', icon: BookOpen, badge: 'Đang mở' },
    { id: 'timetable', label: 'Thời Khóa Biểu', icon: Calendar },
    { id: 'grades', label: 'Bảng Điểm Học Tập', icon: Award },
    { id: 'tuition', label: 'Sổ Cái Học Phí', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Mở menu điều hướng"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-transparent">
                  EduPortal
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded-full border border-blue-400/30">
                  Cổng Sinh Viên
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Switch to Admin if user has Admin role */}
            {(user?.role === 'ROLE_ADMIN' || user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN') || onSwitchToAdmin) && (
              <button
                onClick={onSwitchToAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                title="Quay lại giao diện Admin"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>👑 Trở Về Admin</span>
              </button>
            )}

            <div className="flex items-center gap-1 pl-3 border-l border-slate-800">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-800 transition-colors text-left"
                title="Xem thông tin tài khoản & Đổi mật khẩu"
                aria-label="Xem thông tin tài khoản và đổi mật khẩu"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow">
                  {studentDisplayName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-white truncate max-w-[140px]" title={studentDisplayName}>
                    {studentDisplayName}
                  </div>
                  <div className="text-[10px] text-blue-400 font-mono">
                    Mã SV: {studentDisplayId}
                  </div>
                </div>
              </button>
              <button
                onClick={onLogout}
                aria-label="Đăng xuất khỏi hệ thống"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-4 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:bg-transparent md:border-0 md:p-0 shrink-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="md:sticky md:top-24 space-y-1" role="tablist" aria-label="Menu chức năng Cổng Sinh Viên">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={item.label}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-black rounded-md ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* View Content Area */}
        <main className="flex-1 min-w-0" role="tabpanel" id="student-tabpanel" aria-labelledby={activeTab}>
          {activeTab === 'dashboard' && (
            <StudentDashboardView onNotify={onNotify} onNavigateTab={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'registration' && <CourseRegistrationView onNotify={onNotify} />}
          {activeTab === 'timetable' && <MatrixTimetableView onNotify={onNotify} />}
          {activeTab === 'grades' && <StudentTranscriptView onNotify={onNotify} currentUser={user} />}
          {activeTab === 'tuition' && <TuitionLedgerView onNotify={onNotify} onNavigateTab={(tab) => setActiveTab(tab)} />}
        </main>
      </div>

      {/* Profile & Change Password Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}