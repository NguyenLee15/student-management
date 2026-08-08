import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, BookOpen, RefreshCw, Layers } from 'lucide-react';
import { subjectApi, facultyApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';

export default function SubjectModule({ onNotify }) {
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
    theoryHours: 30,
    practiceHours: 15,
    subjectType: 'GENERAL',
    facultyId: '',
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
      facultyId: faculties[0]?.facultyId || 'CNTT',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setIsEdit(true);
    setFormData({
      subjectId: s.subjectId,
      subjectName: s.subjectName,
      credits: s.credits || 3,
      theoryHours: s.theoryHours || 30,
      practiceHours: s.practiceHours || 15,
      subjectType: s.subjectType || 'GENERAL',
      facultyId: s.facultyId || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await subjectApi.update(formData.subjectId, formData);
        onNotify('success', `Subject ${formData.subjectId} updated!`);
      } else {
        await subjectApi.create(formData);
        onNotify('success', `Subject ${formData.subjectId} created!`);
      }
      setShowModal(false);
      loadSubjects();
    } catch (err) {
      onNotify('error', err?.message || 'Error saving subject');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await subjectApi.delete(deleteTarget.subjectId);
      onNotify('success', `Subject ${deleteTarget.subjectId} deleted!`);
      loadSubjects();
    } catch (err) {
      onNotify('error', err?.message || 'Error deleting subject');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Academic Subjects & Modules</h1>
          <p className="text-xs text-slate-400 mt-1">Curriculum syllabus, credit allocations, and theoretical/practical credits</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Subject</span>
        </button>
      </div>

      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
        <select
          value={selectedType}
          onChange={(e) => { setSelectedType(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 transition"
        >
          <option value="">All Subject Types</option>
          <option value="GENERAL">General Education (Đại cương)</option>
          <option value="SPECIALIZED">Specialized (Chuyên ngành)</option>
          <option value="CORE">Core Fundamental (Cơ sở ngành)</option>
          <option value="ELECTIVE">Elective (Tự chọn)</option>
        </select>

        <select
          value={selectedFaculty}
          onChange={(e) => { setSelectedFaculty(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 transition"
        >
          <option value="">All Faculties</option>
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
                <th className="px-5 py-3.5">Subject Code</th>
                <th className="px-5 py-3.5">Subject Name</th>
                <th className="px-5 py-3.5">Type & Faculty</th>
                <th className="px-5 py-3.5">Credits</th>
                <th className="px-5 py-3.5">Theory / Practice</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {subjects.map((s) => (
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
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                      {s.subjectType || 'SPECIALIZED'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-400">{s.credits} ECTS</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                    {s.theoryHours || 30}h / {s.practiceHours || 15}h
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
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
        title={isEdit ? `Edit Subject: ${formData.subjectId}` : 'Create Academic Subject'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject Code (Mã Học Phần)*</label>
              <input
                type="text"
                required
                disabled={isEdit}
                placeholder="e.g. IT2001"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject Title (Tên Học Phần)*</label>
              <input
                type="text"
                required
                placeholder="e.g. Lập trình Hướng đối tượng"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Credits (Tín chỉ)*</label>
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
              <label className="block text-slate-300 font-semibold mb-1">Subject Type</label>
              <select
                value={formData.subjectType}
                onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="GENERAL">General (Đại cương)</option>
                <option value="SPECIALIZED">Specialized (Chuyên ngành)</option>
                <option value="CORE">Core (Cơ sở ngành)</option>
                <option value="ELECTIVE">Elective (Tự chọn)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Faculty (Khoa)</label>
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
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-600/30 transition"
            >
              {isEdit ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Subject"
        message={`Are you sure you want to remove subject "${deleteTarget?.subjectName}" (ID: ${deleteTarget?.subjectId})?`}
      />
    </div>
  );
}
