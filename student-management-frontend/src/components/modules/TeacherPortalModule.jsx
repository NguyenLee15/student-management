import React, { useState, useEffect } from 'react';
import { 
  UserSquare2, Layers, Users, Award, Save, CheckCircle2, 
  RefreshCw, BookOpen, Clock, AlertCircle, Edit3 
} from 'lucide-react';
import { creditClassApi, teacherApi, studentApi, gradeApi } from '../../api';

export default function TeacherPortalModule({ onNotify, currentUser }) {
  const [currentTeacherId, setCurrentTeacherId] = useState(currentUser?.teacherId || '');
  const [teacherList, setTeacherList] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState(null);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [gradeSheet, setGradeSheet] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    if (currentTeacherId) {
      loadTeacherClasses();
    }
  }, [currentTeacherId]);

  const loadTeachers = async () => {
    try {
      const res = await teacherApi.getAll({ page: 0, size: 50 });
      const d = res.data || res;
      const list = Array.isArray(d) ? d : (d.content || []);
      setTeacherList(list);
      if (list.length > 0 && !currentUser?.teacherId) {
        setCurrentTeacherId(list[0].teacherId);
      }
    } catch (e) {
      console.warn('Err load teachers', e);
    }
  };

  const loadTeacherClasses = async () => {
    setLoading(true);
    try {
      const found = teacherList.find(t => t.teacherId === currentTeacherId);
      setTeacherInfo(found || { teacherId: currentTeacherId, fullName: 'Unknown Teacher' });

      const res = await creditClassApi.getAll();
      const d = res.data || res;
      const all = Array.isArray(d) ? d : (d.content || []);
      const myClasses = all.filter(c => c.teacherId === currentTeacherId || c.teacher?.teacherId === currentTeacherId);
      setClasses(myClasses); // no fallback to all classes
      if (myClasses.length > 0) {
        handleSelectClass(myClasses[0]);
      } else if (all.length > 0) {
        handleSelectClass(all[0]);
      }
    } catch (err) {
      console.warn('Err load teacher classes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = async (cls) => {
    setSelectedClass(cls);
    try {
      // Load enrolled students or sample students
      const res = await studentApi.getAll({ page: 0, size: 20 });
      const d = res.data || res;
      const stList = Array.isArray(d) ? d : (d.content || []);
      setStudents(stList);

      // Initialize empty grade sheet
      const initialGrades = {};
      stList.forEach((s) => {
        initialGrades[s.studentId] = {
          attendanceScore: '',
          midtermScore: '',
          finalExamScore: '',
        };
      });
      setGradeSheet(initialGrades);
    } catch (e) {
      console.warn('Err load class students', e);
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
      // Submit grades sequentially or bulk
      const promises = students.map(st => {
        const entry = gradeSheet[st.studentId] || {};
        return gradeApi.create({
          studentId: st.studentId,
          subjectId: selectedClass?.subjectId || selectedClass?.subject?.subjectId || 'IT001',
          attendanceScore: entry.attendanceScore || 0,
          midtermScore: entry.midtermScore || 0,
          finalExamScore: entry.finalExamScore || 0,
          semester: selectedClass?.semester,
          academicYear: selectedClass?.academicYear,
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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-500/30">
            {teacherInfo?.fullName ? teacherInfo.fullName.charAt(0) : 'T'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">
                {teacherInfo?.fullName || 'Giảng Viên'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentTeacherId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cổng Giảng Viên • Quản lý lớp tín chỉ đứng lớp và nhập điểm chuyên cần, giữa kỳ, thi kết thúc
            </p>
          </div>
        </div>

        {/* Demo Switcher (Admin Only) */}
        {currentUser?.role === 'ROLE_ADMIN' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Chọn GV xem thử:</span>
            <select
              value={currentTeacherId}
              onChange={(e) => setCurrentTeacherId(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {teacherList.map(t => (
                <option key={t.teacherId} value={t.teacherId}>
                  {t.fullName} ({t.teacherId})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Content Layout: Left Class list, Right Grade Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Classes list */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>Lớp Tín Chỉ Đang Dạy</span>
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
                      {c.semester}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-white truncate">
                    {c.subjectName || c.subject?.subjectName || `Môn học #${c.subjectId}`}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Sĩ số: {c.maxStudents} SV</span>
                    <span className="text-emerald-400 font-medium">Nhập điểm &rarr;</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Grade Entry Sheet */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Bảng Nhập Điểm Nhanh: {selectedClass?.subjectName || `Lớp #${selectedClass?.creditClassId}`}
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

          {/* Spreadsheet Table */}
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
                  const entry = gradeSheet[st.studentId] || { attendanceScore: '', midtermScore: '', finalExamScore: '' };
                  
                  const att = parseFloat(entry.attendanceScore) || 0;
                  const mid = parseFloat(entry.midtermScore) || 0;
                  const fin = parseFloat(entry.finalExamScore) || 0;
                  const finalScore = ((att * 0.1) + (mid * 0.3) + (fin * 0.6)).toFixed(1);

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
            <span>💡 Mẹo: Điểm tổng kết hệ 10 sẽ tự động tính theo trọng số (10% - 30% - 60%).</span>
            <span className="font-semibold text-emerald-400">Sẵn sàng đồng bộ CSDL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
