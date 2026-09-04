// cSpell:disable
import { useState, useCallback, useMemo } from 'react';

/**
 * useGradeSheetState.js
 * Quản lý trạng thái bảng điểm cục bộ, xác thực và chuẩn hóa điểm số thành phần
 */
export function useGradeSheetState({ onNotify }) {
  const [gradeSheet, setGradeSheet] = useState({});

  const handleGradeChange = useCallback((studentId, field, val) => {
    if (val === '') {
      setGradeSheet(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [field]: '',
          isSaved: false,
        }
      }));
      return;
    }

    const cleanVal = val.replace(',', '.');
    if (!/^\d{0,2}(\.\d{0,2})?$/.test(cleanVal)) return;

    const num = parseFloat(cleanVal);
    if (!isNaN(num) && num > 10) return;

    setGradeSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: cleanVal,
        isSaved: false,
      }
    }));
  }, []);

  const handleGradeBlur = useCallback((studentId, field) => {
    setGradeSheet(prev => {
      const entry = prev[studentId];
      if (!entry) return prev;
      const raw = entry[field];
      if (raw === '' || raw == null) return prev;
      const num = parseFloat(raw);
      if (isNaN(num)) {
        return {
          ...prev,
          [studentId]: { ...entry, [field]: '', isSaved: false }
        };
      }
      const clamped = Math.min(10, Math.max(0, num));
      return {
        ...prev,
        [studentId]: { ...entry, [field]: clamped.toFixed(1), isSaved: false }
      };
    });
  }, []);

  const handleQuickFillAttendance = useCallback((students = []) => {
    if (students.length === 0) return;
    setGradeSheet(prev => {
      const next = { ...prev };
      students.forEach(st => {
        const cur = next[st.studentId] || {};
        if (cur.attendanceScore === '' || cur.attendanceScore == null) {
          next[st.studentId] = {
            ...cur,
            attendanceScore: '10',
            isSaved: false,
          };
        }
      });
      return next;
    });
    if (onNotify) onNotify('info', 'Đã tự động điền điểm chuyên cần 10 cho các sinh viên chưa có điểm.');
  }, [onNotify]);

  const hasUnsavedGrades = useMemo(() => {
    return Object.values(gradeSheet).some(entry => entry && entry.isSaved === false);
  }, [gradeSheet]);

  return {
    gradeSheet,
    setGradeSheet,
    handleGradeChange,
    handleGradeBlur,
    handleQuickFillAttendance,
    hasUnsavedGrades,
  };
}

