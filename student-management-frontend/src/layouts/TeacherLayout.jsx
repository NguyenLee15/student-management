// cSpell:disable
import React, { useState } from 'react';
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

export default function TeacherLayout({ currentUser, onLogout, onNotify, onRoleSwitch }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    totalGradedCount,
    gradeProgressPercent,
    gradeStats,
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
          onRoleSwitch={onRoleSwitch}
        />

        {/* 🟢 TAB CONTENT WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
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
