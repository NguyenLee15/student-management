// cSpell:disable
import { useState, useEffect } from 'react';
import { useTeacherProfile } from './teacher/useTeacherProfile';
import { useTeacherGrades } from './teacher/useTeacherGrades';

export function useTeacherPortal({ currentUser, onNotify }) {
  const [activeTab, setActiveTab] = useState('overview');

  const {
    currentTeacherId,
    teacherInfo,
    classes,
    schedules,
    loading: loadingProfile,
    loadTeacherData,
  } = useTeacherProfile({ currentUser, onNotify });

  const {
    selectedClass,
    students,
    filteredStudents,
    gradeSheet,
    studentSearch,
    setStudentSearch,
    loadingGrades,
    saving,
    totalGradedCount,
    gradeProgressPercent,
    gradeStats,
    handleSelectClass,
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
  } = useTeacherGrades({ onNotify });

  // Auto-select first class when classes are loaded and none selected yet
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      handleSelectClass(classes[0]);
    }
  }, [classes, selectedClass, handleSelectClass]);

  const loading = loadingProfile || loadingGrades;

  return {
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
    loadTeacherData,
    handleSelectClass,
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
  };
}
