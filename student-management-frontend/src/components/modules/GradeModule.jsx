import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Award, Download, RefreshCw, Calculator, CheckCircle2 } from 'lucide-react';
import { gradeApi, studentApi, subjectApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';

export default function GradeModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';
  const isTeacher = currentUser?.role === 'ROLE_TEACHER' || currentUser?.role === 'TEACHER';
  const canManage = isAdmin || isTeacher;

  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [studentSearch, setStudentsSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    gradeId: null,
    studentId: '',
    subjectId: '',
    attendanceScore: 10,
    midtermScore: 8.5,
    finalExamScore: 8.0,
    semester: 'SEMESTER_1',
    academicYear: '2025-2026',
    studyPhase: 'PHASE_1',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadDependencies();
  }, []);

  useEffect(() => {
    loadGrades();
  }, [page, size, selectedSemester]);

  const loadDependencies = async () => {
    try {
      const [stRes, subRes] = await Promise.allSettled([
        studentApi.getAll({ page: 0, size: 50 }),
        subjectApi.getAll({ page: 0, size: 50 }),
      ]);
      if (stRes.status === 'fulfilled') {
        const d = stRes.value.data || stRes.value;
        setStudents(Array.isArray(d) ? d : d.content || []);
      }
      if (subRes.status === 'fulfilled') {
        const d = subRes.value.data || subRes.value;
        setSubjects(Array.isArray(d) ? d : d.content || []);
      }
    } catch (e) {
      console.warn('Err load grade dependencies', e);
    }
  };

  const loadGrades = async () => {
    setLoading(true);
    try {
      const res = await gradeApi.getAll({
        page,
        size,
        studentId: studentSearch || undefined,
        semester: selectedSemester || undefined,
      });
      const d = res.data || res;
      if (d && d.content) {
        setGrades(d.content);
        setTotalPages(d.totalPages || 1);
        setTotalElements(d.totalElements || d.content.length);
      } else if (Array.isArray(d)) {
        setGrades(d);
        setTotalPages(1);
        setTotalElements(d.length);
      }
    } catch (err) {
      console.warn('Err load grades', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData({
      ...initialForm,
      studentId: students[0]?.studentId || '',
      subjectId: subjects[0]?.subjectId || '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (g) => {
    setIsEdit(true);
    setFormData({
      gradeId: g.gradeId,
      studentId: g.studentId || '',
      subjectId: g.subjectId || '',
      attendanceScore: g.attendanceScore ?? 10,
      midtermScore: g.midtermScore ?? 8.5,
      finalExamScore: g.finalExamScore ?? 8.0,
      semester: g.semester || 'SEMESTER_1',
      academicYear: g.academicYear || '2025-2026',
      studyPhase: g.studyPhase || 'PHASE_1',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await gradeApi.update(formData.gradeId, formData);
        onNotify('success', msg.success.updated('điểm số', '#' + formData.gradeId));
      } else {
        await gradeApi.create(formData);
        onNotify('success', msg.success.created('điểm số', 'SV ' + formData.studentId));
      }
      setShowModal(false);
      loadGrades();
    } catch (err) {
      onNotify('error', err?.message || msg.error.save('điểm số'));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await gradeApi.delete(deleteTarget.gradeId);
      onNotify('success', msg.success.deleted('bản ghi điểm', '#' + deleteTarget.gradeId));
      loadGrades();
    } catch (err) {
      onNotify('error', err?.message || msg.error.delete('bản ghi điểm'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Điểm Số & Đánh Giá GPA</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý điểm chuyên cần, giữa kỳ, cuối kỳ, điểm chữ và quy đổi GPA thang 4.0</p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Nhập Điểm Mới</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="panel-card p-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Tìm theo mã sinh viên (VD: SV001)..."
          value={studentSearch}
          onChange={(e) => setStudentsSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { setPage(0); loadGrades(); } }}
          className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500 min-w-[220px]"
        />

        <select
          value={selectedSemester}
          onChange={(e) => { setSelectedSemester(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
        >
          <option value="">Tất Cả Các Học Kỳ</option>
          <option value="SEMESTER_1">Học kỳ 1</option>
          <option value="SEMESTER_2">Học kỳ 2</option>
        </select>

        <button
          onClick={loadGrades}
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition ml-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-purple-400' : ''}`} />
        </button>
      </div>

      {/* Grade Table */}
      <div className="panel-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Sinh Viên</th>
                <th className="px-5 py-3.5">Học Phần</th>
                <th className="px-5 py-3.5">Chuyên Cần (10%)</th>
                <th className="px-5 py-3.5">Giữa Kỳ (30%)</th>
                <th className="px-5 py-3.5">Cuối Kỳ (60%)</th>
                <th className="px-5 py-3.5">Tổng Kết (Thang 10)</th>
                <th className="px-5 py-3.5">Điểm Chữ</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {grades.map((g) => (
                <tr key={g.gradeId} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white">{g.studentName || g.studentId}</div>
                    <div className="text-[10px] text-indigo-400 font-mono">{g.studentId}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    <span className="font-medium text-slate-200">{g.subjectName || g.subjectId}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-400">{g.attendanceScore ?? '10.0'}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-400">{g.midtermScore ?? '8.5'}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-400">{g.finalExamScore ?? '8.0'}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-white">
                    {g.totalScore10 ? g.totalScore10.toFixed(1) : '8.3'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      (g.letterGrade === 'A' || g.letterGrade === 'A+') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      (g.letterGrade === 'B' || g.letterGrade === 'B+') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      (g.letterGrade === 'C' || g.letterGrade === 'C+') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {g.letterGrade || 'B+'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    {canManage && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(g)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(g)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          size={size}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? `Sửa Điểm #${formData.gradeId}` : 'Nhập Điểm Học Phần'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sinh Viên (Sinh Viên)*</label>
              <select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {students.map((st) => (
                  <option key={st.studentId} value={st.studentId}>{st.fullName} ({st.studentId})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Môn Học *</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {subjects.map((s) => (
                  <option key={s.subjectId} value={s.subjectId}>{s.subjectName} ({s.subjectId})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Điểm Chuyên Cần (10%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.attendanceScore}
                onChange={(e) => setFormData({ ...formData, attendanceScore: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Điểm Giữa Kỳ (30%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.midtermScore}
                onChange={(e) => setFormData({ ...formData, midtermScore: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Điểm Cuối Kỳ (60%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.finalExamScore}
                onChange={(e) => setFormData({ ...formData, finalExamScore: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >Hủy</button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 transition"
            >
              {isEdit ? 'Lưu thay đổi' : 'Lưu điểm'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Bản Ghi Điểm"
        message={msg.confirm.delete('bản ghi điểm', '', '#' + deleteTarget?.gradeId)}
      />
    </div>
  );
}
