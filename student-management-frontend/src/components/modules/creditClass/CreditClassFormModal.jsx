// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function CreditClassFormModal({
  isOpen,
  onClose,
  isEdit = false,
  formData,
  setFormData,
  subjects = [],
  teachers = [],
  classrooms = [],
  academicYears = [],
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Cập nhật Lớp Tín Chỉ' : 'Mở Lớp Tín Chỉ Mới (Học phần)'}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Tên lớp tín chỉ *</label>
          <input
            type="text"
            required
            placeholder="VD: Lập trình Java - Nhóm 01"
            value={formData.creditClassName}
            onChange={(e) => setFormData({ ...formData, creditClassName: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Môn học *</label>
            <select
              required
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Chọn môn học</option>
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>
                  {s.subjectName} ({s.subjectId})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Giảng viên phụ trách</label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Chưa phân công</option>
              {teachers.map((t) => (
                <option key={t.teacherId} value={t.teacherId}>
                  {t.fullName} ({t.teacherId})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phòng học dự kiến</label>
            <select
              value={formData.classroomId}
              onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Chưa xếp phòng</option>
              {classrooms.map((cr) => (
                <option key={cr.roomId || cr.classroomId} value={cr.roomId || cr.classroomId}>
                  {cr.roomName || cr.roomId} ({cr.capacity ? `${cr.capacity} chỗ` : 'Tiêu chuẩn'})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Niên khóa *</label>
            <select
              required
              value={formData.academicYearId}
              onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="">Chọn niên khóa</option>
              {academicYears.map((ay) => (
                <option key={ay.academicYearId} value={ay.academicYearId}>
                  {ay.academicYearName || ay.academicYearId}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Học kỳ *</label>
            <select
              required
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Sĩ số tối đa</label>
            <input
              type="number"
              min="10"
              max="150"
              value={formData.maxStudents}
              onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo lớp tín chỉ'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

