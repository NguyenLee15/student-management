// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function GradeFormModal({
  isOpen,
  onClose,
  isEdit = false,
  formData,
  setFormData,
  students = [],
  subjects = [],
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Cập nhật điểm học phần #${formData.gradeId}` : 'Nhập điểm học phần mới'}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Sinh viên *</label>
            <select
              required
              disabled={isEdit}
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            >
              <option value="">Chọn sinh viên</option>
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.fullName} ({s.studentId})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Môn học *</label>
            <select
              required
              disabled={isEdit}
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            >
              <option value="">Chọn môn học</option>
              {subjects.map((sub) => (
                <option key={sub.subjectId} value={sub.subjectId}>
                  {sub.subjectName} ({sub.subjectId})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Chuyên cần (10%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0-10"
              value={formData.attendanceScore}
              onChange={(e) => setFormData({ ...formData, attendanceScore: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Giữa kỳ (30%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0-10"
              value={formData.midtermScore}
              onChange={(e) => setFormData({ ...formData, midtermScore: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Thi cuối kỳ (60%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0-10"
              value={formData.finalExamScore}
              onChange={(e) => setFormData({ ...formData, finalExamScore: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Học kỳ</label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="SEMESTER_1">Học kỳ 1</option>
              <option value="SEMESTER_2">Học kỳ 2</option>
              <option value="SUMMER_SEMESTER">Học kỳ hè (Phụ)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Năm học</label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
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
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition active:scale-95"
          >
            {isEdit ? 'Lưu điểm' : 'Tạo bản ghi điểm'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

