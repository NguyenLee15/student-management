// cSpell:disable
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Download } from 'lucide-react';
import { subjectApi, facultyApi } from '../../api';
import ConfirmDialog from '../common/ConfirmDialog';
import SubjectTable from './subject/SubjectTable';
import SubjectFormModal from './subject/SubjectFormModal';

export default function SubjectModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedType, setSelectedType] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    subjectId: '',
    subjectName: '',
    credits: 3,
    tuitionPerCredit: 500000,
    subjectType: 'MAJOR',
    facultyId: '',
    prerequisiteSubjectId: '',
    attendanceWeight: 0.10,
    midtermWeight: 0.30,
    finalExamWeight: 0.60,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadFaculties();
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [page, size, selectedType, selectedFaculty]);

  const loadFaculties = async () => {
    try {
      const res = await facultyApi.getAll({ unpaged: true });
      const d = res.data || res;
      setFaculties(Array.isArray(d) ? d : d.content || []);
    } catch (e) {
      console.warn('Lỗi khi tải danh sách khoa', e);
    }
  };

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const res = await subjectApi.getAll({
        page,
        size,
        subjectType: selectedType || undefined,
        facultyId: selectedFaculty || undefined,
      });
      const d = res.data || res;
      if (d && d.content) {
        setSubjects(d.content);
        setTotalPages(d.totalPages || 1);
        setTotalElements(d.totalElements || d.content.length);
      } else if (Array.isArray(d)) {
        setSubjects(d);
        setTotalPages(1);
        setTotalElements(d.length);
      }
    } catch (err) {
      console.warn('Lỗi khi tải danh sách môn học', err);
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

  const handleOpenEdit = (s) => {
    setIsEdit(true);
    setFormData({
      subjectId: s.subjectId,
      subjectName: s.subjectName,
      credits: s.credits || 3,
      tuitionPerCredit: s.tuitionPerCredit || 500000,
      subjectType: s.subjectType || 'MAJOR',
      facultyId: s.facultyId || faculties[0]?.facultyId || '',
      prerequisiteSubjectId: s.prerequisiteSubjectId || '',
      attendanceWeight: s.attendanceWeight != null ? Number(s.attendanceWeight) : 0.10,
      midtermWeight: s.midtermWeight != null ? Number(s.midtermWeight) : 0.30,
      finalExamWeight: s.finalExamWeight != null ? Number(s.finalExamWeight) : 0.60,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const attW = Number(formData.attendanceWeight);
    const midW = Number(formData.midtermWeight);
    const finW = Number(formData.finalExamWeight);
    const sumW = Math.round((attW + midW + finW) * 100) / 100;
    if (Math.abs(sumW - 1.0) > 0.001) {
      onNotify('error', `Tổng trọng số điểm (Chuyên cần + Giữa kỳ + Cuối kỳ) phải bằng đúng 1.00 (100%). Hiện tại: ${sumW}`);
      return;
    }
    const payload = {
      ...formData,
      attendanceWeight: attW,
      midtermWeight: midW,
      finalExamWeight: finW,
    };
    try {
      if (isEdit) {
        await subjectApi.update(formData.subjectId, payload);
        onNotify('success', `Học phần ${formData.subjectId} đã được cập nhật thành công!`);
      } else {
        await subjectApi.create(payload);
        onNotify('success', `Học phần ${formData.subjectId} đã được tạo mới thành công!`);
      }
      setShowModal(false);
      loadSubjects();
    } catch (err) {
      onNotify('error', err?.response?.data?.message || err?.message || 'Lỗi khi lưu thông tin học phần');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await subjectApi.delete(deleteTarget.subjectId);
      onNotify('success', `Học phần ${deleteTarget.subjectId} đã được xóa!`);
      loadSubjects();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa học phần');
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await subjectApi.exportExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DanhSachMonHoc_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      onNotify('success', 'Xuất báo cáo Excel môn học thành công!');
    } catch {
      onNotify('error', 'Xuất file Excel môn học thất bại.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Danh Sách Học Phần & Môn Học</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý chương trình đào tạo, số tín chỉ, học phí và môn học tiên quyết</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-800 transition shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Xuất Excel</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm Môn Học</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="panel-card p-4 flex flex-wrap items-center gap-3">
        <select
          value={selectedType}
          onChange={(e) => { setSelectedType(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 transition"
        >
          <option value="">Tất cả loại học phần</option>
          <option value="GENERAL_EDUCATION">Giáo dục đại cương</option>
          <option value="BASIC">Cơ sở ngành</option>
          <option value="MAJOR">Chuyên ngành</option>
          <option value="SPECIALIZED">Chuyên sâu</option>
          <option value="ELECTIVE">Tự chọn</option>
        </select>

        <select
          value={selectedFaculty}
          onChange={(e) => { setSelectedFaculty(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 transition"
        >
          <option value="">Tất cả Khoa quản lý</option>
          {faculties.map((f) => (
            <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
          ))}
        </select>

        <button
          onClick={loadSubjects}
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition ml-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Subjects Table */}
      <SubjectTable
        subjects={subjects}
        loading={loading}
        isAdmin={isAdmin}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={(s) => setDeleteTarget(s)}
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
      />

      {/* Subject Form Modal */}
      <SubjectFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        faculties={faculties}
        onSubmit={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Xác nhận xóa môn học"
        message={deleteTarget ? `Bạn có chắc chắn muốn xóa môn học '${deleteTarget.subjectName}' (${deleteTarget.subjectId}) không? Thao tác này không thể hoàn tác.` : ''}
        confirmText="Xóa môn học"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDestructive={true}
      />
    </div>
  );
}
