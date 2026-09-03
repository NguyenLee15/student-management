// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function SubjectFormModal({
  isOpen,
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
      title={isEdit ? `Cập nhật Môn học: ${formData.subjectId}` : 'Thêm Môn học Mới'}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mã môn học *</label>
            <input
              type="text"
              required
              disabled={isEdit}
              placeholder="VD: INT1306"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tên môn học *</label>
            <input
              type="text"
              required
              placeholder="VD: Cấu trúc dữ liệu và giải thuật"
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Số tín chỉ *</label>
            <input
              type="number"
              min="1"
              max="10"
              required
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Học phí / tín chỉ (VNĐ)</label>
            <input
              type="number"
              step="10000"
              value={formData.tuitionPerCredit}
              onChange={(e) => setFormData({ ...formData, tuitionPerCredit: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Khoa quản lý</label>
            <select
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="">Chọn Khoa</option>
              {faculties.map((f) => (
                <option key={f.facultyId} value={f.facultyId}>
                  {f.facultyName || f.facultyId}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Loại học phần</label>
            <select
              value={formData.subjectType}
              onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="GENERAL_EDUCATION">Giáo dục đại cương</option>
              <option value="BASIC">Cơ sở ngành</option>
              <option value="MAJOR">Chuyên ngành</option>
              <option value="SPECIALIZED">Chuyên sâu</option>
              <option value="ELECTIVE">Tự chọn</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mã môn tiên quyết (nếu có)</label>
            <input
              type="text"
              placeholder="VD: INT1155"
              value={formData.prerequisiteSubjectId}
              onChange={(e) => setFormData({ ...formData, prerequisiteSubjectId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Tỷ lệ điểm */}
        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
          <label className="block text-xs font-semibold text-cyan-400">
            Tỷ trọng thành phần điểm (Tổng phải bằng đúng 100% / 1.00)
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-slate-400">Chuyên cần</span>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={formData.attendanceWeight}
                onChange={(e) => setFormData({ ...formData, attendanceWeight: e.target.value })}
                className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Giữa kỳ</span>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={formData.midtermWeight}
                onChange={(e) => setFormData({ ...formData, midtermWeight: e.target.value })}
                className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Cuối kỳ</span>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={formData.finalExamWeight}
                onChange={(e) => setFormData({ ...formData, finalExamWeight: e.target.value })}
                className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
          </div>
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
            className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95"
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo môn học'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
