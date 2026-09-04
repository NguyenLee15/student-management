// cSpell:disable
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, CalendarClock } from 'lucide-react';
import { registrationPeriodApi } from '../../api';
import ConfirmDialog from '../common/ConfirmDialog';
import RegistrationPeriodTable from './registrationPeriod/RegistrationPeriodTable';
import RegistrationPeriodFormModal from './registrationPeriod/RegistrationPeriodFormModal';

export default function RegistrationPeriodModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    name: '',
    semesterId: 1,
    startTime: '',
    endTime: '',
    maxCreditsAllowed: 24,
    active: true,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    setLoading(true);
    try {
      const res = await registrationPeriodApi.getAll();
      const d = res.data || res;
      setPeriods(Array.isArray(d) ? d : d.content || []);
    } catch (err) {
      console.warn('Lỗi khi tải danh sách đợt đăng ký', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setEditingId(null);
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    setFormData({
      name: '',
      semesterId: periods[0]?.semesterId || 1,
      startTime: now.toISOString().slice(0, 16),
      endTime: nextWeek.toISOString().slice(0, 16),
      maxCreditsAllowed: 24,
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setIsEdit(true);
    setEditingId(p.id);
    setFormData({
      name: p.name || '',
      semesterId: p.semesterId || 1,
      startTime: p.startTime ? p.startTime.slice(0, 16) : '',
      endTime: p.endTime ? p.endTime.slice(0, 16) : '',
      maxCreditsAllowed: p.maxCreditsAllowed || 24,
      active: p.active !== undefined ? p.active : true,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && editingId) {
        await registrationPeriodApi.update(editingId, formData);
        onNotify('success', 'Đã cập nhật đợt đăng ký tín chỉ thành công.');
      } else {
        await registrationPeriodApi.create(formData);
        onNotify('success', 'Đã tạo mới đợt đăng ký tín chỉ thành công.');
      }
      setShowModal(false);
      loadPeriods();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi lưu đợt đăng ký');
    }
  };

  const handleToggleActive = async (p) => {
    try {
      await registrationPeriodApi.toggleActive(p.id);
      onNotify('success', `Đã ${p.active ? 'vô hiệu hóa' : 'kích hoạt'} đợt đăng ký ${p.name}`);
      loadPeriods();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi chuyển đổi trạng thái');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await registrationPeriodApi.delete(deleteTarget.id);
      onNotify('success', `Đã xóa đợt đăng ký ${deleteTarget.name}`);
      loadPeriods();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa đợt đăng ký');
    }
  };

  // Semesters list extracted from periods
  const semestersList = periods.map(p => ({
    id: p.semesterId,
    name: p.semesterName ? `${p.semesterName} (${p.academicYearName || ''})` : `Học kỳ ${p.semesterId}`
  })).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Đợt Đăng Ký Tín Chỉ</h1>
          <p className="text-xs text-slate-400 mt-1">Cấu hình thời gian mở cổng đăng ký tín chỉ học phần và giới hạn tín chỉ cho sinh viên</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadPeriods}
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
              <span>Tạo Đợt Đăng Ký</span>
            </button>
          )}
        </div>
      </div>

      <RegistrationPeriodTable
        periods={periods}
        loading={loading}
        isAdmin={isAdmin}
        onOpenCreate={handleOpenCreate}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={(p) => setDeleteTarget(p)}
        onToggleActive={handleToggleActive}
      />

      <RegistrationPeriodFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        semesters={semestersList}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Xác nhận xóa đợt đăng ký tín chỉ"
        message={deleteTarget ? `Bạn có chắc chắn muốn xóa đợt đăng ký '${deleteTarget.name}' (#${deleteTarget.id}) không?` : ''}
        confirmText="Xóa đợt đăng ký"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
        isDanger={true}
      />
    </div>
  );
}
