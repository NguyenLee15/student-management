// cSpell:disable
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { classroomApi } from '../../api';
import { msg } from '../../lib/messages';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';
import ClassroomCardGrid from './classroom/ClassroomCardGrid';
import ClassroomFormModal from './classroom/ClassroomFormModal';

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
      console.warn('Lỗi khi tải phòng học', err);
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
    <div className="space-y-6 animate-fade-in">
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

      {/* Classroom Cards Grid Component */}
      <ClassroomCardGrid
        classrooms={classrooms}
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
      <ClassroomFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Phòng Học"
        message={`Bạn có chắc chắn muốn xóa phòng học "${deleteTarget?.roomName || deleteTarget?.roomId}"?`}
      />
    </div>
  );
}
