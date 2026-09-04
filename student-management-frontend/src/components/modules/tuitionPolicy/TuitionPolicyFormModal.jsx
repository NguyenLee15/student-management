// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function TuitionPolicyFormModal({
  isOpen,
  onClose,
  isEdit,
  formData,
  setFormData,
  semesters = [],
  faculties = [],
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Chỉnh Sửa Biểu Phí Học Phí" : "Thiết Lập Biểu Phí Học Phí Mới"}
      subtitle="Định mức đơn giá học phí cho mỗi tín chỉ áp dụng theo học kỳ hoặc khoa"
      maxWidth="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
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
          <label className="block text-slate-300 font-medium mb-1.5">Phạm Vi Khoa / Viện Áp Dụng</label>
          <select
            value={formData.facultyId || ''}
            onChange={(e) => setFormData({ ...formData, facultyId: e.target.value || null })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">Toàn Trường (Áp dụng cho mọi khoa)</option>
            {faculties.map((f) => (
              <option key={f.facultyId} value={f.facultyId}>
                {f.facultyName} ({f.facultyId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Đơn Giá Mỗi Tín Chỉ (VND)</label>
          <input
            type="number"
            min={10000}
            step={10000}
            required
            value={formData.unitPricePerCredit}
            onChange={(e) => setFormData({ ...formData, unitPricePerCredit: Number(e.target.value) })}
            placeholder="450000"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Ngày Hiệu Lực</label>
          <input
            type="date"
            required
            value={formData.effectiveDate}
            onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="tuitionActiveCheckbox"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
          />
          <label htmlFor="tuitionActiveCheckbox" className="text-slate-300 font-medium cursor-pointer">
            Kích hoạt biểu phí này
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
            {isEdit ? "Cập Nhật" : "Lưu Biểu Phí"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
