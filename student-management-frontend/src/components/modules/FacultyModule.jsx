import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Building2, RefreshCw, Layers } from 'lucide-react';
import { facultyApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import EmptyState from '../common/EmptyState';
import Skeleton from '../common/Skeleton';

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Khoa & Viện Đào Tạo</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý các khoa chuyên môn và viện đào tạo trực thuộc trường</p>
        </div>

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

      {/* Grid of Faculties */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel-card p-6 space-y-4 animate-pulse">
              <div className="h-10 w-10 bg-slate-800 rounded-xl"></div>
              <div className="h-5 w-3/4 bg-slate-800 rounded-lg"></div>
              <div className="h-4 w-1/2 bg-slate-800 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : faculties.length === 0 ? (
        <EmptyState
          title="Chưa có khoa đào tạo nào"
          description="Hiện chưa có dữ liệu khoa viện trong hệ thống. Hãy thêm khoa mới để bắt đầu."
          actionText={isAdmin ? "Thêm Khoa Mới" : undefined}
          onAction={isAdmin ? handleOpenCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {faculties.map((f) => (
            <div
              key={f.facultyId}
              className="panel-card p-6 space-y-4 hover:border-amber-500/40 transition group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-amber-300 rounded-lg">
                  {f.facultyId}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{f.facultyName}</h3>
                <p className="text-xs text-slate-400 mt-1">Khoa chuyên môn</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Trạng Thái Khoa: <span className="text-emerald-400 font-semibold">Hoạt động</span></span>
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(f)}
                      className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500 transition"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(f)}
                      className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? `Sửa Khoa: ${formData.facultyId}` : 'Thêm Khoa Đào Tạo Mới'}
        subtitle="Nhập mã khoa, tên khoa và thông tin lãnh đạo"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mã Khoa *</label>
            <input
              type="text"
              required
              disabled={isEdit}
              placeholder="VD: CNTT, DTVT, QTKD"
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tên Khoa *</label>
            <input
              type="text"
              required
              placeholder="e.g. Khoa Công Nghệ Thông Tin"
              value={formData.facultyName}
              onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
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
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 transition"
            >
              {isEdit ? 'Lưu thay đổi' : 'Thêm Khoa'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Khoa"
        message={msg.confirm.delete('khoa', deleteTarget?.facultyName, deleteTarget?.facultyId)}
      />
    </div>
  );
}
