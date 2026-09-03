// cSpell:disable
import React, { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Download } from 'lucide-react';
import { teacherApi, facultyApi } from '../../api';
import { msg } from '../../lib/messages';
import ConfirmDialog from '../common/ConfirmDialog';
import TeacherTable from './teacher/TeacherTable';
import TeacherFormModal from './teacher/TeacherFormModal';

export default function TeacherModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [keyword, setKeyword] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [faculties, setFaculties] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    teacherId: '',
    fullName: '',
    email: '',
    facultyId: '',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadFaculties();
  }, []);

  useEffect(() => {
    loadTeachers();
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

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getAll({
        page,
        size,
        keyword: keyword || undefined,
        facultyId: selectedFaculty || undefined,
      });
      const pageData = res.data || res;
      if (pageData && pageData.content) {
        setTeachers(pageData.content);
        setTotalPages(pageData.totalPages || 1);
        setTotalElements(pageData.totalElements || pageData.content.length);
      } else if (Array.isArray(pageData)) {
        setTeachers(pageData);
        setTotalPages(1);
        setTotalElements(pageData.length);
      }
    } catch (err) {
      console.warn('Lỗi khi tải danh sách giảng viên', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadTeachers();
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData({
      ...initialForm,
      facultyId: faculties[0]?.facultyId || '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setIsEdit(true);
    setFormData({
      teacherId: t.teacherId,
      fullName: t.fullName,
      email: t.email || '',
      facultyId: t.facultyId || '',
    });
    setShowModal(true);
  };

  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    if (!formData.teacherId?.trim()) {
      onNotify('error', 'Mã giảng viên không được để trống.');
      return;
    }
    if (!formData.fullName?.trim() || formData.fullName.trim().length < 2) {
      onNotify('error', 'Họ và tên giảng viên phải có ít nhất 2 ký tự.');
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      onNotify('error', 'Địa chỉ email không đúng định dạng.');
      return;
    }
    try {
      if (isEdit) {
        await teacherApi.update(formData.teacherId, formData);
        onNotify('success', msg.success.updated('giảng viên', formData.teacherId));
      } else {
        await teacherApi.create(formData);
        onNotify('success', msg.success.created('giảng viên', formData.teacherId));
      }
      setShowModal(false);
      loadTeachers();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi lưu giảng viên');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await teacherApi.delete(deleteTarget.teacherId);
      onNotify('success', msg.success.deleted('giảng viên', deleteTarget.teacherId));
      loadTeachers();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa giảng viên');
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await teacherApi.exportExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DanhSachGiangVien_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      onNotify('success', 'Xuất báo cáo Excel giảng viên thành công!');
    } catch (err) {
      onNotify('error', 'Xuất file Excel thất bại.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Hồ Sơ Cán Bộ & Giảng Viên</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý hồ sơ giảng viên, học hàm học vị, phân công khoa và liên hệ</p>
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
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm Giảng Viên Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="panel-card p-4 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã giảng viên (VD: GV001)..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          />
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedFaculty}
            onChange={(e) => { setSelectedFaculty(e.target.value); setPage(0); }}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">Tất cả các Khoa</option>
            {faculties.map((f) => (
              <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
            ))}
          </select>

          <button
            onClick={loadTeachers}
            title="Làm mới"
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Teacher Table Component */}
      <TeacherTable
        teachers={teachers}
        loading={loading}
        isAdmin={isAdmin}
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
        onEdit={handleOpenEdit}
        onDelete={(t) => setDeleteTarget(t)}
      />

      {/* Teacher Form Modal */}
      <TeacherFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        faculties={faculties}
        onSubmit={handleSaveTeacher}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Giảng Viên"
        message={msg.confirm.delete('giảng viên', deleteTarget?.fullName, deleteTarget?.teacherId)}
      />
    </div>
  );
}
