import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Award, BookOpen, GraduationCap, CheckCircle2, AlertTriangle, Printer, Download, X } from 'lucide-react';
import Modal from '../common/Modal';
import { gradeApi } from '../../api';

export default function TranscriptModal({ isOpen, onClose, student }) {
  const [transcript, setTranscript] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      loadStudentsGrades();
    }
  }, [isOpen, student]);

  const loadStudentsGrades = async () => {
    if (!student) return;
    setLoading(true);
    try {
      // 1. Try official Transcript endpoint
      const res = await gradeApi.getTranscript(student.studentId);
      const data = res.data || res;
      if (data && (data.semesterTranscripts || data.cumulativeGpa4 !== undefined)) {
        setTranscript(data);
        const allGrades = [];
        (data.semesterTranscripts || []).forEach(st => {
          (st.grades || []).forEach(g => {
            allGrades.push({
              ...g,
              semester: st.semester,
              academicYear: st.academicYear,
            });
          });
        });
        setGrades(allGrades);
        return;
      }
    } catch (err) {
      console.warn('Không tải được bảng điểm chính thức, fallback sang raw grades:', err);
    }

    // 2. Fallback to raw grades if transcript endpoint not ready
    try {
      const res = await gradeApi.getAll({
        studentId: student.studentId,
        size: 50,
      });
      const d = res.data || res;
      setGrades(Array.isArray(d) ? d : d.content || []);
    } catch (e) {
      setGrades([]);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  if (!student) return null;

  // Use official stats from Backend or compute fallback
  const gpa4 = transcript?.cumulativeGpa4 !== undefined && transcript?.cumulativeGpa4 !== null
    ? Number(transcript.cumulativeGpa4)
    : (grades.length > 0 ? grades.reduce((acc, g) => acc + (g.scoreScale4 || g.totalScore10 * 0.4 || 0), 0) / grades.length : 0);

  const gpa10 = transcript?.cumulativeGpa10 !== undefined && transcript?.cumulativeGpa10 !== null
    ? Number(transcript.cumulativeGpa10)
    : (grades.length > 0 ? grades.reduce((acc, g) => acc + (g.scoreScale10 || g.totalScore10 || 0), 0) / grades.length : 0);

  const standing = transcript?.academicStanding || (gpa4 >= 3.6 ? 'Xuất sắc' : gpa4 >= 3.2 ? 'Giỏi' : gpa4 >= 2.5 ? 'Khá' : gpa4 >= 2.0 ? 'Trung bình' : 'Cảnh báo học vụ');

  const creditsEarned = transcript?.totalCreditsEarned ?? grades.filter(g => (g.passed !== false && (g.scoreScale10 >= 4.0 || g.totalScore10 >= 4.0))).reduce((sum, g) => sum + (g.credits || 3), 0);

  const getRankBadgeColor = (std) => {
    if (std === 'Xuất sắc') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (std === 'Giỏi') return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    if (std === 'Khá') return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (std === 'Trung bình') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Bảng Điểm Học Tập Chính Thức: ${student.fullName}`}
      subtitle={`Sinh Viên ID: ${student.studentId} • Lớp: ${student.classId || student.className || 'CNTT1'} • Khoa: ${student.facultyName || student.facultyId || 'Khoa CNTT'}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5 text-xs">
        
        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div>
            <span className="text-slate-400 text-[11px]">GPA Tích Lũy (Thang 4)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-white">{gpa4.toFixed(2)}</span>
              <span className="text-[11px] text-slate-500">/ 4.00</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px]">GPA Tích Lũy (Thang 10)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-indigo-400">{gpa10.toFixed(1)}</span>
              <span className="text-[11px] text-slate-500">/ 10.0</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px]">Tín Chỉ Tích Lũy</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-teal-400">{creditsEarned}</span>
              <span className="text-[11px] text-slate-500">TC</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px]">Xếp Loại Học Lực</span>
            <div className="mt-1">
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getRankBadgeColor(standing)}`}>
                {standing}
              </span>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Học Phần</th>
                <th className="px-4 py-3 text-center">Số TC</th>
                <th className="px-4 py-3">Tổng Kết (10)</th>
                <th className="px-4 py-3">Thang 4</th>
                <th className="px-4 py-3 text-center">Điểm Chữ</th>
                <th className="px-4 py-3 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {grades.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                    {loading ? 'Đang tải dữ liệu bảng điểm từ máy chủ...' : 'Chưa có dữ liệu điểm học phần nào cho sinh viên này.'}
                  </td>
                </tr>
              ) : (
                grades.map((g, idx) => {
                  const score10 = g.scoreScale10 !== undefined && g.scoreScale10 !== null ? Number(g.scoreScale10) : (g.totalScore10 ?? 0);
                  const score4 = g.scoreScale4 !== undefined && g.scoreScale4 !== null ? Number(g.scoreScale4) : (g.totalScore10 ? Number(g.totalScore10) * 0.4 : 0);
                  const isPassed = g.passed !== undefined ? g.passed : score10 >= 4.0;
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-semibold text-white">
                        <div>{g.subjectName || g.subjectId || `Học phần #${idx + 1}`}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{g.subjectId}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-slate-300">
                        {g.credits ?? 3}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-indigo-400">
                        {score10.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-200">
                        {score4.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {g.letterGrade || (score10 >= 8.5 ? 'A' : score10 >= 7.0 ? 'B' : score10 >= 5.5 ? 'C' : score10 >= 4.0 ? 'D' : 'F')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          isPassed ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          {isPassed ? 'Đạt' : 'Học lại'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
          >Đóng</button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/20"
          >
            <Printer className="h-4 w-4" />
            <span>In Bảng Điểm A4</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
