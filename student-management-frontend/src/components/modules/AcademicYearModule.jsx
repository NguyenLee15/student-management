import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, CalendarRange, RefreshCw } from 'lucide-react';
import { academicYearApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';

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
      console.warn('Failed loading academic years', err);
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
          <p className="text-xs text-slate-400 mt-1">Quản lý các khóa tuyển sinh (K63, K64, K65, K66...) và thời gian đào tạo</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-violet-600/30 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm Niên Khóa Mới</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {years.map((y) => (
          <div
            key={y.academicYearId}
            className="panel-card p-6 space-y-4 hover:border-violet-500/40 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-105 transition">
                <CalendarRange className="h-6 w-6" />
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-violet-300 rounded-lg">
                {y.academicYearId}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{y.academicYearName}</h3>
              <p className="text-xs text-slate-400 mt-1">Khóa đào tạo chính quy</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Trạng thái: <span className="text-emerald-400 font-semibold">Đang hoạt động</span></span>
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(y)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-800 transition"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(y)}
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

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? `Sửa Niên Khóa: ${formData.academicYearId}` : 'Thêm niên khóa'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mã Khóa *</label>
            <input
              type="text"
              required
              disabled={isEdit}
              placeholder="VD: K65, K66"
              value={formData.academicYearId}
              onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tên Khóa Học *</label>
            <input
              type="text"
              required
              placeholder="e.g. Khóa 65 (2020 - 2025)"
              value={formData.academicYearName}
              onChange={(e) => setFormData({ ...formData, academicYearName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >Hủy</button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-600/30 transition"
            >
              {isEdit ? 'Lưu thay đổi' : 'Thêm Niên Khóa'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa niên khóa"
        message={msg.confirm.delete('niên khóa', deleteTarget?.academicYearName, deleteTarget?.academicYearId)}
      />
    </div>
  );
}
