import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, DoorOpen, Building, RefreshCw, Users } from 'lucide-react';
import { classroomApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';

export default function ClassroomModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const initialForm = { roomId: '', roomName: '', building: 'BUILDING_A', capacity: 60 };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadClassrooms();
  }, [page, size, selectedBuilding]);

  const loadClassrooms = async () => {
    setLoading(true);
    try {
      const res = await classroomApi.getAll({
        page,
        size,
        building: selectedBuilding || undefined,
      });
      const d = res.data || res;
      if (d && d.content) {
        setClassrooms(d.content);
        setTotalPages(d.totalPages || 1);
        setTotalElements(d.totalElements || d.content.length);
      } else if (Array.isArray(d)) {
        setClassrooms(d);
        setTotalPages(1);
        setTotalElements(d.length);
      }
    } catch (err) {
      console.warn('Err load classrooms', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setIsEdit(true);
    setFormData({
      roomId: c.roomId,
      roomName: c.roomName,
      building: c.building || 'BUILDING_A',
      capacity: c.capacity || 60,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await classroomApi.update(formData.roomId, formData);
        onNotify('success', msg.success.updated('phòng học', formData.roomId));
      } else {
        await classroomApi.create(formData);
        onNotify('success', msg.success.created('phòng học', formData.roomId));
      }
      setShowModal(false);
      loadClassrooms();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi lưu phòng học');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await classroomApi.delete(deleteTarget.roomId);
      onNotify('success', msg.success.deleted('phòng học', deleteTarget.roomId));
      loadClassrooms();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa phòng học');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Phòng Học & Giảng Đường</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý giảng đường, tòa nhà, phòng thực hành và sức chứa sinh viên</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-rose-600/30 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm Phòng Học Mới</span>
          </button>
        )}
      </div>

      <div className="panel-card p-4 flex items-center justify-between">
        <select
          value={selectedBuilding}
          onChange={(e) => { setSelectedBuilding(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 transition"
        >
          <option value="">Tất Cả Các Tòa Nhà</option>
          <option value="BUILDING_A">Tòa A</option>
          <option value="BUILDING_B">Tòa B</option>
          <option value="BUILDING_C">Tòa C</option>
          <option value="BUILDING_D">Tòa D</option>
        </select>

        <button
          onClick={loadClassrooms}
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {classrooms.map((c) => (
          <div
            key={c.roomId}
            className="panel-card p-6 space-y-4 hover:border-rose-500/40 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-105 transition">
                <DoorOpen className="h-6 w-6" />
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-rose-300 rounded-lg">
                {c.roomId}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{c.roomName || c.roomId}</h3>
              <p className="text-xs text-slate-400 mt-1">{msg.enum.building[c.building] || 'Tòa A'}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users className="h-3.5 w-3.5 text-slate-500" />
                <span>{c.capacity || 60} chỗ</span>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
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
        title={isEdit ? `Sửa Phòng Học: ${formData.roomId}` : 'Thêm phòng học'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mã Phòng *</label>
              <input
                type="text"
                required
                disabled={isEdit}
                placeholder="VD: A101, B202"
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tên Phòng Học*</label>
              <input
                type="text"
                required
                placeholder="e.g. Phòng Học Thông Minh A101"
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tòa Nhà*</label>
              <select
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="BUILDING_A">Tòa A</option>
                <option value="BUILDING_B">Tòa B</option>
                <option value="BUILDING_C">Tòa C</option>
                <option value="BUILDING_D">Tòa D</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sức chứa (chỗ ngồi) *</label>
              <input
                type="number"
                min="10"
                max="500"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 60 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
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
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 transition"
            >
              {isEdit ? 'Lưu thay đổi' : 'Tạo phòng học'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa phòng học"
        message={msg.confirm.delete('phòng học', deleteTarget?.roomName, deleteTarget?.roomId)}
      />
    </div>
  );
}
