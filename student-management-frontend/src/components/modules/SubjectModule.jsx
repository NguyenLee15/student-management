import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, BookOpen, RefreshCw, GitBranch, Download } from 'lucide-react';
import { subjectApi, facultyApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Skeleton from '../common/Skeleton';

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
      console.warn('Faculties load err', e);
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
      console.warn('Err load subjects', err);
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
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await subjectApi.update(formData.subjectId, formData);
        onNotify('success', `Học phần ${formData.subjectId} đã được cập nhật thành công!`);
      } else {
        await subjectApi.create(formData);
        onNotify('success', `Học phần ${formData.subjectId} đã được tạo mới thành công!`);
      }
      setShowModal(false);
      loadSubjects();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi lưu thông tin học phần');
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Academic Học Phầns & Modules</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý chương trình đào tạo, số tín chỉ, học phí và môn học tiên quyết</p>
        </div>

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

      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
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

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Mã Môn</th>
                <th className="px-5 py-3.5">Tên Môn Học</th>
                <th className="px-5 py-3.5">Phân Loại & Khoa</th>
                <th className="px-5 py-3.5">Số Tín Chỉ</th>
                <th className="px-5 py-3.5">Môn Tiên Quyết</th>
                <th className="px-5 py-3.5">Học Phí / Tín</th>
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
                      <td className="px-5 py-4"><Skeleton className="h-4 w-12" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-8" /></td>
                    </tr>
                  ))
                ) : subjects.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-0">
                      <EmptyState title="Không tìm thấy môn học" message="Không có môn học nào khớp với điều kiện tìm kiếm hiện tại." />
                    </td>
                  </tr>
                ) : subjects.map((s) => (
                <tr key={s.subjectId} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5 font-bold text-cyan-400 font-mono">{s.subjectId}</td>
                  <td className="px-5 py-3.5 font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <span>{s.subjectName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-medium">
                      {s.subjectType || 'MAJOR'}
                    </span>
                    <span className="ml-2 text-slate-400">({s.facultyName || s.facultyId})</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-400">{s.credits} TC</td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {s.prerequisiteSubjectId ? (
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <GitBranch className="h-3.5 w-3.5" />
                        <span className="font-mono">{s.prerequisiteSubjectId}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">Không</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-300">
                    {(s.tuitionPerCredit || 500000).toLocaleString('vi-VN')} đ
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? `Cập nhật Môn Học: ${formData.subjectId}` : 'Tạo Mới Học Phần'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mã Học Phần*</label>
              <input
                type="text"
                required
                disabled={isEdit}
                placeholder="VD: JAVA01"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-50 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tên Học Phần*</label>
              <input
                type="text"
                required
                placeholder="VD: Lập trình Java căn bản"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Số Tín Chỉ (TC)*</label>
              <input
                type="number"
                min="1"
                max="10"
                required
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Học Phí / Tín Chỉ (VNĐ)*</label>
              <input
                type="number"
                min="100000"
                step="50000"
                required
                value={formData.tuitionPerCredit}
                onChange={(e) => setFormData({ ...formData, tuitionPerCredit: parseInt(e.target.value) || 500000 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Khoa Quản Lý</label>
              <select
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {faculties.map((f) => (
                  <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phân Loại Học Phần</label>
              <select
                value={formData.subjectType}
                onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="GENERAL_EDUCATION">Giáo dục đại cương</option>
                <option value="BASIC">Cơ sở ngành</option>
                <option value="MAJOR">Chuyên ngành</option>
                <option value="SPECIALIZED">Chuyên sâu</option>
                <option value="ELECTIVE">Tự chọn</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Môn Học Tiên Quyết (Prerequisite)</label>
              <select
                value={formData.prerequisiteSubjectId || ''}
                onChange={(e) => setFormData({ ...formData, prerequisiteSubjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Không có môn tiên quyết --</option>
                {subjects
                  .filter((s) => s.subjectId !== formData.subjectId)
                  .map((s) => (
                    <option key={s.subjectId} value={s.subjectId}>
                      {s.subjectId} - {s.subjectName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-600/30 transition"
            >
              {isEdit ? 'Lưu Thay Đổi' : 'Tạo Môn Học'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Học Phần"
        message={`Bạn có chắc chắn muốn xóa học phần "${deleteTarget?.subjectName}" (Mã: ${deleteTarget?.subjectId}) không?`}
      />
    </div>
  );
}




