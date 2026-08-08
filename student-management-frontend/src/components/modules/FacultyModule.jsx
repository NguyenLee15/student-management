import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Building2, RefreshCw, Layers } from 'lucide-react';
import { facultyApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';

export default function FacultyModule({ onNotify }) {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = { facultyId: '', facultyName: '' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    setLoading(true);
    try {
      const res = await facultyApi.getAll({ unpaged: true });
      const data = res.data || res;
      setFaculties(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      console.warn('Failed loading faculties', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (f) => {
    setIsEdit(true);
    setFormData({ facultyId: f.facultyId, facultyName: f.facultyName });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await facultyApi.update(formData.facultyId, formData);
        onNotify('success', `Faculty ${formData.facultyId} updated!`);
      } else {
        await facultyApi.create(formData);
        onNotify('success', `Faculty ${formData.facultyId} created!`);
      }
      setShowModal(false);
      loadFaculties();
    } catch (err) {
      onNotify('error', err?.message || 'Error saving faculty');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await facultyApi.delete(deleteTarget.facultyId);
      onNotify('success', `Faculty ${deleteTarget.facultyId} deleted!`);
      loadFaculties();
    } catch (err) {
      onNotify('error', err?.message || 'Error deleting faculty');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Academic Faculties & Schools</h1>
          <p className="text-xs text-slate-400 mt-1">Colleges, specialized schools, and academic departments</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-600/30 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Faculty</span>
        </button>
      </div>

      {/* Grid of Faculties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {faculties.map((f) => (
          <div
            key={f.facultyId}
            className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-amber-300 rounded-lg">
                {f.facultyId}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{f.facultyName}</h3>
              <p className="text-xs text-slate-400 mt-1">Academic Department</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Department Status: <span className="text-emerald-400 font-semibold">Active</span></span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(f)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(f)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? `Edit Faculty: ${formData.facultyId}` : 'Create Academic Faculty'}
        subtitle="Specify official department code and title"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Faculty Code (Mã Khoa)*</label>
            <input
              type="text"
              required
              disabled={isEdit}
              placeholder="e.g. CNTT, DTVT, QTKD"
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Faculty Name (Tên Khoa)*</label>
            <input
              type="text"
              required
              placeholder="e.g. Khoa Công Nghệ Thông Tin"
              value={formData.facultyName}
              onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
            />
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
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 transition"
            >
              {isEdit ? 'Save Changes' : 'Create Faculty'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Faculty"
        message={`Are you sure you want to remove faculty "${deleteTarget?.facultyName}" (ID: ${deleteTarget?.facultyId})?`}
      />
    </div>
  );
}
