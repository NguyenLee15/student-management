import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Award, Calendar, BookOpen, Layers, CheckCircle2, 
  XCircle, Clock, MapPin, User, ChevronRight, Sparkles, Filter, 
  AlertCircle, ArrowRight, RefreshCw, Plus, Trash2
} from 'lucide-react';
import { gradeApi, scheduleApi, creditClassApi, studentApi } from '../../api';

const WEEKDAYS = [
  { key: 'MONDAY', label: 'Thứ Hai (Mon)' },
  { key: 'TUESDAY', label: 'Thứ Ba (Tue)' },
  { key: 'WEDNESDAY', label: 'Thứ Tư (Wed)' },
  { key: 'THURSDAY', label: 'Thứ Năm (Thu)' },
  { key: 'FRIDAY', label: 'Thứ Sáu (Fri)' },
  { key: 'SATURDAY', label: 'Thứ Bảy (Sat)' },
  { key: 'SUNDAY', label: 'Chủ Nhật (Sun)' },
];

export default function StudentPortalModule({ onNotify, currentUser }) {
  const [activeSubTab, setActiveSubTab] = useState('transcript'); // transcript | timetable | registration
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
  }, [currentStudentId, activeSubTab]);

  const loadStudents = async () => {
    try {
      const res = await studentApi.getAll({ page: 0, size: 50 });
      const d = res.data || res;
      const list = Array.isArray(d) ? d : (d.content || []);
      setStudentList(list);
      if (list.length > 0 && !currentUser?.studentId) {
        setCurrentStudentId(list[0].studentId);
      }
    } catch (e) {
      console.warn('Err load students', e);
    }
  };

  const loadStudentPortalData = async () => {
    setLoading(true);
    try {
      // Find current student info
      const found = studentList.find(s => s.studentId === currentStudentId);
      setStudentInfo(found || { studentId: currentStudentId, fullName: 'Unknown Student' });

      if (activeSubTab === 'transcript') {
        const res = await gradeApi.getAll({ studentId: currentStudentId, size: 100 });
        const d = res.data || res;
        setGrades(Array.isArray(d) ? d : (d.content || []));
      } else if (activeSubTab === 'timetable') {
        const res = await scheduleApi.getAll({ size: 100 });
        const d = res.data || res;
        setSchedules(Array.isArray(d) ? d : (d.content || []));
      } else if (activeSubTab === 'registration') {
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
      return { gpa10: 0, gpa4: 0, totalCredits: 0, rank: 'N/A' };
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
      totalCredits: grades.length * 3, // estimation
      rank
    };
  };

  const gpaSummary = calculateGPA();

  // Registration Actions
  const handleEnroll = async (creditClassId) => {
    setActionLoading(true);
    try {
      await creditClassApi.addStudent(creditClassId, currentStudentId);
      onNotify('success', `Đã đăng ký thành công lớp tín chỉ #${creditClassId}!`);
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

  return (
    <div className="space-y-6">
      {/* Portal Top Header & Student Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30">
            {studentInfo?.fullName ? studentInfo.fullName.charAt(0) : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">
                {studentInfo?.fullName || 'Sinh Viên'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentStudentId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cổng dịch vụ sinh viên • Tra cứu kết quả học tập, lịch học và đăng ký tín chỉ
            </p>
          </div>
        </div>

        {/* Demo Switcher for Testing/Grading (Admin Only) */}
        {currentUser?.role === 'ROLE_ADMIN' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Chọn SV xem thử:</span>
            <select
              value={currentStudentId}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {studentList.map(s => (
                <option key={s.studentId} value={s.studentId}>
                  {s.fullName} ({s.studentId})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveSubTab('transcript')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
            activeSubTab === 'transcript'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Bảng Điểm Cá Nhân & GPA</span>
        </button>

        <button
          onClick={() => setActiveSubTab('timetable')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
            activeSubTab === 'timetable'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Thời Khóa Biểu Tuần</span>
        </button>

        <button
          onClick={() => setActiveSubTab('registration')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
            activeSubTab === 'registration'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Đăng Ký Môn Tín Chỉ</span>
        </button>
      </div>

      {/* SUBTAB 1: TRANSCRIPT & GPA */}
      {activeSubTab === 'transcript' && (
        <div className="space-y-6">
          {/* GPA Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">GPA Tích Lũy (Hệ 4.0)</span>
              <div className="text-2xl font-black text-indigo-400">{gpaSummary.gpa4} / 4.0</div>
              <p className="text-[10px] text-slate-500">Chuẩn thang điểm tín chỉ</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">GPA Tích Lũy (Hệ 10)</span>
              <div className="text-2xl font-black text-emerald-400">{gpaSummary.gpa10} / 10.0</div>
              <p className="text-[10px] text-slate-500">Trung bình chung học tập</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Xếp Loại Học Lực</span>
              <div className="text-2xl font-black text-amber-400">{gpaSummary.rank}</div>
              <p className="text-[10px] text-slate-500">Dựa trên kết quả học kỳ</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Số Môn Đã Học</span>
              <div className="text-2xl font-black text-cyan-400">{grades.length} Môn</div>
              <p className="text-[10px] text-slate-500">Ước tính {gpaSummary.totalCredits} tín chỉ</p>
            </div>
          </div>

          {/* Detailed Grades Table */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Kết Quả Học Tập Chi Tiết</h3>
                <p className="text-xs text-slate-400">Danh sách điểm thành phần và điểm tổng kết các học phần</p>
              </div>
              <button
                onClick={loadStudentPortalData}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
            </div>

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
                            {g.semester} ({g.academicYear})
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

      {/* SUBTAB 2: WEEKLY TIMETABLE GRID */}
      {activeSubTab === 'timetable' && (
        <div className="space-y-4">
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
                              {s.subjectName || `Lớp Tín Chỉ #${s.creditClassId}`}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 shrink-0">
                              {s.shift}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-indigo-400 shrink-0" />
                              <span>{s.startTime} - {s.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                              <span>{s.classroomName || s.classroomId}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User className="h-3 w-3 text-amber-400 shrink-0" />
                              <span className="truncate">{s.teacherName || s.teacherId || 'Chưa cập nhật'}</span>
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

      {/* SUBTAB 3: COURSE / CREDIT CLASS REGISTRATION */}
      {activeSubTab === 'registration' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div>
              <h3 className="text-sm font-bold text-white">Đăng Ký Học Phần & Lớp Tín Chỉ Trực Tuyến</h3>
              <p className="text-xs text-slate-400">Học kỳ 1 (2025 - 2026) • Chọn lớp phù hợp với kế hoạch học tập</p>
            </div>
            <button
              onClick={loadStudentPortalData}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
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
                        <span className="text-slate-200 font-medium">
                          {cc.teacherName || cc.teacher?.fullName || 'Chưa phân công'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Học kỳ:</span>
                        <span className="text-slate-200">{cc.semester} ({cc.academicYear})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sĩ số lớp:</span>
                        <span className="font-mono text-slate-200 font-bold">
                          {currentSeats} / {maxSeats}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enrollment Button */}
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
    </div>
  );
}
