// cSpell:disable
import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { facultyApi } from '../../api';
import ConfirmDialog from '../common/ConfirmDialog';
import FacultyGrid from './faculty/FacultyGrid';
import FacultyFormModal from './faculty/FacultyFormModal';

export default function FacultyModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = { facultyId: '', facultyName: '' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    setLoading(true);
    try {
      const res = await facultyApi.getAll({ unpaged: true });
      const data = res.data || res;
      setFaculties(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      console.warn('Lỗi khi tải danh sách khoa', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (f) => {
    setIsEdit(true);
    setFormData({ facultyId: f.facultyId, facultyName: f.facultyName });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await facultyApi.update(formData.facultyId, formData);
        onNotify('success', msg.success.updated('khoa', formData.facultyId));
      } else {
        await facultyApi.create(formData);
        onNotify('success', msg.success.created('khoa', formData.facultyId));
      }
      setShowModal(false);
      loadFaculties();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi lưu khoa');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await facultyApi.delete(deleteTarget.facultyId);
      onNotify('success', msg.success.deleted('khoa', deleteTarget.facultyId));
      loadFaculties();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa khoa');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Khoa & Viện Đào Tạo</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý các khoa chuyên môn và viện đào tạo trực thuộc trường</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadFaculties}
            title="Làm mới"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm Khoa Mới</span>
            </button>
          )}
        </div>
      </div>

      <FacultyGrid
        faculties={faculties}
        loading={loading}
        isAdmin={isAdmin}
        onOpenCreate={handleOpenCreate}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={(f) => setDeleteTarget(f)}
      />

      <FacultyFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Xác nhận xóa khoa đào tạo"
        message={deleteTarget ? `Bạn có chắc chắn muốn xóa khoa '${deleteTarget.facultyName}' (${deleteTarget.facultyId})? Thao tác này sẽ ảnh hưởng tới các lớp chuyên ngành và sinh viên liên kết.` : ''}
        confirmText="Xóa khoa"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
        isDanger={true}
      />
    </div>
  );
}
