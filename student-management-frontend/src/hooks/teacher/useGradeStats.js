// cSpell:disable
import { useMemo } from 'react';
import { getWeights, calculateFinalScore } from '../../utils/gradeCalculations';

export function useGradeStats({ students = [], gradeSheet = {}, selectedClass }) {
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
    totalGradedCount,
    gradeProgressPercent,
    gradeStats,
  };
}

