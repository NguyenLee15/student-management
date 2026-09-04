// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function RegistrationPeriodFormModal({
  isOpen,
  onClose,
  isEdit,
  formData,
  setFormData,
  semesters = [],
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Chỉnh Sửa Đợt Đăng Ký Tín Chỉ" : "Tạo Đợt Đăng Ký Tín Chỉ Mới"}
      subtitle="Cấu hình thời gian bắt đầu, kết thúc và giới hạn tín chỉ cho sinh viên"
      maxWidth="max-w-lg"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Tên Đợt Đăng Ký</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Đợt 1 - Học kỳ 1 Năm học 2026-2027"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Học Kỳ Áp Dụng</label>
            <select
              value={formData.semesterId}
              onChange={(e) => setFormData({ ...formData, semesterId: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            >
              {semesters.length > 0 ? (
                semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))
              ) : (
                <>
                  <option value={1}>Học kỳ 1 (2026-2027)</option>
                  <option value={2}>Học kỳ 2 (2026-2027)</option>
                  <option value={3}>Học kỳ Hè (2026-2027)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Số Tín Chỉ Tối Đa Cho Phép</label>
            <input
              type="number"
              min={1}
              max={40}
              required
              value={formData.maxCreditsAllowed}
              onChange={(e) => setFormData({ ...formData, maxCreditsAllowed: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Thời Gian Mở Đăng Ký</label>
            <input
              type="datetime-local"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Thời Gian Đóng Đăng Ký</label>
            <input
              type="datetime-local"
              required
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="activeCheckbox"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
          />
          <label htmlFor="activeCheckbox" className="text-slate-300 font-medium cursor-pointer">
            Kích hoạt đợt đăng ký ngay sau khi lưu
          </label>
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
            {isEdit ? "Cập Nhật" : "Tạo Đợt Đăng Ký"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
