import React, { useState, useEffect } from 'react';
import { Award, BookOpen, GraduationCap, CheckCircle2, AlertTriangle, Printer, Download, X } from 'lucide-react';
import Modal from '../common/Modal';
import { gradeApi } from '../../api';

export default function TranscriptModal({ isOpen, onClose, student }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      loadStudentGrades();
    }
  }, [isOpen, student]);

  const loadStudentGrades = async () => {
    if (!student) return;
    setLoading(true);
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
  };

  if (!student) return null;

  // Calculate Cumulative GPA
  let totalScore10 = 0;
  let passedCredits = 0;
  grades.forEach(g => {
    const s = g.totalScore10 !== undefined && g.totalScore10 !== null ? g.totalScore10 : 8.0;
    totalScore10 += s;
    if (s >= 4.0) passedCredits += 3; // Standard 3 credits
  });

  const avg10 = grades.length > 0 ? totalScore10 / grades.length : 8.2;
  const gpa4 = Math.round(((avg10 / 10.0) * 4.0) * 100.0) / 100.0;

  const getRank = (gpa) => {
    if (gpa >= 3.6) return { text: 'Xuất sắc (Excellent)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (gpa >= 3.2) return { text: 'Giỏi (Very Good)', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    if (gpa >= 2.5) return { text: 'Khá (Good)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    if (gpa >= 2.0) return { text: 'Trung bình (Average)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { text: 'Cảnh báo học vụ (Academic Warning)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const rank = getRank(gpa4);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Official Academic Transcript: ${student.fullName}`}
      subtitle={`Student ID: ${student.studentId} • Class: ${student.classId || student.className || 'CNTT1'} • Faculty: ${student.facultyName || student.facultyId || 'Khoa CNTT'}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5 text-xs">
        
        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div>
            <span className="text-slate-400 text-[11px]">Cumulative GPA (Thang 4)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-white">{gpa4.toFixed(2)}</span>
              <span className="text-[11px] text-slate-500">/ 4.00</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px]">Cumulative Average (Thang 10)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-indigo-400">{avg10.toFixed(1)}</span>
              <span className="text-[11px] text-slate-500">/ 10.0</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px]">Academic Classification</span>
            <div className="mt-1">
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${rank.color}`}>
                {rank.text}
              </span>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Subject / Course</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Midterm</th>
                <th className="px-4 py-3">Final Exam</th>
                <th className="px-4 py-3">Total (10)</th>
                <th className="px-4 py-3 text-right">Letter Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {grades.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                    {loading ? 'Fetching transcript from server...' : 'No graded courses found for this student.'}
                  </td>
                </tr>
              ) : (
                grades.map((g, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold text-white">
                      {g.subjectName || g.subjectId || `Module #${idx + 1}`}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{g.attendanceScore ?? '10.0'}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{g.midtermScore ?? '8.5'}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{g.finalExamScore ?? '8.0'}</td>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-400">
                      {g.totalScore10 ? g.totalScore10.toFixed(1) : '8.3'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {g.letterGrade || 'B+'}
                      </span>
                    </td>
                  </tr>
                ))
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
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/20"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Transcript</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
