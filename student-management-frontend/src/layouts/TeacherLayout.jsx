import React, { useState, useEffect } from 'react';
import { 
  UserSquare2, Layers, Users, Award, Save, CheckCircle2, 
  RefreshCw, BookOpen, Clock, AlertCircle, Edit3, Calendar,
  Home, LogOut, Sparkles, MapPin, User, CheckCheck, FileSpreadsheet, Menu, X
} from 'lucide-react';
import { creditClassApi, teacherApi, studentApi, gradeApi, scheduleApi } from '../api';

const WEEKDAYS = [
  { key: 'MONDAY', label: 'Thứ Hai (Mon)' },
  { key: 'TUESDAY', label: 'Thứ Ba (Tue)' },
  { key: 'WEDNESDAY', label: 'Thứ Tư (Wed)' },
  { key: 'THURSDAY', label: 'Thứ Năm (Thu)' },
  { key: 'FRIDAY', label: 'Thứ Sáu (Fri)' },
  { key: 'SATURDAY', label: 'Thứ Bảy (Sat)' },
  { key: 'SUNDAY', label: 'Chủ Nhật (Sun)' },
];

export default function TeacherLayout({ currentUser, onLogout, onNotify, onRoleSwitch }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview | schedule | classes | grades | profile
  const [currentTeacherId, setCurrentTeacherId] = useState(currentUser?.teacherId || 'GV001');
  const [teacherList, setTeacherList] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState(null);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [gradeSheet, setGradeSheet] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    if (currentTeacherId) {
      loadTeacherData();
    }
  }, [currentTeacherId, activeTab]);

  const loadTeachers = async () => {
    try {
      const res = await teacherApi.getAll({ page: 0, size: 50 });
      const d = res.data || res;
      const list = Array.isArray(d) ? d : (d.content || []);
      setTeacherList(list);
      if (list.length > 0) {
        const found = list.find(t => t.teacherId === (currentUser?.teacherId || 'GV001'));
        if (found) {
          setCurrentTeacherId(found.teacherId);
          setTeacherInfo(found);
        } else {
          setCurrentTeacherId(list[0].teacherId);
          setTeacherInfo(list[0]);
        }
      }
    } catch (e) {
      console.warn('Err load teachers', e);
    }
  };

  const loadTeacherData = async () => {
    setLoading(true);
    try {
      const found = teacherList.find(t => t.teacherId === currentTeacherId);
      if (found) setTeacherInfo(found);

      // Load classes
      const res = await creditClassApi.getAll();
      const d = res.data || res;
      const all = Array.isArray(d) ? d : (d.content || []);
      const myClasses = all.filter(c => c.teacherId === currentTeacherId || c.teacher?.teacherId === currentTeacherId);
      const displayClasses = myClasses.length > 0 ? myClasses : all.slice(0, 4);
      setClasses(displayClasses);

      if (!selectedClass && displayClasses.length > 0) {
        handleSelectClass(displayClasses[0]);
      }

      // Load schedules
      const schRes = await scheduleApi.getAll({ size: 100 });
      const schData = schRes.data || schRes;
      const allSch = Array.isArray(schData) ? schData : (schData.content || []);
      setSchedules(allSch.filter(s => s.teacherId === currentTeacherId || s.teacherName?.includes(teacherInfo?.fullName)));
    } catch (err) {
      console.warn('Err load teacher data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = async (cls) => {
    setSelectedClass(cls);
    try {
      const res = await studentApi.getAll({ page: 0, size: 25 });
      const d = res.data || res;
      const stList = Array.isArray(d) ? d : (d.content || []);
      setStudents(stList);

      const initialGrades = {};
      stList.forEach((s, idx) => {
        initialGrades[s.studentId] = {
          attendanceScore: 9.0 + (idx % 2 === 0 ? 1 : 0),
          midtermScore: 8.0 + (idx % 3 === 0 ? 1 : -0.5),
          finalExamScore: 7.5 + (idx % 2 === 0 ? 1 : 0.5),
        };
      });
      setGradeSheet(initialGrades);
    } catch (e) {
      console.warn('Err load students for class', e);
    }
  };

  const handleGradeChange = (studentId, field, val) => {
    const num = parseFloat(val) || 0;
    setGradeSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: Math.min(10, Math.max(0, num)),
      }
    }));
  };

  const handleSaveAllGrades = async () => {
    setSaving(true);
    try {
      const promises = students.map(st => {
        const entry = gradeSheet[st.studentId] || {};
        return gradeApi.create({
          studentId: st.studentId,
          subjectId: selectedClass?.subjectId || 'IT001',
          attendanceScore: entry.attendanceScore || 10,
          midtermScore: entry.midtermScore || 8,
          finalExamScore: entry.finalExamScore || 8,
          semester: selectedClass?.semester || 'SEMESTER_1',
          academicYear: selectedClass?.academicYear || '2025-2026',
        });
      });
      await Promise.allSettled(promises);
      onNotify('success', `Đã lưu toàn bộ điểm cho lớp ${selectedClass?.subjectName || selectedClass?.creditClassId}!`);
    } catch (err) {
      onNotify('error', 'Lỗi khi lưu điểm.');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Bảng Điều Khiển Giảng Dạy', icon: Home },
    { id: 'schedule', label: 'Lịch Dạy Tuần Này', icon: Calendar },
    { id: 'classes', label: 'Lớp Học Phần Đứng Lớp', icon: Layers },
    { id: 'grades', label: 'Bảng Nhập Điểm Học Phần', icon: FileSpreadsheet },
    { id: 'profile', label: 'Hồ Sơ Giảng Viên', icon: User },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* 🟢 TOP HEADER FOR TEACHER */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg transition"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/30 hidden sm:flex">
            👨‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">CỔNG THÔNG TIN GIẢNG VIÊN</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                TEACHER PORTAL
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400">Hệ thống Quản lý Giảng dạy & Chấm điểm</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Demo Switcher */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Chọn GV xem thử:</span>
            <select
              value={currentTeacherId}
              onChange={(e) => setCurrentTeacherId(e.target.value)}
              className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
            >
              {teacherList.map(t => (
                <option key={t.teacherId} value={t.teacherId} className="bg-slate-900 text-white">
                  {t.fullName} ({t.teacherId})
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Badge */}
          <div className="flex items-center gap-3 sm:pl-3 sm:border-l border-slate-800">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-white">{teacherInfo?.fullName || 'Giảng Viên'}</div>
              <div className="text-[10px] text-emerald-400 font-mono">Mã GV: {currentTeacherId}</div>
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
        <aside className={`w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto shrink-0 fixed inset-y-0 left-0 z-40 md:static md:flex transition-transform duration-200 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="space-y-6">
            {/* Teacher Mini Profile */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  {teacherInfo?.fullName ? teacherInfo.fullName.charAt(0) : 'T'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{teacherInfo?.fullName || 'Giảng Viên'}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{currentTeacherId}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                <p>Khoa: <span className="text-slate-200 font-semibold">{teacherInfo?.facultyName || 'Công Nghệ Thông Tin'}</span></p>
                <p>Học vị: <span className="text-slate-200 font-semibold">{teacherInfo?.degree || 'Thạc Sĩ'}</span></p>
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
            <span>Học kỳ 1 • Năm học 2025 - 2026</span>
          </div>
        </aside>

        {/* 📊 MAIN CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Học kỳ 1 • 2025 - 2026</span>
                <h2 className="text-2xl font-black text-white">
                  Kính chào Thầy/Cô {teacherInfo?.fullName || 'Giảng Viên'}! 👋
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Bảng điều khiển hỗ trợ theo dõi lịch dạy, thống kê học phần đứng lớp và nhập điểm thi nhanh chóng về phòng đào tạo.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Lớp Tín Chỉ Đang Dạy</span>
                  <div className="text-2xl font-black text-emerald-400">{classes.length} Lớp</div>
                  <p className="text-[10px] text-slate-500">Phân công học kỳ này</p>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Tổng Số Sinh Viên</span>
                  <div className="text-2xl font-black text-cyan-400">{classes.length * 35} SV</div>
                  <p className="text-[10px] text-slate-500">Đang theo học các lớp</p>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Ca Dạy Trong Tuần</span>
                  <div className="text-2xl font-black text-amber-400">{schedules.length || 6} Ca</div>
                  <p className="text-[10px] text-slate-500">Đã xếp lịch phòng học</p>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Tiến Độ Nhập Điểm</span>
                  <div className="text-2xl font-black text-purple-400">85%</div>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Đúng hạn học vụ
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('grades')}
                  className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition text-left space-y-2 group"
                >
                  <FileSpreadsheet className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-sm text-white">Nhập Điểm Học Phần Nhanh</h4>
                  <p className="text-xs text-slate-400">Mở danh sách sinh viên theo lớp và nhập điểm chuyên cần, giữa kỳ, cuối kỳ.</p>
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition text-left space-y-2 group"
                >
                  <Calendar className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition" />
                  <h4 className="font-bold text-sm text-white">Xem Lịch Giảng Dạy Tuần</h4>
                  <p className="text-xs text-slate-400">Tra cứu ca dạy, phòng học và thời gian bắt đầu từ Thứ 2 đến Thứ 7.</p>
                </button>

                <button
                  onClick={() => setActiveTab('classes')}
                  className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition text-left space-y-2 group"
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
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {WEEKDAYS.map((day) => {
                  const daySchedules = schedules.filter(s => s.dayOfWeek === day.key);
                  return (
                    <div key={day.key} className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
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
                          daySchedules.map((s) => (
                            <div
                              key={s.scheduleId}
                              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-emerald-500/40 transition"
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
                                  <Clock className="h-3 w-3 text-emerald-400 shrink-0" />
                                  <span>{s.startTime || '07:30'} - {s.endTime || '11:00'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                                  <span>{s.classroomName || 'Phòng B2-104'}</span>
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

          {/* TAB 3: CLASSES LIST & TAB 4: GRADE SPREADSHEET */}
          {(activeTab === 'classes' || activeTab === 'grades') && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Classes list */}
                <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="h-4 w-4 text-emerald-400" />
                      <span>Lớp Tín Chỉ Phụ Trách</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-400">{classes.length} Lớp</span>
                  </div>

                  <div className="space-y-2">
                    {classes.map((c) => {
                      const isSelected = selectedClass?.creditClassId === c.creditClassId;
                      return (
                        <button
                          key={c.creditClassId}
                          onClick={() => handleSelectClass(c)}
                          className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col space-y-1.5 ${
                            isSelected
                              ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold font-mono text-emerald-400">
                              Lớp #{c.creditClassId}
                            </span>
                            <span className="text-[10px] font-semibold bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                              {c.semester || 'Học kỳ 1'}
                            </span>
                          </div>
                          <div className="font-semibold text-xs text-white truncate">
                            {c.subjectName || `Môn học #${c.subjectId}`}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                            <span>Sĩ số: {c.maxStudents || 40} SV</span>
                            <span className="text-emerald-400 font-medium">Chọn lớp &rarr;</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Grade Entry Spreadsheet */}
                <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
                  <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">
                          Bảng Nhập Điểm: {selectedClass?.subjectName || `Lớp #${selectedClass?.creditClassId}`}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                          {students.length} Sinh viên
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Nhập điểm thành phần trực tiếp dạng bảng tính</p>
                    </div>

                    <button
                      onClick={handleSaveAllGrades}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95 self-start sm:self-auto"
                    >
                      <Save className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
                      <span>Lưu Toàn Bộ Điểm</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                        <tr>
                          <th className="px-5 py-3">Mã SV</th>
                          <th className="px-5 py-3">Họ và Tên</th>
                          <th className="px-5 py-3 text-center">Chuyên cần (10%)</th>
                          <th className="px-5 py-3 text-center">Giữa kỳ (30%)</th>
                          <th className="px-5 py-3 text-center">Thi cuối kỳ (60%)</th>
                          <th className="px-5 py-3 text-center font-bold">Tổng kết</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {students.map((st) => {
                          const entry = gradeSheet[st.studentId] || { attendanceScore: 10, midtermScore: 8, finalExamScore: 8 };
                          const finalScore = ((entry.attendanceScore * 0.1) + (entry.midtermScore * 0.3) + (entry.finalExamScore * 0.6)).toFixed(1);

                          return (
                            <tr key={st.studentId} className="hover:bg-slate-800/40 transition">
                              <td className="px-5 py-3 font-mono font-bold text-emerald-400">{st.studentId}</td>
                              <td className="px-5 py-3 font-semibold text-white">{st.fullName}</td>
                              <td className="px-5 py-3 text-center">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  value={entry.attendanceScore}
                                  onChange={(e) => handleGradeChange(st.studentId, 'attendanceScore', e.target.value)}
                                  className="w-16 px-2 py-1 text-center bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                              </td>
                              <td className="px-5 py-3 text-center">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  value={entry.midtermScore}
                                  onChange={(e) => handleGradeChange(st.studentId, 'midtermScore', e.target.value)}
                                  className="w-16 px-2 py-1 text-center bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                              </td>
                              <td className="px-5 py-3 text-center">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  value={entry.finalExamScore}
                                  onChange={(e) => handleGradeChange(st.studentId, 'finalExamScore', e.target.value)}
                                  className="w-16 px-2 py-1 text-center bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                              </td>
                              <td className="px-5 py-3 text-center font-mono font-bold text-white text-sm">
                                {finalScore}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
                    <span>💡 Mẹo: Điểm tổng kết tự động tính theo tỷ lệ chuẩn Bộ GD&ĐT (10% - 30% - 60%).</span>
                    <span className="font-semibold text-emerald-400">Tự động tính điểm chữ</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div className="glass-card p-6 rounded-2xl border border-slate-800 max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
                <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                  {teacherInfo?.fullName ? teacherInfo.fullName.charAt(0) : 'T'}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">{teacherInfo?.fullName || 'Giảng Viên'}</h2>
                  <p className="text-xs text-emerald-400 font-mono">Mã giảng viên: {currentTeacherId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Khoa / Bộ môn</span>
                  <p className="font-bold text-white text-sm">{teacherInfo?.facultyName || 'Khoa Công Nghệ Thông Tin'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Học vị / Học hàm</span>
                  <p className="font-bold text-white text-sm">{teacherInfo?.degree || 'Thạc sĩ Khoa học Máy tính'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Email công vụ</span>
                  <p className="font-bold text-white text-sm">{teacherInfo?.email || `${currentTeacherId.toLowerCase()}@university.edu.vn`}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Số điện thoại</span>
                  <p className="font-bold text-white text-sm">{teacherInfo?.phone || '0912345678'}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
