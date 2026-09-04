// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function AcademicYearFormModal({
  isOpen,
  onClose,
  isEdit,
  formData,
  setFormData,
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Chỉnh Sửa Niên Khóa" : "Thêm Niên Khóa Mới"}
      subtitle={isEdit ? `Cập nhật thông tin niên khóa ${formData.academicYearId}` : "Nhập mã và tên niên khóa / khóa tuyển sinh mới"}
      maxWidth="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Mã Niên Khóa (VD: K2023, K2024)</label>
          <input
            type="text"
            required
            disabled={isEdit}
            value={formData.academicYearId}
            onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value.toUpperCase() })}
            placeholder="K2024"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Tên Niên Khóa / Khóa Học</label>
          <input
            type="text"
            required
            value={formData.academicYearName}
            onChange={(e) => setFormData({ ...formData, academicYearName: e.target.value })}
            placeholder="Khóa Tuyển Sinh 2024 - 2028"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition active:scale-95"
          >
            {isEdit ? "Cập Nhật" : "Tạo Mới"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
