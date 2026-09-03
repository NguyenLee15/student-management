// cSpell:disable
/**
 * exportCsv.js
 * Xuất danh sách điểm danh và bảng điểm học phần ra file CSV (chuẩn UTF-8 có BOM chống lỗi font tiếng Việt)
 */

import { msg } from '../lib/messages';
import { normalizeAcademicYear, getWeights, calculateFinalScore } from './gradeCalculations';

export const exportAttendanceCsv = (selectedClass, teacherInfo, currentTeacherId, students, gradeSheet, onNotify) => {
  if (!selectedClass || students.length === 0) {
    if (onNotify) onNotify('warning', 'Không có sinh viên nào trong danh sách để xuất.');
    return;
  }

  const metaBlock = [
    `"TRƯỜNG ĐẠI HỌC CÔNG NGHỆ & ĐÀO TẠO"`,
    `"DANH SÁCH ĐIỂM DANH HỌC PHẦN"`,
    `"Môn học: ${selectedClass.subjectName || selectedClass.subjectId}"`,
    `"Mã lớp tín chỉ: #${selectedClass.creditClassId}"`,
    `"Giảng viên: ${teacherInfo?.fullName || 'Giảng Viên'} (${teacherInfo?.teacherId || currentTeacherId})"`,
    `"Học kỳ: ${msg.enum.semester[selectedClass.semester] || selectedClass.semester || 'Học kỳ 1'} - Năm học: ${normalizeAcademicYear(selectedClass.academicYearName || selectedClass.academicYearId)}"`,
    `"Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}"`,
    ''
  ];

  const headers = ['Mã Sinh Viên', 'Họ Và Tên', 'Giới Tính', 'Lớp Hành Chính', 'Điểm Chuyên Cần', 'Trạng Thái Dự Thi', 'Ghi Chú'];
  const rows = students.map((st) => {
    const entry = gradeSheet[st.studentId];
    const att = entry?.attendanceScore !== '' && entry?.attendanceScore != null ? Number(entry.attendanceScore) : null;
    const status = att !== null && att < 5 ? 'Cảnh báo vắng nhiều' : 'Đủ điều kiện dự thi';
    const note = att !== null && att < 5 ? 'Cần bổ sung điều kiện hoặc học lại' : 'Bình thường';
    return [
      `"${st.studentId}"`,
      `"${st.fullName}"`,
      `"${msg.enum.gender[st.gender] || st.gender || 'Nam'}"`,
      `"${st.className || st.classId || 'Chưa xếp lớp'}"`,
      att !== null ? att : '""',
      `"${status}"`,
      `"${note}"`
    ];
  });

  const csvContent = '\uFEFF' + [...metaBlock, headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DanhSachDiemDanh_Lop_${selectedClass.creditClassId}_${selectedClass.subjectName || 'HocPhan'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (onNotify) {
    onNotify('success', `Đã xuất danh sách điểm danh lớp ${selectedClass.subjectName || selectedClass.creditClassId}!`);
  }
};

export const exportGradeSheetCsv = (selectedClass, teacherInfo, currentTeacherId, students, gradeSheet, onNotify) => {
  if (!selectedClass || students.length === 0) {
    if (onNotify) onNotify('warning', 'Không có sinh viên nào trong danh sách để xuất.');
    return;
  }

  const weights = getWeights(selectedClass);
  const metaBlock = [
    `"TRƯỜNG ĐẠI HỌC CÔNG NGHỆ & ĐÀO TẠO"`,
    `"BẢNG ĐIỂM TỔNG KẾT HỌC PHẦN"`,
    `"Môn học: ${selectedClass.subjectName || selectedClass.subjectId}"`,
    `"Mã lớp tín chỉ: #${selectedClass.creditClassId}"`,
    `"Giảng viên: ${teacherInfo?.fullName || 'Giảng Viên'} (${teacherInfo?.teacherId || currentTeacherId})"`,
    `"Học kỳ: ${msg.enum.semester[selectedClass.semester] || selectedClass.semester || 'Học kỳ 1'} - Năm học: ${normalizeAcademicYear(selectedClass.academicYearName || selectedClass.academicYearId)}"`,
    `"Quy chuẩn tính điểm: Chuyên cần (${Math.round(weights.att * 100)}%) + Giữa kỳ (${Math.round(weights.mid * 100)}%) + Cuối kỳ (${Math.round(weights.fin * 100)}%)"`,
    `"Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}"`,
    ''
  ];

  const headers = [
    'STT',
    'Mã Sinh Viên',
    'Họ Và Tên',
    'Lớp Hành Chính',
    `Chuyên Cần (${Math.round(weights.att * 100)}%)`,
    `Giữa Kỳ (${Math.round(weights.mid * 100)}%)`,
    `Cuối Kỳ (${Math.round(weights.fin * 100)}%)`,
    'Tổng Kết (Hệ 10)',
    'Điểm Chữ',
    'Kết Quả',
    'Trạng Thái Lưu'
  ];

  const rows = students.map((st, idx) => {
    const entry = gradeSheet[st.studentId] || {};
    const calc = calculateFinalScore(entry, weights);
    const statusText = entry.isSaved ? 'Đã lưu CSDL' : 'Chưa lưu';

    return [
      idx + 1,
      `"${st.studentId}"`,
      `"${st.fullName}"`,
      `"${st.className || st.classId || 'Chưa xếp lớp'}"`,
      entry.attendanceScore ?? '',
      entry.midtermScore ?? '',
      entry.finalExamScore ?? '',
      calc.isComplete ? calc.scoreText : '',
      `"${calc.letterGrade}"`,
      `"${calc.passedText}"`,
      `"${statusText}"`
    ];
  });

  const csvContent = '\uFEFF' + [...metaBlock, headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BangDiem_Lop_${selectedClass.creditClassId}_${selectedClass.subjectName || 'HocPhan'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (onNotify) {
    onNotify('success', `Đã xuất bảng điểm tổng kết lớp ${selectedClass.subjectName || selectedClass.creditClassId}!`);
  }
};
