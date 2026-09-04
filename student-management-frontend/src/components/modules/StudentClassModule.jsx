// cSpell:disable
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { studentClassApi, facultyApi } from '../../api';
import { msg } from '../../lib/messages';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';
import StudentClassGrid from './studentClass/StudentClassGrid';
import StudentClassFormModal from './studentClass/StudentClassFormModal';

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
      console.warn('Lỗi khi tải danh sách khoa', e);
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
      console.warn('Lỗi khi tải danh sách lớp', err);
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
        onNotify('success', msg.success.updated('lớp hành chính', formData.classId));
      } else {
        await studentClassApi.create(formData);
        onNotify('success', msg.success.created('lớp hành chính', formData.classId));
      }
      setShowModal(false);
      loadClasses();
    } catch (err) {
      onNotify('error', err?.message || msg.error.save('lớp hành chính'));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await studentClassApi.delete(deleteTarget.classId);
      onNotify('success', msg.success.deleted('lớp hành chính', deleteTarget.classId));
      loadClasses();
    } catch (err) {
      onNotify('error', err?.message || msg.error.delete('lớp hành chính'));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Danh Sách Lớp Hành Chính</h1>
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

      <div className="panel-card p-4 flex items-center justify-between">
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

      {/* Student Class Grid Component */}
      <StudentClassGrid
        classes={classes}
        loading={loading}
        isAdmin={isAdmin}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={(c) => setDeleteTarget(c)}
        onOpenCreate={handleOpenCreate}
      />

      <Pagination
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
      />

      {/* Form Modal */}
      <StudentClassFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        faculties={faculties}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Lớp Học"
        message={`Bạn có chắc chắn muốn xóa lớp "${deleteTarget?.className || deleteTarget?.classId}"?`}
      />
    </div>
  );
}
