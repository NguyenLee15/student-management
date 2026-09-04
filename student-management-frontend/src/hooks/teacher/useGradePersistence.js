// cSpell:disable
import { useState, useCallback } from 'react';
import { gradeApi } from '../../api';
import { normalizeSemesterEnum, normalizeAcademicYear, getWeights, calculateFinalScore } from '../../utils/gradeCalculations';

/**
 * useGradePersistence.js
 * Quản lý lưu điểm hàng loạt và từng sinh viên, hỗ trợ lưu điểm từng phần và kiểm soát xung đột phiên bản
 */
export function useGradePersistence({ onNotify, setGradeSheet }) {
  const [saving, setSaving] = useState(false);

  const handleSaveAllGrades = useCallback(async ({ selectedClass, students, gradeSheet }) => {
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
        const attNum = entry.attendanceScore !== '' && entry.attendanceScore != null ? Number(entry.attendanceScore) : null;
        const midNum = entry.midtermScore !== '' && entry.midtermScore != null ? Number(entry.midtermScore) : null;
        const finNum = entry.finalExamScore !== '' && entry.finalExamScore != null ? Number(entry.finalExamScore) : null;

        const hasAnyScore = attNum !== null || midNum !== null || finNum !== null;
        if (!hasAnyScore) {
          skippedCount++;
          return;
        }

        const calc = calculateFinalScore(entry, weights);

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
          scoreScale10: calc.isComplete ? calc.score10 : null,
          scoreScale4: calc.isComplete ? calc.score4 : null,
          letterGrade: calc.isComplete ? calc.letterGrade : null,
          version: entry.version ?? null,
        });
      });

      if (batchPayloads.length === 0) {
        if (onNotify) onNotify('info', `Không có sinh viên nào có điểm mới hoặc điểm cần cập nhật.`);
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
              version: savedItem.version,
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
          await Promise.allSettled(
            chunk.map(async (p) => {
              try {
                let saved = null;
                if (p.gradeId) {
                  const r = await gradeApi.update(p.gradeId, p);
                  saved = r.data || r;
                } else {
                  const r = await gradeApi.create(p);
                  saved = r.data || r;
                }
                if (saved && p.studentId && updatedGrades[p.studentId]) {
                  updatedGrades[p.studentId] = {
                    ...updatedGrades[p.studentId],
                    gradeId: saved.gradeId || p.gradeId,
                    version: saved.version,
                    isSaved: true,
                  };
                  successCount++;
                }
              } catch (singleErr) {
                console.warn(`Lưu điểm cho SV ${p.studentId} thất bại:`, singleErr);
              }
            })
          );
        }
      }

      setGradeSheet(updatedGrades);

      if (successCount > 0) {
        const skippedMsg = skippedCount > 0 ? ` (Bỏ qua ${skippedCount} sinh viên chưa nhập điểm)` : '';
        if (onNotify) onNotify('success', `Đã lưu thành công điểm cho ${successCount} sinh viên!${skippedMsg}`);
      } else {
        if (onNotify) onNotify('error', 'Không thể lưu bảng điểm. Vui lòng kiểm tra lại kết nối mạng hoặc liên hệ quản trị.');
      }
    } catch (err) {
      console.error('Lỗi khi lưu bảng điểm:', err);
      const msg = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi lưu bảng điểm!';
      if (onNotify) onNotify('error', msg);
    } finally {
      setSaving(false);
    }
  }, [onNotify, setGradeSheet]);

  const handleSaveSingleGrade = useCallback(async ({ st, selectedClass, gradeSheet }) => {
    if (!st || !selectedClass) return;
    const entry = gradeSheet[st.studentId] || {};
    const attNum = entry.attendanceScore !== '' && entry.attendanceScore != null ? Number(entry.attendanceScore) : null;
    const midNum = entry.midtermScore !== '' && entry.midtermScore != null ? Number(entry.midtermScore) : null;
    const finNum = entry.finalExamScore !== '' && entry.finalExamScore != null ? Number(entry.finalExamScore) : null;

    const hasAnyScore = attNum !== null || midNum !== null || finNum !== null;
    if (!hasAnyScore) {
      if (onNotify) onNotify('warning', `Vui lòng nhập ít nhất một cột điểm cho sinh viên ${st.fullName || st.studentId}!`);
      return;
    }

    const weights = getWeights(selectedClass);
    const calc = calculateFinalScore(entry, weights);

    try {
      const baseSemester = normalizeSemesterEnum(selectedClass.semester);
      const baseYear = normalizeAcademicYear(selectedClass.academicYearName || selectedClass.academicYearId);

      const payload = {
        studentId: st.studentId,
        subjectId: selectedClass.subjectId,
        semester: baseSemester,
        academicYear: baseYear,
        studyPhase: 'PHASE_1',
        attendanceScore: attNum,
        midtermScore: midNum,
        finalExamScore: finNum,
        scoreScale10: calc.isComplete ? calc.score10 : null,
        scoreScale4: calc.isComplete ? calc.score4 : null,
        letterGrade: calc.isComplete ? calc.letterGrade : null,
        version: entry.version ?? null,
      };

      let savedId = entry.gradeId;
      let savedVersion = entry.version;
      if (entry.gradeId) {
        const res = await gradeApi.update(entry.gradeId, { ...payload, gradeId: Number(entry.gradeId) });
        const saved = res.data || res;
        savedId = saved.gradeId || entry.gradeId;
        savedVersion = saved.version ?? savedVersion;
      } else {
        const res = await gradeApi.create(payload);
        const saved = res.data || res;
        savedId = saved.gradeId || saved.data?.gradeId || saved.id;
        savedVersion = saved.version ?? savedVersion;
      }

      setGradeSheet(prev => ({
        ...prev,
        [st.studentId]: {
          ...entry,
          gradeId: savedId,
          version: savedVersion,
          isSaved: true,
        }
      }));
      if (onNotify) onNotify('success', `Đã lưu điểm cho SV ${st.fullName || st.studentId}!`);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || `Lỗi khi lưu điểm cho SV ${st.studentId}`;
      if (onNotify) onNotify('error', msg);
    }
  }, [onNotify, setGradeSheet]);

  return {
    saving,
    handleSaveAllGrades,
    handleSaveSingleGrade,
  };
}

