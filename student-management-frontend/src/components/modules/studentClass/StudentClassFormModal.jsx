// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function StudentClassFormModal({
  isOpen = false,
  onClose,
  isEdit = false,
  formData,
  setFormData,
  faculties = [],
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Cập Nhật Lớp Hành Chính' : 'Thêm Lớp Hành Chính Mới'}
      subtitle="Thiết lập mã lớp, tên lớp danh nghĩa và khoa chủ quản"
      maxWidth="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Mã Lớp Hành Chính*</label>
          <input
            type="text"
            required
            disabled={isEdit}
            placeholder="VD: D21CNPM01"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            className={`w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500 ${
              isEdit ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Tên Lớp Hành Chính*</label>
          <input
            type="text"
            required
            placeholder="VD: Lớp Công Nghệ Phần Mềm 1"
            value={formData.className}
            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Khoa Đào Tạo Trực Thuộc*</label>
          <select
            value={formData.facultyId}
            onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {faculties.map((f) => (
              <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
            ))}
          </select>
        </div>

        <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-600/30 transition"
          >
            {isEdit ? 'Lưu Thay Đổi' : 'Thêm Lớp Mới'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
