import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Award, Calendar, BookOpen, Layers, CheckCircle2, 
  XCircle, Clock, MapPin, User, ChevronRight, Sparkles, Filter, 
  AlertCircle, ArrowRight, RefreshCw, Plus, Trash2, Home, LogOut,
  Bell, FileText, CheckCheck, UserCheck, Shield, HelpCircle
} from 'lucide-react';
import { gradeApi, scheduleApi, creditClassApi, studentApi } from '../api';

const WEEKDAYS = [
  { key: 'MONDAY', label: 'Thứ Hai (Mon)' },
  { key: 'TUESDAY', label: 'Thứ Ba (Tue)' },
  { key: 'WEDNESDAY', label: 'Thứ Tư (Wed)' },
  { key: 'THURSDAY', label: 'Thứ Năm (Thu)' },
  { key: 'FRIDAY', label: 'Thứ Sáu (Fri)' },
  { key: 'SATURDAY', label: 'Thứ Bảy (Sat)' },
  { key: 'SUNDAY', label: 'Chủ Nhật (Sun)' },
];

export default function StudentLayout({ currentUser, onLogout, onNotify, onRoleSwitch }) {
  const [activeTab, setActiveTab] = useState('home'); // home | transcript | timetable | registration | profile
  const [currentStudentId, setCurrentStudentId] = useState(currentUser?.studentId || 'SV001');
  const [studentList, setStudentList] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  // Data states
  const [grades, setGrades] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [creditClasses, setCreditClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (currentStudentId) {
      loadStudentPortalData();
    }
  }, [currentStudentId, activeTab]);

  const loadStudents = async () => {
    try {
      const res = await studentApi.getAll({ page: 0, size: 50 });
      const d = res.data || res;
      const list = Array.isArray(d) ? d : (d.content || []);
      setStudentList(list);
      if (list.length > 0) {
        const found = list.find(s => s.studentId === (currentUser?.studentId || 'SV001'));
        if (found) {
          setCurrentStudentId(found.studentId);
          setStudentInfo(found);
        } else {
          setCurrentStudentId(list[0].studentId);
          setStudentInfo(list[0]);
        }
      }
    } catch (e) {
      console.warn('Err load students', e);
    }
  };

  const loadStudentPortalData = async () => {
    setLoading(true);
    try {
      const found = studentList.find(s => s.studentId === currentStudentId);
      if (found) setStudentInfo(found);

      if (activeTab === 'home' || activeTab === 'transcript') {
        const res = await gradeApi.getAll({ studentId: currentStudentId, size: 100 });
        const d = res.data || res;
        setGrades(Array.isArray(d) ? d : (d.content || []));
      }
      if (activeTab === 'home' || activeTab === 'timetable') {
        const res = await scheduleApi.getAll({ size: 100 });
        const d = res.data || res;
        setSchedules(Array.isArray(d) ? d : (d.content || []));
      }
      if (activeTab === 'registration') {
        const res = await creditClassApi.getAll();
        const d = res.data || res;
        setCreditClasses(Array.isArray(d) ? d : (d.content || []));
      }
    } catch (err) {
      console.warn('Err load portal data', err);
    } finally {
      setLoading(false);
    }
  };

  // GPA Calculations
  const calculateGPA = () => {
    if (!grades || grades.length === 0) {
      return { gpa10: 0, gpa4: 0, totalCredits: 0, rank: 'Chưa có điểm' };
    }
    let totalScore10 = 0;
    let count = 0;
    grades.forEach(g => {
      const score = g.totalScore10 ?? ((g.attendanceScore * 0.1) + (g.midtermScore * 0.3) + (g.finalExamScore * 0.6));
      if (!isNaN(score)) {
        totalScore10 += score;
        count++;
      }
    });
    const avg10 = count > 0 ? (totalScore10 / count) : 0;
    const avg4 = (avg10 / 10) * 4;

    let rank = 'Trung bình';
    if (avg4 >= 3.6) rank = 'Xuất sắc';
    else if (avg4 >= 3.2) rank = 'Giỏi';
    else if (avg4 >= 2.5) rank = 'Khá';
    else if (avg4 < 2.0) rank = 'Cảnh báo học vụ';

    return {
      gpa10: avg10.toFixed(2),
      gpa4: avg4.toFixed(2),
      totalCredits: grades.length * 3,
      rank
    };
  };

  const gpaSummary = calculateGPA();

  const handleEnroll = async (creditClassId) => {
    setActionLoading(true);
    try {
      await creditClassApi.addStudent(creditClassId, currentStudentId);
      onNotify('success', `Đăng ký thành công lớp tín chỉ #${creditClassId}!`);
      loadStudentPortalData();
    } catch (err) {
      onNotify('error', err?.message || 'Không thể đăng ký môn học.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDrop = async (creditClassId) => {
    setActionLoading(true);
    try {
      await creditClassApi.removeStudent(creditClassId, currentStudentId);
      onNotify('info', `Đã hủy đăng ký lớp tín chỉ #${creditClassId}.`);
      loadStudentPortalData();
    } catch (err) {
      onNotify('error', err?.message || 'Không thể hủy môn học.');
    } finally {
      setActionLoading(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'Trang Chủ Học Tập', icon: Home },
    { id: 'transcript', label: 'Bảng Điểm & Kết Quả GPA', icon: Award },
    { id: 'timetable', label: 'Thời Khóa Biểu Tuần', icon: Calendar },
    { id: 'registration', label: 'Đăng Ký Học Phần Tín Chỉ', icon: Layers },
    { id: 'profile', label: 'Hồ Sơ Sinh Viên', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 🟢 TOP HEADER FOR STUDENT */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/30">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">CỔNG THÔNG TIN SINH VIÊN</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                STUDENT PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Hệ thống Quản lý Đào tạo Đại học</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Switcher Demo if needed */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Chọn SV xem thử:</span>
            <select
              value={currentStudentId}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              className="bg-transparent text-indigo-400 font-bold focus:outline-none cursor-pointer"
            >
              {studentList.map(s => (
                <option key={s.studentId} value={s.studentId} className="bg-slate-900 text-white">
                  {s.fullName} ({s.studentId})
                </option>
              ))}
            </select>
          </div>

          {/* User badge */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-white">{studentInfo?.fullName || 'Sinh Viên'}</div>
              <div className="text-[10px] text-slate-400 font-mono">MSSV: {currentStudentId}</div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {studentInfo?.fullName ? studentInfo.fullName.charAt(0) : 'S'}
            </div>
          </div>

          {/* Role Switcher if Admin testing */}
          {onRoleSwitch && (
            <button
              onClick={() => onRoleSwitch('ROLE_ADMIN')}
              className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 transition"
              title="Quay lại giao diện Admin"
            >
              👑 Trở về Admin
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition active:scale-95"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 🚀 MAIN BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* 📱 STUDENT SIDEBAR */}
        <aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto hidden md:flex shrink-0">
          <div className="space-y-6">
            {/* Student Mini Profile Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  {studentInfo?.fullName ? studentInfo.fullName.charAt(0) : 'S'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{studentInfo?.fullName || 'Sinh Viên'}</div>
                  <div className="text-[10px] text-indigo-400 font-mono">{currentStudentId}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                <p>Lớp: <span className="text-slate-200 font-semibold">{studentInfo?.className || 'CNTT-K21'}</span></p>
                <p>Khoa: <span className="text-slate-200 font-semibold">{studentInfo?.facultyName || 'Công Nghệ Thông Tin'}</span></p>
              </div>
            </div>

            {/* Nav links */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Danh Mục Sinh Viên</p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
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

          {/* Footer note */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Niên khóa 2025 - 2026 • Học kỳ 1</span>
          </div>
        </aside>

        {/* 📊 MAIN CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* TAB 1: HOME OVERVIEW */}
          {activeTab === 'home' && (
            <div className="space-y-6 animate-fade-in">
              {/* Welcome Banner */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Học kỳ 1 • 2025 - 2026</span>
                <h2 className="text-2xl font-black text-white">
                  Xin chào, {studentInfo?.fullName || 'Sinh Viên'}! 👋
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Chào mừng bạn đến với Cổng thông tin học tập cá nhân. Theo dõi kết quả học tập, thời khóa biểu và đăng ký môn học trực tuyến nhanh chóng.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">GPA Tích Lũy (Hệ 4.0)</span>
                  <div className="text-2xl font-black text-indigo-400">{gpaSummary.gpa4} / 4.0</div>
                  <p className="text-[10px] text-slate-500">Xếp loại: {gpaSummary.rank}</p>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Điểm Tổng Kết (Hệ 10)</span>
                  <div className="text-2xl font-black text-emerald-400">{gpaSummary.gpa10} / 10.0</div>
                  <p className="text-[10px] text-slate-500">Đạt chuẩn tốt nghiệp</p>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Học Phần Đã Đăng Ký</span>
                  <div className="text-2xl font-black text-amber-400">{grades.length} Môn</div>
                  <p className="text-[10px] text-slate-500">{gpaSummary.totalCredits} tín chỉ tích lũy</p>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Tình Trạng Học Vụ</span>
                  <div className="text-2xl font-black text-cyan-400">Bình Thường</div>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Đủ điều kiện học tiếp
                  </p>
                </div>
              </div>

              {/* Quick Actions / Shortcuts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('transcript')}
                  className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition text-left space-y-2 group"
                >
                  <Award className="h-6 w-6 text-indigo-400 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-sm text-white">Tra Cứu Bảng Điểm & GPA</h4>
                  <p className="text-xs text-slate-400">Xem chi tiết điểm thành phần, điểm chuyên cần, giữa kỳ và thi cuối kỳ.</p>
                </button>

                <button
                  onClick={() => setActiveTab('timetable')}
                  className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition text-left space-y-2 group"
                >
                  <Calendar className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-sm text-white">Xem Lịch Học & Phòng Học</h4>
                  <p className="text-xs text-slate-400">Lịch học trong tuần, ca sáng / chiều và phòng học được phân công.</p>
                </button>

                <button
                  onClick={() => setActiveTab('registration')}
                  className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition text-left space-y-2 group"
                >
                  <Layers className="h-6 w-6 text-amber-400 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-sm text-white">Đăng Ký Lớp Tín Chỉ</h4>
                  <p className="text-xs text-slate-400">Xem danh sách các lớp mở trong học kỳ và bấm đăng ký trực tuyến.</p>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Bảng Điểm Cá Nhân & Kết Quả GPA</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Chi tiết kết quả học tập của sinh viên {studentInfo?.fullName} ({currentStudentId})</p>
                </div>
                <button
                  onClick={loadStudentPortalData}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
              </div>

              {/* Detailed Grades Table */}
              <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th className="px-5 py-3.5">Học phần / Môn học</th>
                        <th className="px-5 py-3.5">Học kỳ</th>
                        <th className="px-5 py-3.5 text-center">Chuyên cần (10%)</th>
                        <th className="px-5 py-3.5 text-center">Giữa kỳ (30%)</th>
                        <th className="px-5 py-3.5 text-center">Thi cuối kỳ (60%)</th>
                        <th className="px-5 py-3.5 text-center font-bold">Tổng kết (10)</th>
                        <th className="px-5 py-3.5 text-center">Điểm chữ</th>
                        <th className="px-5 py-3.5 text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {grades.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                            Chưa có dữ liệu điểm học tập cho sinh viên này.
                          </td>
                        </tr>
                      ) : (
                        grades.map((g) => {
                          const final10 = g.totalScore10 ?? ((g.attendanceScore * 0.1) + (g.midtermScore * 0.3) + (g.finalExamScore * 0.6));
                          const isPass = final10 >= 4.0;
                          return (
                            <tr key={g.gradeId} className="hover:bg-slate-800/40 transition">
                              <td className="px-5 py-3.5 font-semibold text-white">
                                {g.subjectName || g.subjectId}
                              </td>
                              <td className="px-5 py-3.5 text-slate-400">
                                {g.semester || 'Học kỳ 1'} ({g.academicYear || '2025-2026'})
                              </td>
                              <td className="px-5 py-3.5 text-center font-mono text-slate-300">{g.attendanceScore ?? '-'}</td>
                              <td className="px-5 py-3.5 text-center font-mono text-slate-300">{g.midtermScore ?? '-'}</td>
                              <td className="px-5 py-3.5 text-center font-mono text-slate-300">{g.finalExamScore ?? '-'}</td>
                              <td className="px-5 py-3.5 text-center font-mono font-bold text-white text-sm">
                                {typeof final10 === 'number' ? final10.toFixed(1) : final10}
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                  g.letterGrade === 'A' || g.letterGrade === 'A+' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  g.letterGrade === 'B' || g.letterGrade === 'B+' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                  g.letterGrade === 'C' || g.letterGrade === 'C+' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {g.letterGrade || 'B'}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isPass ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                }`}>
                                  {isPass ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                  {isPass ? 'Đạt' : 'Học lại'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMETABLE */}
          {activeTab === 'timetable' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Thời Khóa Biểu Tuần Trực Quan</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Lịch học các ca trong tuần của sinh viên</p>
                </div>
                <button
                  onClick={loadStudentPortalData}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {WEEKDAYS.map((day) => {
                  const daySchedules = schedules.filter(s => s.dayOfWeek === day.key);
                  return (
                    <div key={day.key} className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
                      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{day.label}</span>
                        <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                          {daySchedules.length} Ca học
                        </span>
                      </div>

                      <div className="p-3 space-y-3 flex-1">
                        {daySchedules.length === 0 ? (
                          <div className="h-28 flex items-center justify-center text-xs text-slate-500 italic">
                            Không có lịch học
                          </div>
                        ) : (
                          daySchedules.map((s) => (
                            <div
                              key={s.scheduleId}
                              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-indigo-500/40 transition"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white truncate pr-2">
                                  {s.subjectName || `Lớp #${s.creditClassId}`}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 shrink-0">
                                  {s.shift || 'Ca Sáng'}
                                </span>
                              </div>

                              <div className="space-y-1 text-[11px] text-slate-400">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3 w-3 text-indigo-400 shrink-0" />
                                  <span>{s.startTime || '07:30'} - {s.endTime || '11:00'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                                  <span>{s.classroomName || 'Phòng A1-203'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3 w-3 text-amber-400 shrink-0" />
                                  <span className="truncate">{s.teacherName || 'Giảng viên'}</span>
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

          {/* TAB 4: COURSE REGISTRATION */}
          {activeTab === 'registration' && (
            <div className="space-y-4 animate-fade-in">
              <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60">
                <div>
                  <h3 className="text-sm font-bold text-white">Đăng Ký Học Phần Tín Chỉ Trực Tuyến</h3>
                  <p className="text-xs text-slate-400">Học kỳ 1 (2025 - 2026) • Đăng ký vào các lớp tín chỉ còn chỗ</p>
                </div>
                <button
                  onClick={loadStudentPortalData}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition self-start sm:self-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creditClasses.map((cc) => {
                  const enrolledList = cc.students || cc.studentIds || [];
                  const isEnrolled = enrolledList.some(
                    s => (typeof s === 'string' ? s === currentStudentId : s.studentId === currentStudentId)
                  );
                  const maxSeats = cc.maxStudents || 40;
                  const currentSeats = enrolledList.length;
                  const isFull = currentSeats >= maxSeats;

                  return (
                    <div
                      key={cc.creditClassId}
                      className={`glass-card p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                        isEnrolled
                          ? 'border-indigo-500/50 bg-indigo-950/20'
                          : 'border-slate-800 bg-slate-900/40'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-indigo-400">
                            Mã Lớp: #{cc.creditClassId}
                          </span>
                          {isEnrolled ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Đã Đăng Ký
                            </span>
                          ) : isFull ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Hết Chỗ
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                              Còn Chỗ
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white">
                          {cc.subjectName || cc.subject?.subjectName || `Môn học #${cc.subjectId}`}
                        </h4>

                        <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                          <div className="flex items-center justify-between">
                            <span>Giảng viên:</span>
                            <span className="text-slate-200 font-medium">{cc.teacherName || 'Chưa phân công'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Học kỳ:</span>
                            <span className="text-slate-200">{cc.semester || 'Học kỳ 1'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Sĩ số:</span>
                            <span className="font-mono text-slate-200 font-bold">{currentSeats} / {maxSeats}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800">
                        {isEnrolled ? (
                          <button
                            onClick={() => handleDrop(cc.creditClassId)}
                            disabled={actionLoading}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 transition active:scale-95"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Hủy Môn Này</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnroll(cc.creditClassId)}
                            disabled={actionLoading || isFull}
                            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition active:scale-95 ${
                              isFull
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                            }`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Đăng Ký Học Phần</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div className="glass-card p-6 rounded-2xl border border-slate-800 max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
                <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                  {studentInfo?.fullName ? studentInfo.fullName.charAt(0) : 'S'}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">{studentInfo?.fullName || 'Sinh Viên'}</h2>
                  <p className="text-xs text-indigo-400 font-mono">Mã số sinh viên: {currentStudentId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Lớp sinh hoạt</span>
                  <p className="font-bold text-white text-sm">{studentInfo?.className || 'CNTT-K21'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Khoa / Ngành đào tạo</span>
                  <p className="font-bold text-white text-sm">{studentInfo?.facultyName || 'Khoa Công Nghệ Thông Tin'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Khóa học</span>
                  <p className="font-bold text-white text-sm">{studentInfo?.academicYear || '2022 - 2026'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Trạng thái sinh viên</span>
                  <p className="font-bold text-emerald-400 text-sm">Đang theo học (Active)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Email liên hệ</span>
                  <p className="font-bold text-white text-sm">{studentInfo?.email || `${currentStudentId.toLowerCase()}@student.edu.vn`}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Số điện thoại</span>
                  <p className="font-bold text-white text-sm">{studentInfo?.phone || '0987654321'}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
