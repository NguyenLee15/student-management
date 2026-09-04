// cSpell:disable
import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { academicYearApi } from '../../api';
import ConfirmDialog from '../common/ConfirmDialog';
import AcademicYearGrid from './academicYear/AcademicYearGrid';
import AcademicYearFormModal from './academicYear/AcademicYearFormModal';

export default function AcademicYearModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = { academicYearId: '', academicYearName: '' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = async () => {
    setLoading(true);
    try {
      const res = await academicYearApi.getAll({ unpaged: true });
      const data = res.data || res;
      setYears(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      console.warn('Lỗi khi tải niên khóa', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (y) => {
    setIsEdit(true);
    setFormData({ academicYearId: y.academicYearId, academicYearName: y.academicYearName });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await academicYearApi.update(formData.academicYearId, formData);
        onNotify('success', msg.success.updated('niên khóa', formData.academicYearId));
      } else {
        await academicYearApi.create(formData);
        onNotify('success', msg.success.created('niên khóa', formData.academicYearId));
      }
      setShowModal(false);
      loadYears();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi lưu niên khóa');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await academicYearApi.delete(deleteTarget.academicYearId);
      onNotify('success', msg.success.deleted('niên khóa', deleteTarget.academicYearId));
      loadYears();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa niên khóa');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Niên Khóa & Khóa Học</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý các khóa tuyển sinh và niên khóa đào tạo</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadYears}
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
              <span>Thêm Niên Khóa Mới</span>
            </button>
          )}
        </div>
      </div>

      <AcademicYearGrid
        years={years}
        loading={loading}
        isAdmin={isAdmin}
        onOpenCreate={handleOpenCreate}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={(y) => setDeleteTarget(y)}
      />

      <AcademicYearFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Xác nhận xóa niên khóa"
        message={deleteTarget ? `Bạn có chắc chắn muốn xóa niên khóa '${deleteTarget.academicYearName}' (${deleteTarget.academicYearId})?` : ''}
        confirmText="Xóa niên khóa"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
        isDanger={true}
      />
    </div>
  );
}
