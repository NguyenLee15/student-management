import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, UserSquare2, RefreshCw, Mail, Phone, Building2 
} from 'lucide-react';
import { teacherApi, facultyApi } from '../../api';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Skeleton from '../common/Skeleton';
import ConfirmDialog from '../common/ConfirmDialog';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Hồ Sơ Cán Bộ & Giảng Viên</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý hồ sơ giảng viên, học hàm học vị, phân công khoa và liên hệ</p>
        </div>

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

      {/* Table */}
      <div className="panel-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto" aria-live="polite">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Mã Giảng Viên</th>
                <th className="px-5 py-3.5">Họ và tên</th>
                <th className="px-5 py-3.5">Khoa / Viện Đào Tạo</th>
                <th className="px-5 py-3.5">Email Công Vụ</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-8" /></td>
                    </tr>
                  ))
                ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-0">
                    <EmptyState title="Không tìm thấy giảng viên" message="Không có giảng viên nào khớp với điều kiện tìm kiếm hiện tại." />
                  </td>
                </tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.teacherId} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-bold text-emerald-400 font-mono">{t.teacherId}</td>
                    <td className="px-5 py-3.5 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shadow-md">
                          {t.fullName?.charAt(0) || 'G'}
                        </div>
                        <span>{t.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
                        {t.facultyName || t.facultyId || 'Chưa phân khoa'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{t.email || '—'}</td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(t)}
                            title="Sửa Giảng Viên"
                            className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(t)}
                            title="Xóa Giảng viên"
                            className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          size={size}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? `Sửa Giảng Viên: ${formData.teacherId}` : 'Thêm Giảng Viên Mới'}
        subtitle="Nhập học vị, học hàm và khoa công tác"
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mã Giảng Viên *</label>
              <input
                type="text"
                required
                disabled={isEdit}
                placeholder="VD: GV001"
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Họ và Tên*</label>
              <input
                type="text"
                required
                placeholder="VD: TS. Nguyễn Văn Thức"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Khoa Chủ Quản*</label>
              <select
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {faculties.map((f) => (
                  <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Công Vụ*</label>
              <input
                type="email"
                required
                placeholder="thuc@eaut.edu.vn"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition"
            >
              {isEdit ? 'Lưu thay đổi' : 'Thêm Giảng Viên'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Giảng Viên"
        message={`Bạn có chắc chắn muốn xóa giảng viên "${deleteTarget?.fullName}" (ID: ${deleteTarget?.teacherId})?`}
      />
    </div>
  );
}




