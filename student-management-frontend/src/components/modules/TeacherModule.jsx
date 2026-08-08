import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, UserSquare2, RefreshCw, Mail, Phone, Building2 
} from 'lucide-react';
import { teacherApi, facultyApi } from '../../api';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import ConfirmDialog from '../common/ConfirmDialog';

export default function TeacherModule({ onNotify }) {
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
      console.warn('Faculties load err', e);
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
      console.warn('Failed loading teachers', err);
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
      facultyId: faculties[0]?.facultyId || 'CNTT',
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
    try {
      if (isEdit) {
        await teacherApi.update(formData.teacherId, formData);
        onNotify('success', `Teacher ${formData.teacherId} updated successfully!`);
      } else {
        await teacherApi.create(formData);
        onNotify('success', `Teacher ${formData.teacherId} created successfully!`);
      }
      setShowModal(false);
      loadTeachers();
    } catch (err) {
      onNotify('error', err?.message || 'Error saving teacher');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await teacherApi.delete(deleteTarget.teacherId);
      onNotify('success', `Teacher ${deleteTarget.teacherId} deleted successfully!`);
      loadTeachers();
    } catch (err) {
      onNotify('error', err?.message || 'Error deleting teacher');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Faculty & Lecturers</h1>
          <p className="text-xs text-slate-400 mt-1">Teaching staff profiles, department assignments, and contacts</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Lecturer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search lecturer by name or ID (e.g. GV001)..."
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
            <option value="">All Faculties</option>
            {faculties.map((f) => (
              <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
            ))}
          </select>

          <button
            onClick={loadTeachers}
            title="Refresh"
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Lecturer ID</th>
                <th className="px-5 py-3.5">Full Name</th>
                <th className="px-5 py-3.5">Department / Faculty</th>
                <th className="px-5 py-3.5">Official Email</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-slate-500">
                    {loading ? 'Fetching lecturers from database...' : 'No lecturers found.'}
                  </td>
                </tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.teacherId} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-bold text-emerald-400 font-mono">{t.teacherId}</td>
                    <td className="px-5 py-3.5 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                          {t.fullName?.charAt(0) || 'G'}
                        </div>
                        <span>{t.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
                        {t.facultyName || t.facultyId || 'Khoa CNTT'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{t.email || '—'}</td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        title="Edit Teacher"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(t)}
                        title="Delete Teacher"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
        title={isEdit ? `Edit Lecturer: ${formData.teacherId}` : 'Register New Faculty Member'}
        subtitle="Specify academic credentials and faculty department affiliation"
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Teacher ID (Mã GV)*</label>
              <input
                type="text"
                required
                disabled={isEdit}
                placeholder="e.g. GV001"
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name (Họ và Tên)*</label>
              <input
                type="text"
                required
                placeholder="e.g. TS. Nguyen Van Thuc"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department (Khoa)*</label>
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
              <label className="block text-slate-300 font-semibold mb-1">Official Email*</label>
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition"
            >
              {isEdit ? 'Save Changes' : 'Create Lecturer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Lecturer"
        message={`Are you sure you want to remove lecturer "${deleteTarget?.fullName}" (ID: ${deleteTarget?.teacherId})?`}
      />
    </div>
  );
}
