// cSpell:disable
import { useState, useMemo } from 'react';
import { creditClassApi, studentApi, gradeApi } from '../../api';
import { normalizeSemesterEnum, normalizeAcademicYear, getWeights, calculateFinalScore } from '../../utils/gradeCalculations';

export function useTeacherGrades({ onNotify }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [gradeSheet, setGradeSheet] = useState({});
  const [studentSearch, setStudentSearch] = useState('');
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSelectClass = async (cls) => {
    setSelectedClass(cls);
    setLoadingGrades(true);
    setGradeSheet({});
    try {
      const stRes = await creditClassApi.getStudents(cls.creditClassId);
      const stData = stRes.data || stRes;
      let stList = Array.isArray(stData) ? stData : (stData.content || []);
      
      if (stList.length === 0) {
        try {
          const fallbackStudentsRes = await studentApi.getAll({ size: 10 });
          const fallbackData = fallbackStudentsRes.data || fallbackStudentsRes;
          stList = Array.isArray(fallbackData) ? fallbackData : (fallbackData.content || []);
        } catch (fbErr) {
          console.warn('Không thể tải sinh viên fallback', fbErr);
        }
      }
      setStudents(stList);

      const baseSemester = normalizeSemesterEnum(cls.semester);
      const baseYear = normalizeAcademicYear(cls.academicYearName || cls.academicYearId);

      let gradeList = [];
      try {
        const gRes = await gradeApi.getAll({
          subjectId: cls.subjectId,
          semester: baseSemester,
          academicYear: baseYear,
          size: 100
        });
        const gData = gRes.data || gRes;
        gradeList = Array.isArray(gData) ? gData : (gData.content || []);
      } catch (gErr) {
        console.warn('Lỗi khi tải bảng điểm lớp:', gErr);
      }

      const initialGrades = {};
      stList.forEach((s) => {
        const match = gradeList.find(g => g.studentId === s.studentId);
        if (match) {
          const s10 = match.scoreScale10 != null ? Number(match.scoreScale10) : null;
          initialGrades[s.studentId] = {
            gradeId: match.gradeId || match.id,
            attendanceScore: match.attendanceScore != null ? String(match.attendanceScore) : (s10 != null ? String(s10) : ''),
            midtermScore: match.midtermScore != null ? String(match.midtermScore) : (s10 != null ? String(s10) : ''),
            finalExamScore: match.finalExamScore != null ? String(match.finalExamScore) : (s10 != null ? String(s10) : ''),
            isSaved: true,
          };
        } else {
          initialGrades[s.studentId] = {
            attendanceScore: '',
            midtermScore: '',
            finalExamScore: '',
            isSaved: false,
          };
        }
      });
      setGradeSheet(initialGrades);
    } catch (err) {
      console.warn('Lỗi khi tải dữ liệu lớp học phần:', err);
    } finally {
      setLoadingGrades(false);
    }
  };

  const handleSelectClassSafe = (cls) => {
    if (!cls || cls.creditClassId === selectedClass?.creditClassId) return;
    const hasUnsaved = Object.values(gradeSheet).some(g => !g.isSaved && (g.attendanceScore !== '' || g.midtermScore !== '' || g.finalExamScore !== ''));
    if (hasUnsaved) {
      const confirmSwitch = window.confirm('Lớp hiện tại có một số điểm chưa được lưu. Nếu chuyển lớp, các thay đổi này sẽ bị mất. Thầy/Cô có muốn tiếp tục chuyển không?');
      if (!confirmSwitch) return;
    }
    handleSelectClass(cls);
  };

  const handleGradeChange = (studentId, field, val) => {
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
  };

  const handleGradeBlur = (studentId, field) => {
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
        [studentId]: { ...entry, [field]: String(clamped) }
      };
    });
  };

  const handleGradeKeyDown = (e, index, field) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      const nextInput = document.querySelector(`input[data-field="${field}"][data-idx="${index + 1}"]`);
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = document.querySelector(`input[data-field="${field}"][data-idx="${index - 1}"]`);
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  };

  const handleQuickFillAttendance = () => {
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
  };

  const handleSaveAllGrades = async () => {
    if (!selectedClass || students.length === 0) return;
    if (!selectedClass.subjectId) {
      if (onNotify) onNotify('error', 'Lớp học phần không hợp lệ (thiếu mã môn học).');
      return;
    }
    setSaving(true);
    const updatedGrades = { ...gradeSheet };
    const weights = getWeights(selectedClass);

    try {
      const baseSemester = normalizeSemesterEnum(selectedClass.semester);
      const baseYear = normalizeAcademicYear(selectedClass.academicYearName || selectedClass.academicYearId);

      const batchPayloads = [];
      let skippedCount = 0;

      students.forEach(st => {
        const entry = gradeSheet[st.studentId] || {};
        const calc = calculateFinalScore(entry, weights);
        if (!calc.isComplete) {
          skippedCount++;
          return;
        }

        const attNum = entry.attendanceScore !== '' && entry.attendanceScore != null ? Number(entry.attendanceScore) : null;
        const midNum = entry.midtermScore !== '' && entry.midtermScore != null ? Number(entry.midtermScore) : null;
        const finNum = entry.finalExamScore !== '' && entry.finalExamScore != null ? Number(entry.finalExamScore) : null;

        batchPayloads.push({
          gradeId: entry.gradeId ? Number(entry.gradeId) : null,
          studentId: st.studentId,
          subjectId: selectedClass.subjectId,
          semester: baseSemester,
          academicYear: baseYear,
          studyPhase: 'PHASE_1',
          attendanceScore: attNum,
          midtermScore: midNum,
          finalExamScore: finNum,
          scoreScale10: calc.score10,
        });
      });

      if (batchPayloads.length === 0) {
        if (onNotify) onNotify('info', `Có ${skippedCount} sinh viên chưa nhập đủ các cột điểm để lưu.`);
        return;
      }

      let successCount = 0;
      try {
        const res = await gradeApi.saveBatch(batchPayloads);
        const savedList = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
        
        savedList.forEach(savedItem => {
          const stId = savedItem.studentId;
          if (stId && updatedGrades[stId]) {
            updatedGrades[stId] = {
              ...updatedGrades[stId],
              gradeId: savedItem.gradeId,
              isSaved: true,
            };
          }
        });
        successCount = savedList.length || batchPayloads.length;
      } catch (batchErr) {
        console.warn('Lưu batch thất bại, chuyển sang lưu phân đoạn:', batchErr);
        const chunkSize = 5;
        for (let i = 0; i < batchPayloads.length; i += chunkSize) {
          const chunk = batchPayloads.slice(i, i + chunkSize);
          await Promise.all(chunk.map(async (item) => {
            try {
              if (item.gradeId) {
                const res = await gradeApi.update(item.gradeId, item);
                const saved = res.data || res;
                updatedGrades[item.studentId] = {
                  ...updatedGrades[item.studentId],
                  gradeId: saved.gradeId || item.gradeId,
                  isSaved: true,
                };
              } else {
                const res = await gradeApi.create(item);
                const saved = res.data || res;
                updatedGrades[item.studentId] = {
                  ...updatedGrades[item.studentId],
                  gradeId: saved.gradeId || saved.id,
                  isSaved: true,
                };
              }
              successCount++;
            } catch (err) {
              console.warn(`Lỗi lưu sinh viên ${item.studentId}:`, err);
            }
          }));
        }
      }

      setGradeSheet(updatedGrades);

      if (successCount > 0) {
        if (onNotify) onNotify('success', `Đã lưu thành công điểm cho ${successCount} sinh viên lớp ${selectedClass.subjectName || selectedClass.creditClassId}!`);
      }
      if (skippedCount > 0 && successCount === 0) {
        if (onNotify) onNotify('info', `Có ${skippedCount} sinh viên chưa nhập đủ các cột điểm để lưu.`);
      }
    } catch (err) {
      console.warn('Lỗi khi lưu điểm:', err);
      if (onNotify) onNotify('error', 'Có lỗi xảy ra khi lưu điểm.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSingleGrade = async (st) => {
    if (!selectedClass || !st) return;
    if (!selectedClass.subjectId) {
      if (onNotify) onNotify('error', 'Lớp học phần không hợp lệ (thiếu mã môn học).');
      return;
    }
    const entry = gradeSheet[st.studentId] || {};
    const weights = getWeights(selectedClass);
    const calc = calculateFinalScore(entry, weights);

    if (!calc.isComplete) {
      if (onNotify) onNotify('warning', `Vui lòng nhập đầy đủ các đầu điểm cho SV ${st.fullName || st.studentId} trước khi lưu.`);
      return;
    }

    const baseSemester = normalizeSemesterEnum(selectedClass.semester);
    const baseYear = normalizeAcademicYear(selectedClass.academicYearName || selectedClass.academicYearId);
    const attNum = entry.attendanceScore !== '' && entry.attendanceScore != null ? Number(entry.attendanceScore) : null;
    const midNum = entry.midtermScore !== '' && entry.midtermScore != null ? Number(entry.midtermScore) : null;
    const finNum = entry.finalExamScore !== '' && entry.finalExamScore != null ? Number(entry.finalExamScore) : null;

    try {
      const payload = {
        studentId: st.studentId,
        subjectId: selectedClass.subjectId,
        semester: baseSemester,
        academicYear: baseYear,
        studyPhase: 'PHASE_1',
        attendanceScore: attNum,
        midtermScore: midNum,
        finalExamScore: finNum,
        scoreScale10: calc.score10,
      };

      let savedId = entry.gradeId;
      if (entry.gradeId) {
        const res = await gradeApi.update(entry.gradeId, { ...payload, gradeId: Number(entry.gradeId) });
        const saved = res.data || res;
        savedId = saved.gradeId || entry.gradeId;
      } else {
        const res = await gradeApi.create(payload);
        const saved = res.data || res;
        savedId = saved.gradeId || saved.data?.gradeId || saved.id;
      }

      setGradeSheet(prev => ({
        ...prev,
        [st.studentId]: {
          ...entry,
          gradeId: savedId,
          isSaved: true,
        }
      }));
      if (onNotify) onNotify('success', `Đã lưu điểm cho SV ${st.fullName || st.studentId}!`);
    } catch (err) {
      if (onNotify) onNotify('error', err?.response?.data?.message || err?.message || `Lỗi khi lưu điểm cho SV ${st.studentId}`);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students;
    const q = studentSearch.toLowerCase().trim();
    return students.filter(st => 
      (st.studentId && st.studentId.toLowerCase().includes(q)) ||
      (st.fullName && st.fullName.toLowerCase().includes(q)) ||
      (st.className && st.className.toLowerCase().includes(q))
    );
  }, [students, studentSearch]);

  const totalGradedCount = useMemo(() => {
    return students.filter(st => {
      const entry = gradeSheet[st.studentId];
      return entry && (entry.isSaved || entry.gradeId);
    }).length;
  }, [students, gradeSheet]);

  const gradeProgressPercent = useMemo(() => {
    return students.length > 0 ? Math.round((totalGradedCount / students.length) * 100) : 0;
  }, [students.length, totalGradedCount]);

  const gradeStats = useMemo(() => {
    const weights = getWeights(selectedClass);
    let totalGraded = 0;
    let totalPassed = 0;
    let sumScore = 0;
    const distribution = { A: 0, BPlus: 0, B: 0, CPlus: 0, C: 0, DPlus: 0, D: 0, F: 0 };

    students.forEach(st => {
      const entry = gradeSheet[st.studentId];
      const calc = calculateFinalScore(entry, weights);
      if (calc.isComplete && calc.score10 != null) {
        totalGraded++;
        sumScore += calc.score10;
        if (calc.score10 >= 4.0) totalPassed++;
        if (calc.letterGrade === 'A') distribution.A++;
        else if (calc.letterGrade === 'B+') distribution.BPlus++;
        else if (calc.letterGrade === 'B') distribution.B++;
        else if (calc.letterGrade === 'C+') distribution.CPlus++;
        else if (calc.letterGrade === 'C') distribution.C++;
        else if (calc.letterGrade === 'D+') distribution.DPlus++;
        else if (calc.letterGrade === 'D') distribution.D++;
        else if (calc.letterGrade === 'F') distribution.F++;
      }
    });

    const avgScore = totalGraded > 0 ? (sumScore / totalGraded).toFixed(2) : '--';
    const passRate = totalGraded > 0 ? Math.round((totalPassed / totalGraded) * 100) : 0;

    return { totalGraded, totalPassed, avgScore, passRate, distribution };
  }, [students, gradeSheet, selectedClass]);

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
    handleSelectClass,
    handleSelectClassSafe,
    handleGradeChange,
    handleGradeBlur,
    handleGradeKeyDown,
    handleQuickFillAttendance,
    handleSaveAllGrades,
    handleSaveSingleGrade,
  };
}
