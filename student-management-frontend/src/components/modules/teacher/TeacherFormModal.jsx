// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function TeacherFormModal({
  isOpen,
  onClose,
  isEdit,
  formData,
  setFormData,
  faculties = [],
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Sửa Thông Tin Giảng Viên: ${formData.teacherId}` : 'Thêm Giảng Viên Mới'}
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Mã Giảng Viên*</label>
          <input
            type="text"
            required
            disabled={isEdit}
            placeholder="VD: GV001..."
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Họ và Tên Giảng Viên*</label>
          <input
            type="text"
            required
            placeholder="VD: TS. Nguyễn Văn A..."
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Khoa / Bộ Môn Phụ Trách*</label>
          <select
            value={formData.facultyId}
            onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {faculties.map((f) => (
              <option key={f.facultyId} value={f.facultyId}>
                {f.facultyName || f.facultyId}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Email Công Vụ</label>
          <input
            type="email"
            placeholder="VD: giangvien@university.edu.vn..."
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
          />
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
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition"
          >
            {isEdit ? 'Lưu Thay Đổi' : 'Thêm Giảng Viên'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

