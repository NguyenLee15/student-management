// cSpell:disable
/**
 * gradeCalculations.js
 * Các hàm tiện ích tính toán điểm số và quy chuẩn học vụ theo Thông tư 08/2021/TT-BGDĐT
 */

export const WEEKDAYS = [
  { key: 'MONDAY', label: 'Thứ Hai' },
  { key: 'TUESDAY', label: 'Thứ Ba' },
  { key: 'WEDNESDAY', label: 'Thứ Tư' },
  { key: 'THURSDAY', label: 'Thứ Năm' },
  { key: 'FRIDAY', label: 'Thứ Sáu' },
  { key: 'SATURDAY', label: 'Thứ Bảy' },
  { key: 'SUNDAY', label: 'Chủ Nhật' },
];

export const normalizeSemesterEnum = (sem) => {
  if (!sem) return 'SEMESTER_1';
  if (sem === 'SEMESTER_1' || sem === 'SEMESTER_2' || sem === 'SUMMER_SEMESTER') return sem;
  const str = String(sem).toLowerCase();
  if (str.includes('2')) return 'SEMESTER_2';
  if (str.includes('hè') || str.includes('he') || str.includes('phụ') || str.includes('phu') || str.includes('summer')) return 'SUMMER_SEMESTER';
  return 'SEMESTER_1';
};

export const normalizeAcademicYear = (yr) => {
  if (!yr) return '2026-2027';
  return String(yr).replace(/\s+/g, '').slice(0, 9);
};

export const getWeights = (cls) => ({
  att: cls?.attendanceWeight != null ? Number(cls.attendanceWeight) : 0.1,
  mid: cls?.midtermWeight != null ? Number(cls.midtermWeight) : 0.3,
  fin: cls?.finalExamWeight != null ? Number(cls.finalExamWeight) : 0.6,
});

export const calculateFinalScore = (entry, weights) => {
  if (!entry) return { score10: null, scoreText: '--', letterGrade: 'Chưa đủ', passedText: 'Chưa đủ điểm', isComplete: false };
  const hasAtt = entry.attendanceScore !== '' && entry.attendanceScore != null;
  const hasMid = entry.midtermScore !== '' && entry.midtermScore != null;
  const hasFin = entry.finalExamScore !== '' && entry.finalExamScore != null;

  if (!hasAtt || !hasMid || !hasFin) {
    return { score10: null, scoreText: '--', letterGrade: 'Chưa đủ', passedText: 'Chưa thi đủ', isComplete: false };
  }

  const att = Number(entry.attendanceScore) || 0;
  const mid = Number(entry.midtermScore) || 0;
  const fin = Number(entry.finalExamScore) || 0;
  const wAtt = weights?.att ?? 0.1;
  const wMid = weights?.mid ?? 0.3;
  const wFin = weights?.fin ?? 0.6;

  const rawScore = (att * wAtt) + (mid * wMid) + (fin * wFin);
  const score10 = Number(rawScore.toFixed(1));

  let letterGrade = 'F';
  if (score10 >= 8.5) letterGrade = 'A';
  else if (score10 >= 8.0) letterGrade = 'B+';
  else if (score10 >= 7.0) letterGrade = 'B';
  else if (score10 >= 6.5) letterGrade = 'C+';
  else if (score10 >= 5.5) letterGrade = 'C';
  else if (score10 >= 5.0) letterGrade = 'D+';
  else if (score10 >= 4.0) letterGrade = 'D';

  const passedText = score10 >= 4.0 ? 'Đạt' : 'Học lại';
  return { score10, scoreText: score10.toFixed(1), letterGrade, passedText, isComplete: true };
};
