// cSpell:disable
import React, { useState, useEffect } from 'react';
import { useTeacherPortal } from '../hooks/useTeacherPortal';
import {
  TeacherHeader,
  TeacherSidebar,
  TeacherOverviewTab,
  TeacherScheduleTab,
  TeacherClassesTab,
  TeacherGradeSheetTab,
  TeacherProfileTab,
} from '../components/teacher';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { Home, ChevronRight } from 'lucide-react';

const TEACHER_TAB_TITLES = {
  'overview': { title: 'Bảng Điều Khiển Giảng Dạy', group: 'Tổng Quan' },
  'schedule': { title: 'Thời Khóa Biểu Tuần', group: 'Lịch Đào Tạo' },
  'classes': { title: 'Lớp Học Phần Đứng Lớp', group: 'Giảng Dạy' },
  'grades': { title: 'Bảng Nhập Điểm Học Phần', group: 'Đánh Giá & Điểm' },
  'profile': { title: 'Hồ Sơ & Công Tác', group: 'Tài Khoản' },
};

export default function TeacherLayout({ currentUser, onLogout, onNotify, onRoleSwitch }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('teacher_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('teacher_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const {
    activeTab,
    setActiveTab,
    currentTeacherId,
    teacherInfo,
    classes,
    selectedClass,
    students,
    filteredStudents,
    schedules,
    gradeSheet,
    studentSearch,
    setStudentSearch,
    loading,
    saving,
    savingStudentId,
    totalGradedCount,
    gradeProgressPercent,
    gradeStats,
    hasUnsavedGrades,
    handleSelectClassSafe,
    pendingClassSwitch,
    confirmClassSwitch,
    cancelClassSwitch,
    handleGradeChange,
    handleGradeBlur,
    handleGradeKeyDown,
    handleQuickFillAttendance,
    handleSaveAllGrades,
    handleSaveSingleGrade,
  } = useTeacherPortal({ currentUser, onNotify });

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedGrades) {
        e.preventDefault();
        e.returnValue = 'Thầy/Cô có điểm chưa lưu. Rời khỏi trang lúc này sẽ làm mất dữ liệu chưa lưu.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedGrades]);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white overflow-hidden">
      {/* 🟢 TOPBAR */}
      <TeacherHeader
        teacherInfo={teacherInfo}
        currentTeacherId={currentTeacherId}
        onRoleSwitch={onRoleSwitch}
        onLogout={onLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebarCollapse={toggleSidebarCollapse}
      />

      {/* 🟢 MAIN BODY LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* 🟢 SIDEBAR */}
        <TeacherSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          classesCount={classes.length}
          studentsCount={students.length}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
          onRoleSwitch={onRoleSwitch}
        />

        {/* 🟢 TAB CONTENT WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb Bar */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pb-1">
              <button 
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-1 hover:text-emerald-400 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Cổng giảng viên</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-500">{TEACHER_TAB_TITLES[activeTab]?.group || 'Nghiệp vụ'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-semibold text-slate-200">{TEACHER_TAB_TITLES[activeTab]?.title || 'Tổng quan'}</span>
            </div>

            {activeTab === 'overview' && (
              <TeacherOverviewTab
                teacherInfo={teacherInfo}
                currentTeacherId={currentTeacherId}
                classes={classes}
                students={students}
                schedules={schedules}
                totalGradedCount={totalGradedCount}
                gradeProgressPercent={gradeProgressPercent}
                setActiveTab={setActiveTab}
                handleSelectClassSafe={handleSelectClassSafe}
              />
            )}

            {activeTab === 'schedule' && (
              <TeacherScheduleTab
                schedules={schedules}
                classes={classes}
                loading={loading}
              />
            )}

            {activeTab === 'classes' && (
              <TeacherClassesTab
                classes={classes}
                selectedClass={selectedClass}
                handleSelectClassSafe={handleSelectClassSafe}
                students={students}
                filteredStudents={filteredStudents}
                gradeSheet={gradeSheet}
                studentSearch={studentSearch}
                setStudentSearch={setStudentSearch}
                loading={loading}
                teacherInfo={teacherInfo}
                currentTeacherId={currentTeacherId}
                onNotify={onNotify}
              />
            )}

            {activeTab === 'grades' && (
              <TeacherGradeSheetTab
                classes={classes}
                selectedClass={selectedClass}
                handleSelectClassSafe={handleSelectClassSafe}
                students={students}
                filteredStudents={filteredStudents}
                gradeSheet={gradeSheet}
                gradeStats={gradeStats}
                studentSearch={studentSearch}
                setStudentSearch={setStudentSearch}
                saving={saving}
                savingStudentId={savingStudentId}
                loading={loading}
                handleGradeChange={handleGradeChange}
                handleGradeBlur={handleGradeBlur}
                handleGradeKeyDown={handleGradeKeyDown}
                handleQuickFillAttendance={handleQuickFillAttendance}
                handleSaveAllGrades={handleSaveAllGrades}
                handleSaveSingleGrade={handleSaveSingleGrade}
                teacherInfo={teacherInfo}
                currentTeacherId={currentTeacherId}
                onNotify={onNotify}
              />
            )}

            {activeTab === 'profile' && (
              <TeacherProfileTab
                teacherInfo={teacherInfo}
                currentTeacherId={currentTeacherId}
              />
            )}
          </div>
        </main>
      </div>

      {/* 🟢 CONFIRM SWITCH CLASS MODAL */}
      <ConfirmDialog
        isOpen={!!pendingClassSwitch}
        title="Xác nhận chuyển lớp học phần"
        message="Lớp hiện tại có một số điểm chưa được lưu. Nếu chuyển lớp, các thay đổi chưa lưu sẽ bị mất. Thầy/Cô có chắc chắn muốn tiếp tục chuyển không?"
        confirmText="Tiếp tục chuyển"
        cancelText="Ở lại lớp này"
        onConfirm={confirmClassSwitch}
        onCancel={cancelClassSwitch}
        isDestructive={true}
      />
    </div>
  );
}
