// cSpell:disable
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Receipt } from 'lucide-react';
import { tuitionPolicyApi, facultyApi, registrationPeriodApi } from '../../api';
import ConfirmDialog from '../common/ConfirmDialog';
import TuitionPolicyTable from './tuitionPolicy/TuitionPolicyTable';
import TuitionPolicyFormModal from './tuitionPolicy/TuitionPolicyFormModal';

export default function TuitionPolicyModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [policies, setPolicies] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    semesterId: 1,
    facultyId: null,
    unitPricePerCredit: 450000,
    effectiveDate: new Date().toISOString().slice(0, 10),
    active: true,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadDependencies();
    loadPolicies();
  }, []);

  const loadDependencies = async () => {
    try {
      const [facRes, periodRes] = await Promise.allSettled([
        facultyApi.getAll({ unpaged: true }),
        registrationPeriodApi.getAll(),
      ]);

      if (facRes.status === 'fulfilled') {
        const d = facRes.value.data || facRes.value;
        setFaculties(Array.isArray(d) ? d : d.content || []);
      }

      if (periodRes.status === 'fulfilled') {
        const d = periodRes.value.data || periodRes.value;
        const periods = Array.isArray(d) ? d : d.content || [];
        const sems = periods.map(p => ({
          id: p.semesterId,
          name: p.semesterName ? `${p.semesterName} (${p.academicYearName || ''})` : `Học kỳ ${p.semesterId}`
        })).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        setSemesters(sems);
      }
    } catch (e) {
      console.warn('Lỗi khi tải danh mục phụ thuộc', e);
    }
  };

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const res = await tuitionPolicyApi.getAll();
      const d = res.data || res;
      setPolicies(Array.isArray(d) ? d : d.content || []);
    } catch (err) {
      console.warn('Lỗi khi tải chính sách học phí', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setEditingId(null);
    setFormData({
      semesterId: semesters[0]?.id || 1,
      facultyId: null,
      unitPricePerCredit: 450000,
      effectiveDate: new Date().toISOString().slice(0, 10),
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setIsEdit(true);
    setEditingId(p.id);
    setFormData({
      semesterId: p.semesterId || 1,
      facultyId: p.facultyId || null,
      unitPricePerCredit: p.unitPricePerCredit || 450000,
      effectiveDate: p.effectiveDate ? p.effectiveDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
      active: p.active !== undefined ? p.active : true,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && editingId) {
        await tuitionPolicyApi.update(editingId, formData);
        onNotify('success', 'Đã cập nhật chính sách học phí thành công.');
      } else {
        await tuitionPolicyApi.create(formData);
        onNotify('success', 'Đã tạo mới chính sách học phí thành công.');
      }
      setShowModal(false);
      loadPolicies();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi lưu chính sách học phí');
    }
  };

  const handleToggleActive = async (p) => {
    try {
      await tuitionPolicyApi.toggleActive(p.id);
      onNotify('success', `Đã ${p.active ? 'tắt' : 'bật'} kích hoạt biểu phí học phí`);
      loadPolicies();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi chuyển đổi trạng thái');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await tuitionPolicyApi.delete(deleteTarget.id);
      onNotify('success', 'Đã xóa chính sách học phí thành công.');
      loadPolicies();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa chính sách học phí');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Chính Sách Học Phí</h1>
          <p className="text-xs text-slate-400 mt-1">Cấu hình đơn giá mỗi tín chỉ áp dụng theo học kỳ và từng khoa viện đào tạo</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadPolicies}
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
              <span>Thêm Biểu Phí Mới</span>
            </button>
          )}
        </div>
      </div>

      <TuitionPolicyTable
        policies={policies}
        loading={loading}
        isAdmin={isAdmin}
        onOpenCreate={handleOpenCreate}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={(p) => setDeleteTarget(p)}
        onToggleActive={handleToggleActive}
      />

      <TuitionPolicyFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        semesters={semesters}
        faculties={faculties}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Xác nhận xóa chính sách học phí"
        message={deleteTarget ? `Bạn có chắc chắn muốn xóa biểu phí '${deleteTarget.scope}' (#${deleteTarget.id})?` : ''}
        confirmText="Xóa biểu phí"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
        isDanger={true}
      />
    </div>
  );
}
