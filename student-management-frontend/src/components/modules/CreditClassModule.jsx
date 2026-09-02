import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Layers, Users, BookOpen, UserPlus, X, RefreshCw } from 'lucide-react';
import { creditClassApi, subjectApi, studentClassApi, studentApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';

export default function CreditClassModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [creditClasses, setCreditClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [newStudentId, setNewStudentId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    subjectId: '',
    classId: '',
    minStudents: 15,
    maxStudents: 60,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadDependencies();
    loadCreditClasses();
  }, []);

  const loadDependencies = async () => {
    try {
      const [subRes, clsRes] = await Promise.allSettled([
        subjectApi.getAll({ page: 0, size: 50 }),
        studentClassApi.getAll({ page: 0, size: 50 }),
      ]);
      if (subRes.status === 'fulfilled') {
        const d = subRes.value.data || subRes.value;
        setSubjects(Array.isArray(d) ? d : d.content || []);
      }
      if (clsRes.status === 'fulfilled') {
        const d = clsRes.value.data || clsRes.value;
        setClasses(Array.isArray(d) ? d : d.content || []);
      }
    } catch (e) {
      console.warn('Lỗi khi tải danh mục phụ thuộc', e);
    }
  };

  const loadCreditClasses = async () => {
    setLoading(true);
    try {
      const res = await creditClassApi.getAll();
      const d = res.data || res;
      setCreditClasses(Array.isArray(d) ? d : d.content || []);
    } catch (err) {
      console.warn('Lỗi khi tải lớp tín chỉ', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      subjectId: subjects[0]?.subjectId || '',
      classId: classes[0]?.classId || '',
      minStudents: 15,
      maxStudents: 60,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await creditClassApi.create(formData);
      onNotify('success', 'Mở lớp tín chỉ thành công!');
      setShowModal(false);
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi mở lớp tín chỉ');
    }
  };

  const handleViewStudents = async (cc) => {
    setSelectedClass(cc);
    setShowStudentsModal(true);
    try {
      const res = await creditClassApi.getById(cc.creditClassId);
      const data = res.data || res;
      setEnrolledStudents(data.students || []);
    } catch (e) {
      setEnrolledStudents([]);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentId || !selectedClass) return;
    try {
      await creditClassApi.addStudent(selectedClass.creditClassId, newStudentId.trim());
      onNotify('success', `Sinh Viên ${newStudentId} đã được thêm vào lớp tín chỉ!`);
      setNewStudentId('');
      handleViewStudents(selectedClass);
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi thêm sinh viên');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!selectedClass) return;
    try {
      await creditClassApi.removeStudent(selectedClass.creditClassId, studentId);
      onNotify('success', `Sinh Viên ${studentId} đã được xóa khỏi lớp tín chỉ!`);
      handleViewStudents(selectedClass);
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa sinh viên');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await creditClassApi.delete(deleteTarget.creditClassId);
      onNotify('success', msg.success.deleted('lớp tín chỉ', deleteTarget.creditClassId));
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi hủy lớp tín chỉ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Lớp tín chỉ & Đăng ký</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý mở lớp học phần, phân công giảng viên và danh sách sinh viên đăng ký</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Lớp tín chỉ mới</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {creditClasses.map((cc) => (
          <div
            key={cc.creditClassId}
            className="panel-card p-6 space-y-4 hover:border-blue-500/40 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-105 transition">
                <Layers className="h-6 w-6" />
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-blue-300 rounded-lg">
                Mã: {cc.creditClassId}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{cc.subjectName || cc.subjectId}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Lớp: <span className="text-slate-200 font-semibold">{cc.className || cc.classId}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500">Sinh Viên Đã Đăng Ký</span>
                <p className="text-lg font-bold text-emerald-400">{cc.enrolledStudentsCount || cc.students?.length || 0}</p>
              </div>
              <div>
                <span className="text-slate-500">Sĩ Số Tối Thiểu / Tối Đa</span>
                <p className="text-lg font-bold text-slate-300">{cc.minStudents || 15} - {cc.maxStudents || 60}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              {isAdmin && (
                <>
                  <button
                    onClick={() => handleViewStudents(cc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/20 transition"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Quản Lý Sĩ Số</span>
                  </button>

                  <button
                    onClick={() => setDeleteTarget(cc)}
                    className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Credit Class */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Mở lớp tín chỉ mới"
        subtitle="Gắn môn học với giảng viên và thời gian tổ chức"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Học Phần (Học Phần)*</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {subjects.map((s) => (
                  <option key={s.subjectId} value={s.subjectId}>{s.subjectName} ({s.subjectId})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Lớp hành chính *</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {classes.map((c) => (
                  <option key={c.classId} value={c.classId}>{c.className || c.classId}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sĩ Số Tối Thiểu</label>
              <input
                type="number"
                min="5"
                max="100"
                value={formData.minStudents}
                onChange={(e) => setFormData({ ...formData, minStudents: parseInt(e.target.value) || 15 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sĩ Số Tối Đa</label>
              <input
                type="number"
                min="10"
                max="300"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 60 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition"
            >
              Mở lớp mới
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Quản Lý Sĩ Số */}
      <Modal
        isOpen={showStudentsModal}
        onClose={() => setShowStudentsModal(false)}
        title={`Danh Sách Sinh Viên: ${selectedClass?.subjectName || selectedClass?.subjectId}`}
        subtitle={`Mã LTC: ${selectedClass?.creditClassId} | Tổng: ${enrolledStudents.length} sinh viên đã đăng ký`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-xs">
          <form onSubmit={handleAddStudent} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Nhập mã SV để thêm vào lớp (VD: SV001)..."
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              <span>Ghi Danh</span>
            </button>
          </form>

          <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-800 rounded-xl p-2 bg-slate-950/50">
            {enrolledStudents.length === 0 ? (
              <p className="text-center py-6 text-slate-500">Chưa có sinh viên nào đăng ký lớp tín chỉ này.</p>
            ) : (
              enrolledStudents.map((st) => (
                <div key={st.studentId} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                      {st.fullName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{st.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{st.studentId}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveStudent(st.studentId)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Hủy Lớp Tín Chỉ"
        message={msg.confirm.delete('lớp tín chỉ', '', deleteTarget?.creditClassId)}
      />
    </div>
  );
}
