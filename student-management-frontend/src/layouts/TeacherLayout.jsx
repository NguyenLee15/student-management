import { msg } from '../lib/messages';
import React, { useState, useEffect } from 'react';
import { 
  UserSquare2, Layers, Users, Award, Save, CheckCircle2, 
  RefreshCw, BookOpen, Clock, AlertCircle, Edit3, Calendar,
  Home, LogOut, Sparkles, MapPin, User, CheckCheck, FileSpreadsheet, Menu, X, ArrowRight,
  Download, ShieldCheck, Search
} from 'lucide-react';
import { creditClassApi, teacherApi, studentApi, gradeApi, scheduleApi } from '../api';

const WEEKDAYS = [
  { key: 'MONDAY', label: 'Thứ Hai' },
  { key: 'TUESDAY', label: 'Thứ Ba' },
  { key: 'WEDNESDAY', label: 'Thứ Tư' },
  { key: 'THURSDAY', label: 'Thứ Năm' },
  { key: 'FRIDAY', label: 'Thứ Sáu' },
  { key: 'SATURDAY', label: 'Thứ Bảy' },
  { key: 'SUNDAY', label: 'Chủ Nhật' },
];

export default function TeacherLayout({ currentUser, onLogout, onNotify, onRoleSwitch }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview | schedule | classes | grades | profile
  const currentTeacherId = currentUser?.teacherId || currentUser?.username || 'GV001';
  const [teacherInfo, setTeacherInfo] = useState(null);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [gradeSheet, setGradeSheet] = useState({});
  const [studentSearch, setStudentSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTeacherData();
  }, [currentTeacherId]);

  const loadTeacherData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Teacher Info
      let found = null;
      try {
        const tRes = await teacherApi.getAll({ page: 0, size: 100 });
        const tData = tRes.data || tRes;
        const list = Array.isArray(tData) ? tData : (tData.content || []);
        found = list.find(t => 
          t.teacherId?.toLowerCase() === currentTeacherId.toLowerCase() ||
          t.email?.toLowerCase() === currentUser?.username?.toLowerCase()
        ) || list[0];
        setTeacherInfo(found || {
          teacherId: currentTeacherId,
          fullName: currentUser?.fullName || 'Giảng Viên',
          email: `${currentTeacherId.toLowerCase()}@eduportal.edu.vn`,
          facultyName: 'Khoa Công Nghệ Thông Tin'
        });
      } catch (e) {
        console.warn('Lỗi khi tải thông tin giảng viên', e);
      }

      const activeTeacherId = found?.teacherId || currentTeacherId;

      // 2. Fetch Classes assigned to this teacher
      const res = await creditClassApi.getAll();
      const d = res.data || res;
      const all = Array.isArray(d) ? d : (d.content || []);
      const myClasses = all.filter(c => 
        c.teacherId === activeTeacherId || 
        c.teacher?.teacherId === activeTeacherId ||
        (found?.fullName && c.teacherName?.includes(found.fullName))
      );
      const displayClasses = myClasses.length > 0 ? myClasses : all.slice(0, 4);
      setClasses(displayClasses);

      if (displayClasses.length > 0) {
        handleSelectClass(displayClasses[0]);
      }

      // 3. Fetch Schedules for this teacher
      const schRes = await scheduleApi.getAll({ size: 100 });
      const schData = schRes.data || schRes;
      const allSch = Array.isArray(schData) ? schData : (schData.content || []);
      const mySchedules = allSch.filter(s => 
        s.teacherId === activeTeacherId || 
        (found?.fullName && s.teacherName?.includes(found.fullName))
      );
      setSchedules(mySchedules.length > 0 ? mySchedules : allSch);
    } catch (err) {
      console.warn('Lỗi khi tải dữ liệu giảng viên', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = async (cls) => {
    setSelectedClass(cls);
    try {
      // 1. Load actual students enrolled in this credit class
      let stList = [];
      try {
        const stRes = await creditClassApi.getStudents(cls.creditClassId);
        const stData = stRes.data || stRes;
        stList = Array.isArray(stData) ? stData : (stData.content || []);
      } catch (e) {
        console.warn('Không thể tải sinh viên theo lớp tín chỉ, thử tìm kiếm thay thế', e);
      }
      setStudents(stList);

      // 2. Load existing grades for this subject
      const initialGrades = {};
      try {
        const activeYear = cls.academicYearId || cls.academicYearName || '2026-2027';
        const gradeRes = await gradeApi.getAll({ 
          subjectId: cls.subjectId, 
          semester: cls.semester, 
          academicYear: activeYear, 
          size: 100 
        });
        const gradeData = gradeRes.data || gradeRes;
        const gradeList = Array.isArray(gradeData) ? gradeData : (gradeData.content || []);

        stList.forEach((s) => {
          const match = gradeList.find(g => g.studentId === s.studentId);
          if (match) {
            const s10 = match.scoreScale10 != null ? Number(match.scoreScale10) : 8;
            initialGrades[s.studentId] = {
              gradeId: match.gradeId || match.id,
              attendanceScore: match.attendanceScore ?? 10,
              midtermScore: match.midtermScore ?? s10,
              finalExamScore: match.finalExamScore ?? s10,
              isSaved: true,
            };
          } else {
            initialGrades[s.studentId] = {
              attendanceScore: 10,
              midtermScore: 8,
              finalExamScore: 8,
              isSaved: false,
            };
          }
        });
      } catch (ge) {
        stList.forEach((s) => {
          initialGrades[s.studentId] = {
            attendanceScore: 10,
            midtermScore: 8,
            finalExamScore: 8,
            isSaved: false,
          };
        });
      }
      setGradeSheet(initialGrades);
    } catch (e) {
      console.warn('Lỗi khi tải sinh viên của lớp', e);
    }
  };

  const handleGradeChange = (studentId, field, val) => {
    const num = parseFloat(val);
    setGradeSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: isNaN(num) ? '' : Math.min(10, Math.max(0, num)),
        isSaved: false,
      }
    }));
  };

  const handleSaveAllGrades = async () => {
    if (!selectedClass || students.length === 0) return;
    setSaving(true);
    let successCount = 0;
    let failCount = 0;
    const updatedGrades = { ...gradeSheet };

    try {
      const promises = students.map(async (st) => {
        const entry = gradeSheet[st.studentId] || {};
        const att = Number(entry.attendanceScore) || 0;
        const mid = Number(entry.midtermScore) || 0;
        const fin = Number(entry.finalExamScore) || 0;
        const score10 = Number(((att * 0.1) + (mid * 0.3) + (fin * 0.6)).toFixed(1));

        const baseSemester = selectedClass.semester || 'SEMESTER_1';
        const baseYear = selectedClass.academicYearId || selectedClass.academicYearName || '2026-2027';

        try {
          if (entry.gradeId) {
            // Cập nhật điểm đã có trong cơ sở dữ liệu
            const updatePayload = {
              gradeId: Number(entry.gradeId),
              semester: baseSemester,
              studyPhase: 'PHASE_1',
              scoreScale10: score10,
            };
            const res = await gradeApi.update(entry.gradeId, updatePayload);
            const savedData = res.data || res;
            updatedGrades[st.studentId] = {
              ...entry,
              gradeId: savedData.gradeId || entry.gradeId,
              isSaved: true,
            };
            successCount++;
          } else {
            // Tạo mới bản ghi điểm chưa từng tồn tại
            const createPayload = {
              studentId: st.studentId,
              subjectId: selectedClass.subjectId || 'IT001',
              semester: baseSemester,
              academicYear: baseYear,
              studyPhase: 'PHASE_1',
              scoreScale10: score10,
            };
            const res = await gradeApi.create(createPayload);
            const savedData = res.data || res;
            const newId = savedData.gradeId || savedData.data?.gradeId || savedData.id;
            updatedGrades[st.studentId] = {
              ...entry,
              gradeId: newId,
              isSaved: true,
            };
            successCount++;
          }
        } catch (itemErr) {
          console.warn(`Lỗi lưu điểm sinh viên ${st.studentId}:`, itemErr);
          failCount++;
        }
      });

      await Promise.all(promises);
      setGradeSheet(updatedGrades);

      if (failCount === 0) {
        onNotify('success', `Đã lưu thành công điểm cho toàn bộ ${successCount} sinh viên lớp ${selectedClass.subjectName || selectedClass.creditClassId}!`);
      } else {
        onNotify('warning', `Đã lưu thành công ${successCount} sinh viên. Thất bại: ${failCount} sinh viên.`);
      }
    } catch (err) {
      console.warn('Lỗi khi lưu điểm:', err);
      onNotify('error', 'Có lỗi xảy ra khi lưu điểm.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSingleGrade = async (st) => {
    if (!selectedClass || !st) return;
    const entry = gradeSheet[st.studentId] || {};
    const att = Number(entry.attendanceScore) || 0;
    const mid = Number(entry.midtermScore) || 0;
    const fin = Number(entry.finalExamScore) || 0;
    const score10 = Number(((att * 0.1) + (mid * 0.3) + (fin * 0.6)).toFixed(1));
    const baseSemester = selectedClass.semester || 'SEMESTER_1';
    const baseYear = selectedClass.academicYearId || selectedClass.academicYearName || '2026-2027';

    try {
      if (entry.gradeId) {
        const updatePayload = {
          gradeId: Number(entry.gradeId),
          semester: baseSemester,
          studyPhase: 'PHASE_1',
          scoreScale10: score10,
        };
        const res = await gradeApi.update(entry.gradeId, updatePayload);
        const savedData = res.data || res;
        setGradeSheet(prev => ({
          ...prev,
          [st.studentId]: {
            ...entry,
            gradeId: savedData.gradeId || entry.gradeId,
            isSaved: true,
          }
        }));
      } else {
        const createPayload = {
          studentId: st.studentId,
          subjectId: selectedClass.subjectId || 'IT001',
          semester: baseSemester,
          academicYear: baseYear,
          studyPhase: 'PHASE_1',
          scoreScale10: score10,
        };
        const res = await gradeApi.create(createPayload);
        const savedData = res.data || res;
        const newId = savedData.gradeId || savedData.data?.gradeId || savedData.id;
        setGradeSheet(prev => ({
          ...prev,
          [st.studentId]: {
            ...entry,
            gradeId: newId,
            isSaved: true,
          }
        }));
      }
      onNotify('success', `Đã lưu điểm cho SV ${st.fullName || st.studentId}!`);
    } catch (err) {
      onNotify('error', err?.response?.data?.message || err?.message || `Lỗi khi lưu điểm cho SV ${st.studentId}`);
    }
  };

  // Real Export Attendance Roster as CSV / Excel
  const handleExportAttendance = () => {
    if (!selectedClass || students.length === 0) {
      onNotify('warning', 'Không có sinh viên nào trong danh sách để xuất.');
      return;
    }

    const metaBlock = [
      `"DANH SÁCH ĐIỂM DANH HỌC PHẦN"`,
      `"Môn học: ${selectedClass.subjectName || selectedClass.subjectId}"`,
      `"Mã lớp tín chỉ: #${selectedClass.creditClassId}"`,
      `"Giảng viên: ${teacherInfo?.fullName || 'Giảng Viên'} (${teacherInfo?.teacherId || currentTeacherId})"`,
      `"Học kỳ: ${msg.enum.semester[selectedClass.semester] || selectedClass.semester || 'Học kỳ 1'} - Năm học: ${selectedClass.academicYearName || selectedClass.academicYearId || '2026-2027'}"`,
      `"Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}"`,
      ''
    ];

    const headers = ['Mã Sinh Viên', 'Họ Và Tên', 'Giới Tính', 'Lớp Hành Chính', 'Buổi 1', 'Buổi 2', 'Buổi 3', 'Buổi 4', 'Buổi 5', 'Ghi Chú'];
    const rows = students.map((st) => [
      `"${st.studentId}"`,
      `"${st.fullName}"`,
      `"${msg.enum.gender[st.gender] || st.gender || 'Nam'}"`,
      `"${st.className || st.classId || 'CNTT'}"`,
      'V', 'V', 'V', 'V', 'V', 'Đủ điều kiện dự thi'
    ]);

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

    onNotify('success', `Đã xuất danh sách điểm danh lớp ${selectedClass.subjectName || selectedClass.creditClassId}!`);
  };

  // Real Export Grade Sheet as CSV / Excel
  const handleExportGrades = () => {
    if (!selectedClass || students.length === 0) {
      onNotify('warning', 'Không có sinh viên nào trong danh sách để xuất.');
      return;
    }

    const metaBlock = [
      `"BẢNG ĐIỂM TỔNG KẾT HỌC PHẦN"`,
      `"Môn học: ${selectedClass.subjectName || selectedClass.subjectId}"`,
      `"Mã lớp tín chỉ: #${selectedClass.creditClassId}"`,
      `"Giảng viên: ${teacherInfo?.fullName || 'Giảng Viên'} (${teacherInfo?.teacherId || currentTeacherId})"`,
      `"Học kỳ: ${msg.enum.semester[selectedClass.semester] || selectedClass.semester || 'Học kỳ 1'} - Năm học: ${selectedClass.academicYearName || selectedClass.academicYearId || '2026-2027'}"`,
      `"Quy chuẩn tính điểm: Chuyên cần (10%) + Giữa kỳ (30%) + Cuối kỳ (60%)"`,
      `"Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}"`,
      ''
    ];

    const headers = [
      'STT',
      'Mã Sinh Viên',
      'Họ Và Tên',
      'Lớp Hành Chính',
      'Chuyên Cần (10%)',
      'Giữa Kỳ (30%)',
      'Cuối Kỳ (60%)',
      'Tổng Kết (Hệ 10)',
      'Điểm Chữ',
      'Kết Quả',
      'Trạng Thái Lưu'
    ];

    const rows = students.map((st, idx) => {
      const entry = gradeSheet[st.studentId] || { attendanceScore: 10, midtermScore: 8, finalExamScore: 8 };
      const att = Number(entry.attendanceScore) || 0;
      const mid = Number(entry.midtermScore) || 0;
      const fin = Number(entry.finalExamScore) || 0;
      const finalScoreNum = ((att * 0.1) + (mid * 0.3) + (fin * 0.6));
      const finalScore = finalScoreNum.toFixed(1);

      let letterGrade = 'F';
      if (finalScoreNum >= 8.5) letterGrade = 'A';
      else if (finalScoreNum >= 8.0) letterGrade = 'B+';
      else if (finalScoreNum >= 7.0) letterGrade = 'B';
      else if (finalScoreNum >= 6.5) letterGrade = 'C+';
      else if (finalScoreNum >= 5.5) letterGrade = 'C';
      else if (finalScoreNum >= 5.0) letterGrade = 'D+';
      else if (finalScoreNum >= 4.0) letterGrade = 'D';

      const passed = finalScoreNum >= 4.0 ? 'Đạt' : 'Học lại';
      const statusText = entry.isSaved ? 'Đã lưu CSDL' : 'Chưa lưu';

      return [
        idx + 1,
        `"${st.studentId}"`,
        `"${st.fullName}"`,
        `"${st.className || st.classId || 'CNTT'}"`,
        entry.attendanceScore ?? '',
        entry.midtermScore ?? '',
        entry.finalExamScore ?? '',
        finalScore,
        `"${letterGrade}"`,
        `"${passed}"`,
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

    onNotify('success', `Đã xuất bảng điểm lớp ${selectedClass.subjectName || selectedClass.creditClassId}!`);
  };

  // Helper to match studyTime with weekday
  const matchesDay = (s, dayKey) => {
    if (!s) return false;
    const text = (s.studyTime || s.dayOfWeek || '').toLowerCase();
    if (dayKey === 'MONDAY' && (text.includes('thứ 2') || text.includes('thu 2') || text.includes('thứ hai') || text.includes('thu hai') || text.includes('monday') || text.includes('t2'))) return true;
    if (dayKey === 'TUESDAY' && (text.includes('thứ 3') || text.includes('thu 3') || text.includes('thứ ba') || text.includes('thu ba') || text.includes('tuesday') || text.includes('t3'))) return true;
    if (dayKey === 'WEDNESDAY' && (text.includes('thứ 4') || text.includes('thu 4') || text.includes('thứ tư') || text.includes('thu tu') || text.includes('wednesday') || text.includes('t4'))) return true;
    if (dayKey === 'THURSDAY' && (text.includes('thứ 5') || text.includes('thu 5') || text.includes('thứ năm') || text.includes('thu nam') || text.includes('thursday') || text.includes('t5'))) return true;
    if (dayKey === 'FRIDAY' && (text.includes('thứ 6') || text.includes('thu 6') || text.includes('thứ sáu') || text.includes('thu sau') || text.includes('friday') || text.includes('t6'))) return true;
    if (dayKey === 'SATURDAY' && (text.includes('thứ 7') || text.includes('thu 7') || text.includes('thứ bảy') || text.includes('thu bay') || text.includes('saturday') || text.includes('t7'))) return true;
    if (dayKey === 'SUNDAY' && (text.includes('chủ nhật') || text.includes('chu nhat') || text.includes('sunday') || text.includes('cn'))) return true;
    return false;
  };

  const navItems = [
    { id: 'overview', label: 'Bảng Điều Khiển Giảng Dạy', icon: Home },
    { id: 'schedule', label: 'Lịch Dạy Tuần Này', icon: Calendar },
    { id: 'classes', label: 'Lớp Học Phần Đứng Lớp', icon: Layers },
    { id: 'grades', label: 'Bảng Nhập Điểm Học Phần', icon: FileSpreadsheet },
    { id: 'profile', label: 'Hồ Sơ Giảng Viên', icon: User },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredStudents = students.filter(st => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase().trim();
    return (
      (st.studentId && st.studentId.toLowerCase().includes(q)) ||
      (st.fullName && st.fullName.toLowerCase().includes(q)) ||
      (st.className && st.className.toLowerCase().includes(q))
    );
  });

  const totalGradedCount = students.filter(st => {
    const entry = gradeSheet[st.studentId];
    return entry && (entry.isSaved || entry.gradeId);
  }).length;
  const gradeProgressPercent = students.length > 0 
    ? Math.round((totalGradedCount / students.length) * 100) 
    : 0;

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white overflow-hidden">
      {/* 🟢 TOP HEADER FOR TEACHER */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg transition"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="h-10 w-10 rounded-xl bg-emerald-600 items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/30 hidden sm:flex">
            👨‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">CỔNG THÔNG TIN GIẢNG VIÊN</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CỔNG GIẢNG VIÊN
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400">Hệ thống Quản lý Giảng dạy & Chấm điểm EduPortal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Teacher Identity Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">{teacherInfo?.fullName || 'Giảng Viên'}</div>
              <div className="text-[10px] text-emerald-400 font-mono font-medium">Mã GV: {teacherInfo?.teacherId || currentTeacherId}</div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {teacherInfo?.fullName ? teacherInfo.fullName.charAt(0) : 'T'}
            </div>
          </div>

          {/* Role Switcher if Admin testing */}
          {onRoleSwitch && (
            <button
              onClick={() => onRoleSwitch('ROLE_ADMIN')}
              className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 transition"
              title="Quay lại giao diện Admin"
            >
              👑 Trở về Admin
            </button>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition active:scale-95"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 🚀 MAIN BODY */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 📱 TEACHER SIDEBAR */}
        <aside className={`w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto shrink-0 fixed inset-y-0 left-0 z-40 md:static md:flex md:h-full transition-transform duration-200 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="space-y-6">
            {/* Teacher Mini Profile */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  {teacherInfo?.fullName ? teacherInfo.fullName.charAt(0) : 'T'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{teacherInfo?.fullName || 'Giảng Viên'}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{teacherInfo?.teacherId || currentTeacherId}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                <p>Khoa: <span className="text-slate-200 font-semibold">{teacherInfo?.facultyName || 'Công Nghệ Thông Tin'}</span></p>
                <p>Nhiệm vụ: <span className="text-emerald-400 font-semibold">Giảng dạy & Chấm điểm</span></p>
              </div>
            </div>

            {/* Nav links */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Danh Mục Giảng Dạy</p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Học kỳ 1 • Năm học 2026 - 2027</span>
          </div>
        </aside>

        {/* 📊 MAIN CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="panel-card p-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Học kỳ 1 • 2026 - 2027</span>
                <h2 className="text-2xl font-black text-white">
                  Kính chào Thầy/Cô {teacherInfo?.fullName || 'Giảng Viên'}! 👋
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Bảng điều khiển hỗ trợ theo dõi lịch dạy, thống kê học phần đứng lớp và nhập điểm thi nhanh chóng về phòng đào tạo.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="panel-card p-4 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Lớp Tín Chỉ Đang Dạy</span>
                  <div className="text-2xl font-black text-emerald-400">{classes.length} Lớp</div>
                  <p className="text-[10px] text-slate-500">Phân công học kỳ này</p>
                </div>

                <div className="panel-card p-4 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Tổng Số Sinh Viên</span>
                  <div className="text-2xl font-black text-cyan-400">{classes.reduce((sum, c) => sum + (c.enrolledCount || 0), 0)} SV</div>
                  <p className="text-[10px] text-slate-500">Đang theo học các lớp</p>
                </div>

                <div className="panel-card p-4 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Ca Dạy Trong Tuần</span>
                  <div className="text-2xl font-black text-amber-400">{schedules.length} Ca</div>
                  <p className="text-[10px] text-slate-500">Đã xếp lịch phòng học</p>
                </div>

                <div className="panel-card p-4 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Tiến Độ Nhập Điểm</span>
                  <div className="text-2xl font-black text-purple-400">{gradeProgressPercent}%</div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span>{totalGradedCount}/{students.length || 0} SV đã lưu</span>
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('grades')}
                  className="panel-card p-5 hover:border-emerald-500/50 hover:bg-slate-900/80 transition text-left space-y-2 group"
                >
                  <FileSpreadsheet className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-sm text-white">Nhập Điểm Học Phần Nhanh</h4>
                  <p className="text-xs text-slate-400">Mở danh sách sinh viên theo lớp và nhập điểm chuyên cần, giữa kỳ, cuối kỳ.</p>
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  className="panel-card p-5 hover:border-cyan-500/50 hover:bg-slate-900/80 transition text-left space-y-2 group"
                >
                  <Calendar className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-sm text-white">Xem Lịch Giảng Dạy Tuần</h4>
                  <p className="text-xs text-slate-400">Tra cứu ca dạy, phòng học và thời gian bắt đầu từ Thứ 2 đến Thứ 7.</p>
                </button>

                <button
                  onClick={() => setActiveTab('classes')}
                  className="panel-card p-5 hover:border-amber-500/50 hover:bg-slate-900/80 transition text-left space-y-2 group"
                >
                  <Layers className="h-6 w-6 text-amber-400 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-sm text-white">Quản Lý Lớp Học Phần</h4>
                  <p className="text-xs text-slate-400">Xem danh sách sinh viên đăng ký trong từng lớp tín chỉ.</p>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Lịch Giảng Dạy Tuần Của Giảng Viên</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Ca dạy, môn học và phòng học phân công trong học kỳ</p>
                </div>
                <button
                  onClick={loadTeacherData}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Làm mới lịch dạy"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {WEEKDAYS.map((day) => {
                  const daySchedules = schedules.filter(s => matchesDay(s, day.key));
                  return (
                    <div key={day.key} className="panel-card overflow-hidden flex flex-col">
                      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{day.label}</span>
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          {daySchedules.length} Ca dạy
                        </span>
                      </div>

                      <div className="p-3 space-y-3 flex-1">
                        {daySchedules.length === 0 ? (
                          <div className="h-28 flex items-center justify-center text-xs text-slate-500 italic">
                            Không có ca dạy
                          </div>
                        ) : (
                          daySchedules.map((s, idx) => (
                            <div
                              key={s.scheduleId || idx}
                              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-emerald-500/40 transition"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white truncate pr-2">
                                  {s.subjectName || s.creditClassName || `Lớp #${s.creditClassId}`}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 shrink-0">
                                  {msg.enum.shift[s.classShift] || s.classShift || s.studyTime || 'Ca Sáng'}
                                </span>
                              </div>

                              <div className="space-y-1 text-[11px] text-slate-400">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3 w-3 text-emerald-400 shrink-0" />
                                  <span>{s.studyTime || `${s.startDate || '07:30'} - ${s.endDate || '11:00'}`}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                                  <span>{s.roomName || s.roomId || 'Phòng Học B2-104'}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

                    {/* TAB 3: LỚP HỌC PHẦN ĐỨNG LỚP (QUẢN LÝ DANH SÁCH LỚP & ĐIỂM DANH) */}
          {activeTab === 'classes' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Quản Lý Lớp Học Phần Đứng Lớp</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Danh sách lớp tín chỉ được phân công, thông tin sinh viên và xuất danh sách điểm danh</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportAttendance}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-300 transition active:scale-95"
                  >
                    <Download className="h-4 w-4" />
                    <span>Xuất Danh Sách Điểm Danh (CSV)</span>
                  </button>
                </div>
              </div>

              {/* Grid of Assigned Classes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((c) => {
                  const isSelected = selectedClass?.creditClassId === c.creditClassId;
                  return (
                    <div
                      key={c.creditClassId}
                      className={`panel-card p-5 space-y-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-slate-900/90 shadow-md'
                          : 'hover:border-slate-700 bg-slate-950/60'
                      }`}
                      onClick={() => handleSelectClass(c)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-emerald-400">
                          Mã Lớp: #{c.creditClassId}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {c.semester || 'Học kỳ 1'}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {c.subjectName || c.creditClassName || `Môn học #${c.subjectId}`}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Số tín chỉ: <span className="text-slate-200 font-semibold">{c.credits || 3} TC</span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Sĩ số: <strong className="text-white">{c.enrolledCount || students.length || 0}</strong> / {c.maxStudents || 40} SV</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectClass(c);
                            setActiveTab('grades');
                          }}
                          className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                        >
                          <span>Nhập điểm</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Class Student Roster Table */}
              {selectedClass && (
                <div className="panel-card overflow-hidden space-y-0">
                  <div className="p-4 border-b border-slate-800 bg-slate-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white">
                        Danh Sách Sinh Viên: {selectedClass.subjectName || `Lớp #${selectedClass.creditClassId}`}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {students.length} Sinh viên
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Lọc sinh viên..."
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 w-40 sm:w-56"
                        />
                      </div>
                      <button
                        onClick={() => setActiveTab('grades')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto shrink-0"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Chấm điểm</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                        <tr>
                          <th className="px-5 py-3">Mã SV</th>
                          <th className="px-5 py-3">Họ và Tên</th>
                          <th className="px-5 py-3">Giới tính</th>
                          <th className="px-5 py-3">Lớp Hành Chính</th>
                          <th className="px-5 py-3">Trạng thái điểm danh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-5 py-6 text-center text-xs text-slate-500 italic">
                              Không tìm thấy sinh viên nào phù hợp với từ khóa "{studentSearch}"
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((st) => (
                            <tr key={st.studentId} className="hover:bg-slate-800/40 transition">
                              <td className="px-5 py-3 font-mono font-bold text-emerald-400">{st.studentId}</td>
                              <td className="px-5 py-3 font-semibold text-white truncate max-w-[180px] sm:max-w-[240px]" title={st.fullName}>{st.fullName}</td>
                              <td className="px-5 py-3 text-slate-400 capitalize">{msg.enum.gender[st.gender] || st.gender || 'Nam'}</td>
                              <td className="px-5 py-3 text-slate-300">{st.className || st.classId || 'CNTT-K65'}</td>
                              <td className="px-5 py-3">
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                  <CheckCheck className="h-3 w-3" /> Đủ điều kiện dự thi
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BẢNG NHẬP ĐIỂM HỌC PHẦN (CHUYÊN BIỆT CHẤM ĐIỂM THI) */}
          {activeTab === 'grades' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Bảng Nhập Điểm Học Phần</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Nhập điểm thành phần trực tiếp theo tỷ lệ chuẩn (10% - 30% - 60%) và lưu về phòng đào tạo</p>
                </div>

                {/* Class selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Chọn lớp:</span>
                  <select
                    value={selectedClass?.creditClassId || ''}
                    onChange={(e) => {
                      const found = classes.find(c => String(c.creditClassId) === e.target.value);
                      if (found) handleSelectClass(found);
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white px-3 py-2 focus:outline-none focus:border-emerald-500 transition"
                  >
                    {classes.map(c => (
                      <option key={c.creditClassId} value={c.creditClassId}>
                        Lớp #{c.creditClassId} - {c.subjectName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Grade Spreadsheet */}
              <div className="panel-card overflow-hidden flex flex-col justify-between">
                <div className="p-5 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        Bảng Nhập Điểm: {selectedClass?.subjectName || `Lớp #${selectedClass?.creditClassId}`}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {students.length} Sinh viên
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Nhập điểm số thang 10. Điểm tổng kết và điểm chữ sẽ được tính tự động</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Lọc sinh viên..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="pl-8 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 w-44 sm:w-52"
                      />
                    </div>

                    <button
                      onClick={handleExportGrades}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-300 transition active:scale-95"
                    >
                      <Download className="h-4 w-4" />
                      <span>Xuất Bảng Điểm (CSV)</span>
                    </button>

                    <button
                      onClick={handleSaveAllGrades}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition active:scale-95 self-start sm:self-auto"
                    >
                      <Save className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
                      <span>Lưu Toàn Bộ Điểm</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th className="px-5 py-3">Mã SV</th>
                        <th className="px-5 py-3">Họ và Tên</th>
                        <th className="px-5 py-3 text-center">Chuyên cần (10%)</th>
                        <th className="px-5 py-3 text-center">Giữa kỳ (30%)</th>
                        <th className="px-5 py-3 text-center">Thi cuối kỳ (60%)</th>
                        <th className="px-5 py-3 text-center font-bold">Tổng kết</th>
                        <th className="px-5 py-3 text-center font-bold">Điểm chữ</th>
                        <th className="px-5 py-3 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-5 py-6 text-center text-xs text-slate-500 italic">
                            Không tìm thấy sinh viên nào phù hợp với từ khóa "{studentSearch}"
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((st) => {
                          const entry = gradeSheet[st.studentId] || { attendanceScore: 10, midtermScore: 8, finalExamScore: 8 };
                          const finalScoreNum = ((entry.attendanceScore * 0.1) + (entry.midtermScore * 0.3) + (entry.finalExamScore * 0.6));
                          const finalScore = finalScoreNum.toFixed(1);
                          
                          let letterGrade = 'F';
                          if (finalScoreNum >= 8.5) letterGrade = 'A';
                          else if (finalScoreNum >= 8.0) letterGrade = 'B+';
                          else if (finalScoreNum >= 7.0) letterGrade = 'B';
                          else if (finalScoreNum >= 6.5) letterGrade = 'C+';
                          else if (finalScoreNum >= 5.5) letterGrade = 'C';
                          else if (finalScoreNum >= 5.0) letterGrade = 'D+';
                          else if (finalScoreNum >= 4.0) letterGrade = 'D';

                          return (
                            <tr key={st.studentId} className="hover:bg-slate-800/40 transition">
                              <td className="px-5 py-3 font-mono font-bold text-emerald-400">{st.studentId}</td>
                              <td className="px-5 py-3 font-semibold text-white truncate max-w-[180px] sm:max-w-[240px]" title={st.fullName}>{st.fullName}</td>
                              <td className="px-5 py-3 text-center">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  value={entry.attendanceScore ?? ''}
                                  onChange={(e) => handleGradeChange(st.studentId, 'attendanceScore', e.target.value)}
                                  className="w-16 px-2 py-1 text-center bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                              </td>
                              <td className="px-5 py-3 text-center">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  value={entry.midtermScore ?? ''}
                                  onChange={(e) => handleGradeChange(st.studentId, 'midtermScore', e.target.value)}
                                  className="w-16 px-2 py-1 text-center bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                              </td>
                              <td className="px-5 py-3 text-center">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  value={entry.finalExamScore ?? ''}
                                  onChange={(e) => handleGradeChange(st.studentId, 'finalExamScore', e.target.value)}
                                  className="w-16 px-2 py-1 text-center bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                              </td>
                              <td className="px-5 py-3 text-center font-mono font-bold text-white text-sm">
                                {finalScore}
                              </td>
                              <td className="px-5 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  letterGrade === 'A' ? 'bg-emerald-500/10 text-emerald-400' :
                                  letterGrade.startsWith('B') ? 'bg-indigo-500/10 text-indigo-400' :
                                  letterGrade.startsWith('C') ? 'bg-cyan-500/10 text-cyan-400' :
                                  letterGrade.startsWith('D') ? 'bg-amber-500/10 text-amber-400' :
                                  'bg-rose-500/10 text-rose-400'
                                }`}>
                                  {letterGrade}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {entry.isSaved ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      <CheckCheck className="w-3 h-3" /> Đã lưu
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      Chưa lưu
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleSaveSingleGrade(st)}
                                    title="Lưu điểm sinh viên này"
                                    className="p-1 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
                  <span>💡 Quy chuẩn: Chuyên cần (10%) + Giữa kỳ (30%) + Cuối kỳ (60%).</span>
                  <span className="font-semibold text-emerald-400">Đã kích hoạt tính điểm chữ tự động (A, B+, B, C, D, F)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div className="panel-card p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
                <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                  {teacherInfo?.fullName ? teacherInfo.fullName.charAt(0) : 'T'}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">{teacherInfo?.fullName || 'Giảng Viên'}</h2>
                  <p className="text-xs text-emerald-400 font-mono">Mã giảng viên: {teacherInfo?.teacherId || currentTeacherId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Khoa / Bộ môn công tác</span>
                  <p className="font-bold text-white text-sm">{teacherInfo?.facultyName || 'Khoa Công Nghệ Thông Tin'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Email công vụ giảng dạy</span>
                  <p className="font-bold text-white text-sm">{teacherInfo?.email || `${currentTeacherId.toLowerCase()}@eduportal.edu.vn`}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Trạng thái công tác</span>
                  <p className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Đang giảng dạy chính thức
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Phân quyền hệ thống</span>
                  <p className="font-bold text-indigo-400 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Cổng Giảng Viên (ROLE_TEACHER)
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
