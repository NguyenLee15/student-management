// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function FacultyFormModal({
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
      title={isEdit ? "Chỉnh Sửa Khoa Đào Tạo" : "Thêm Khoa Đào Tạo Mới"}
      subtitle={isEdit ? `Cập nhật thông tin mã khoa ${formData.facultyId}` : "Nhập mã và tên khoa chuyên môn mới"}
      maxWidth="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Mã Khoa (VD: CNTT, DTVT)</label>
          <input
            type="text"
            required
            disabled={isEdit}
            value={formData.facultyId}
            onChange={(e) => setFormData({ ...formData, facultyId: e.target.value.toUpperCase() })}
            placeholder="CNTT"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Tên Khoa Đào Tạo</label>
          <input
            type="text"
            required
            value={formData.facultyName}
            onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
            placeholder="Khoa Công Nghệ Thông Tin"
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
