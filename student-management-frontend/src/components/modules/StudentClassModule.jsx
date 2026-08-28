import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, School, RefreshCw, Building2 } from 'lucide-react';
import { studentClassApi, facultyApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';

export default function StudentClassModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [classes, setClasses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const initialForm = { classId: '', className: '', facultyId: '' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadFaculties();
  }, []);

  useEffect(() => {
    loadClasses();
  }, [page, size, selectedFaculty]);

  const loadFaculties = async () => {
    try {
      const res = await facultyApi.getAll({ unpaged: true });
      const d = res.data || res;
      setFaculties(Array.isArray(d) ? d : d.content || []);
    } catch (e) {
      console.warn('Err load faculties', e);
    }
  };

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await studentClassApi.getAll({
        page,
        size,
        facultyId: selectedFaculty || undefined,
      });
      const d = res.data || res;
      if (d && d.content) {
        setClasses(d.content);
        setTotalPages(d.totalPages || 1);
        setTotalElements(d.totalElements || d.content.length);
      } else if (Array.isArray(d)) {
        setClasses(d);
        setTotalPages(1);
        setTotalElements(d.length);
      }
    } catch (err) {
      console.warn('Err load classes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData({
      ...initialForm,
      facultyId: faculties[0]?.facultyId || '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setIsEdit(true);
    setFormData({
      classId: c.classId,
      className: c.className,
      facultyId: c.facultyId || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await studentClassApi.update(formData.classId, formData);
        onNotify('success', `Class ${formData.classId} đã được cập nhật thành công!`);
      } else {
        await studentClassApi.create(formData);
        onNotify('success', `Class ${formData.classId} đã được tạo thành công!`);
      }
      setShowModal(false);
      loadClasses();
    } catch (err) {
      onNotify('error', err?.message || 'Error saving student class');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await studentClassApi.delete(deleteTarget.classId);
      onNotify('success', `Class ${deleteTarget.classId} đã được xóa thành công!`);
      loadClasses();
    } catch (err) {
      onNotify('error', err?.message || 'Error deleting student class');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sinh Viên Homeroom Classes</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý các lớp sinh viên hành chính theo từng khoa và cố vấn học tập</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-sky-600/30 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm Lớp</span>
          </button>
        )}
      </div>

      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <select
          value={selectedFaculty}
          onChange={(e) => { setSelectedFaculty(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 transition"
        >
          <option value="">Tất Cả Các Khoa</option>
          {faculties.map((f) => (
            <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
          ))}
        </select>

        <button
          onClick={loadClasses}
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((c) => (
          <div
            key={c.classId}
            className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-sky-500/40 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-105 transition">
                <School className="h-6 w-6" />
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-sky-300 rounded-lg">
                {c.classId}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{c.className || c.classId}</h3>
              <p className="text-xs text-slate-400 mt-1">{c.facultyName || c.facultyId || 'Chưa phân khoa'}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Trạng thái: <span className="text-emerald-400">Đang hoạt động</span></span>
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(c)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Pagination
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? `Sửa Lớp: ${formData.classId}` : 'Create Sinh Viên Class'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Class ID (Mã Lớp)*</label>
            <input
              type="text"
              required
              disabled={isEdit}
              placeholder="VD: CNTT1-K65"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Class Name (Tên Lớp)*</label>
            <input
              type="text"
              required
              placeholder="e.g. Công Nghệ Thông Tin 1 K65"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Khoa Chủ Quản*</label>
            <select
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {faculties.map((f) => (
                <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >Hủy</button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-600/30 transition"
            >
              {isEdit ? 'Lưu thay đổi' : 'Thêm Lớp'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Lớp Hành Chính"
        message={`Are you sure you want to remove class "${deleteTarget?.className}" (ID: ${deleteTarget?.classId})?`}
      />
    </div>
  );
}
