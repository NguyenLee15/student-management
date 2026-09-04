// cSpell:disable
import { useState, useMemo, useCallback } from 'react';
import { creditClassApi, gradeApi } from '../../api';
import { normalizeSemesterEnum, normalizeAcademicYear } from '../../utils/gradeCalculations';
import { useGradeStats } from './useGradeStats';
import { useGradeKeyboardNav } from './useGradeKeyboardNav';
import { useGradeSheetState } from './useGradeSheetState';
import { useGradePersistence } from './useGradePersistence';

/**
 * useTeacherGrades.js (Facade Hook)
 * Điều phối toàn bộ trạng thái bảng điểm, tích hợp API Gradebook chuyên biệt và phân quyền giảng viên
 */
export function useTeacherGrades({ onNotify }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [pendingClassSwitch, setPendingClassSwitch] = useState(null);

  // 🟢 Sub-hooks
  const {
    gradeSheet,
    setGradeSheet,
    handleGradeChange,
    handleGradeBlur,
    handleQuickFillAttendance: quickFillAttendanceInternal,
    hasUnsavedGrades,
  } = useGradeSheetState({ onNotify });

  const { handleGradeKeyDown } = useGradeKeyboardNav();

  const {
    saving,
    handleSaveAllGrades: saveAllInternal,
    handleSaveSingleGrade: saveSingleInternal,
  } = useGradePersistence({ onNotify, setGradeSheet });

  // 🟢 Tải bảng điểm cho lớp tín chỉ
  const handleSelectClass = useCallback(async (cls) => {
    if (!cls) return;
    setSelectedClass(cls);
    setLoadingGrades(true);
    setGradeSheet({});

    try {
      // 1. Thử gọi Dedicated Gradebook API (tối ưu hóa 1 query đơn lẻ)
      try {
        const gbRes = await creditClassApi.getGradebook(cls.creditClassId);
        const gb = gbRes.data || gbRes;

        if (gb && Array.isArray(gb.students)) {
          const stList = gb.students.map(item => ({
            studentId: item.studentId,
            fullName: item.fullName,
            gender: item.gender,
            className: item.studentClassId,
          }));
          setStudents(stList);

          const initialGrades = {};
          gb.students.forEach(item => {
            const hasExistingScore = item.gradeId != null;
            initialGrades[item.studentId] = {
              gradeId: item.gradeId ?? null,
              version: item.version ?? null,
              attendanceScore: item.attendanceScore != null ? String(item.attendanceScore) : '',
              midtermScore: item.midtermScore != null ? String(item.midtermScore) : '',
              finalExamScore: item.finalExamScore != null ? String(item.finalExamScore) : '',
              isSaved: hasExistingScore,
            };
          });
          setGradeSheet(initialGrades);
          setLoadingGrades(false);
          return;
        }
      } catch (gbErr) {
        console.warn('Dedicated Gradebook API không khả dụng, chuyển sang chế độ dự phòng:', gbErr);
      }

      // 2. Chế độ dự phòng (Fallback)
      const stRes = await creditClassApi.getStudents(cls.creditClassId);
      const stData = stRes.data || stRes;
      const stList = Array.isArray(stData) ? stData : (stData.content || []);
      setStudents(stList);

      const baseSemester = normalizeSemesterEnum(cls.semester);
      const baseYear = normalizeAcademicYear(cls.academicYearName || cls.academicYearId);

      let gradeList = [];
      try {
        const gRes = await gradeApi.getAll({
          subjectId: cls.subjectId,
          semester: baseSemester,
          academicYear: baseYear,
          size: 100,
        });
        const gData = gRes.data || gRes;
        gradeList = Array.isArray(gData) ? gData : (gData.content || []);
      } catch (gErr) {
        console.warn('Lỗi khi tải bảng điểm lớp qua search:', gErr);
      }

      const initialGrades = {};
      stList.forEach((s) => {
        const match = gradeList.find(g => g.studentId === s.studentId);
        if (match) {
          initialGrades[s.studentId] = {
            gradeId: match.gradeId || match.id,
            version: match.version ?? null,
            attendanceScore: match.attendanceScore != null ? String(match.attendanceScore) : '',
            midtermScore: match.midtermScore != null ? String(match.midtermScore) : '',
            finalExamScore: match.finalExamScore != null ? String(match.finalExamScore) : '',
            isSaved: true,
          };
        } else {
          initialGrades[s.studentId] = {
            attendanceScore: '',
            midtermScore: '',
            finalExamScore: '',
            version: null,
            isSaved: false,
          };
        }
      });
      setGradeSheet(initialGrades);
    } catch (err) {
      console.error('Lỗi khi tải bảng điểm lớp tín chỉ:', err);
      if (onNotify) onNotify('error', 'Không thể tải danh sách sinh viên và bảng điểm của lớp này.');
    } finally {
      setLoadingGrades(false);
    }
  }, [onNotify, setGradeSheet]);

  // 🟢 Chuyển lớp an toàn kèm cảnh báo nếu có điểm chưa lưu
  const handleSelectClassSafe = useCallback((cls) => {
    if (selectedClass && cls?.creditClassId === selectedClass.creditClassId) return;
    if (hasUnsavedGrades) {
      setPendingClassSwitch(cls);
    } else {
      handleSelectClass(cls);
    }
  }, [selectedClass, hasUnsavedGrades, handleSelectClass]);

  const confirmClassSwitch = useCallback(() => {
    if (pendingClassSwitch) {
      handleSelectClass(pendingClassSwitch);
      setPendingClassSwitch(null);
    }
  }, [pendingClassSwitch, handleSelectClass]);

  const cancelClassSwitch = useCallback(() => {
    setPendingClassSwitch(null);
  }, []);

  const handleQuickFillAttendance = useCallback(() => {
    quickFillAttendanceInternal(students);
  }, [quickFillAttendanceInternal, students]);

  const handleSaveAllGrades = useCallback(() => {
    saveAllInternal({ selectedClass, students, gradeSheet });
  }, [saveAllInternal, selectedClass, students, gradeSheet]);

  const handleSaveSingleGrade = useCallback((st) => {
    saveSingleInternal({ st, selectedClass, gradeSheet });
  }, [saveSingleInternal, selectedClass, gradeSheet]);

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students;
    const q = studentSearch.toLowerCase().trim();
    return students.filter(st => 
      (st.studentId && st.studentId.toLowerCase().includes(q)) ||
      (st.fullName && st.fullName.toLowerCase().includes(q)) ||
      (st.className && st.className.toLowerCase().includes(q))
    );
  }, [students, studentSearch]);

  const { totalGradedCount, gradeProgressPercent, gradeStats } = useGradeStats({
    students,
    gradeSheet,
    selectedClass,
  });

  return {
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
    hasUnsavedGrades,
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
