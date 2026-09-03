// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function BatchClassModal({
  isOpen,
  onClose,
  selectedCount = 0,
  classes = [],
  batchClassId,
  setBatchClassId,
  onSubmit,
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chuyển lớp hàng loạt cho sinh viên"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <p className="text-xs text-slate-400">
          Bạn đang chọn <strong className="text-indigo-400 font-bold">{selectedCount}</strong> sinh viên. Vui lòng chọn lớp học mới để cập nhật cho toàn bộ danh sách đã chọn.
        </p>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Lớp học mới tiếp nhận *
          </label>
          <select
            required
            value={batchClassId}
            onChange={(e) => setBatchClassId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- Chọn lớp hành chính --</option>
            {classes.map((c) => (
              <option key={c.classId} value={c.classId}>
                {c.className || c.classId}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || !batchClassId}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Đang chuyển lớp...' : 'Xác nhận chuyển lớp'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

