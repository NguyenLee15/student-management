// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function UserFormModal({
  isOpen = false,
  onClose,
  formData,
  setFormData,
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Tài Khoản Người Dùng Mới"
      subtitle="Nhập tên đăng nhập, mật khẩu và phân quyền truy cập"
      maxWidth="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Tên Đăng Nhập*</label>
          <input
            type="text"
            required
            placeholder="VD: giangvien_an"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Mật Khẩu Khởi Tạo*</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Vai Trò Phân Quyền*</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="ROLE_TEACHER">Giảng viên</option>
            <option value="ROLE_STUDENT">Sinh viên</option>
            <option value="ROLE_ADMIN">Quản trị viên</option>
          </select>
        </div>

        {formData.role === 'ROLE_STUDENT' && (
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mã Sinh Viên Liên Kết *</label>
            <input
              type="text"
              required
              placeholder="VD: SV20210001"
              value={formData.studentId || ''}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>
        )}

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
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/30 transition"
          >
            Tạo Tài Khoản
          </button>
        </div>
      </form>
    </Modal>
  );
}

