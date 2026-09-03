// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function ScheduleFormModal({
  isOpen,
  onClose,
  isEdit,
  formData,
  setFormData,
  creditClasses = [],
  teachers = [],
  classrooms = [],
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Sửa Lịch Học #${formData.scheduleId}` : 'Thêm Lịch Học'}
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Lớp Tín Chỉ*</label>
            <select
              value={formData.creditClassId}
              onChange={(e) => {
                const val = parseInt(e.target.value) || e.target.value;
                const cc = creditClasses.find(c => String(c.creditClassId) === String(val));
                setFormData({
                  ...formData,
                  creditClassId: val,
                  subjectId: cc?.subjectId || formData.subjectId,
                  teacherId: cc?.teacherId || formData.teacherId,
                  roomId: cc?.classroomId || formData.roomId,
                  semester: cc?.semester || formData.semester,
                  academicYear: cc?.academicYearId || cc?.academicYearName || formData.academicYear || '2026-2027',
                });
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
            >
              {creditClasses.map((cc) => (
                <option key={cc.creditClassId} value={cc.creditClassId}>
                  {cc.subjectName || cc.subjectId} (Mã LTC: {cc.creditClassId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Giảng Viên Phụ Trách*</label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
            >
              {teachers.map((t) => (
                <option key={t.teacherId} value={t.teacherId}>{t.fullName} ({t.teacherId})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Phòng Học / Giảng Đường*</label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
            >
              {classrooms.map((cr) => (
                <option key={cr.roomId} value={cr.roomId}>{cr.roomName || cr.roomId}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Thứ *</label>
            <select
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) || 2 })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value={2}>Thứ 2</option>
              <option value={3}>Thứ 3</option>
              <option value={4}>Thứ 4</option>
              <option value={5}>Thứ 5</option>
              <option value={6}>Thứ 6</option>
              <option value={7}>Thứ 7</option>
              <option value={8}>Chủ Nhật</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Ca Học *</label>
            <select
              value={formData.classShift}
              onChange={(e) => setFormData({ ...formData, classShift: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="SHIFT_1">Ca 1 (07:00 - 09:15)</option>
              <option value="SHIFT_2">Ca 2 (09:30 - 11:45)</option>
              <option value="SHIFT_3">Ca 3 (13:00 - 15:15)</option>
              <option value="SHIFT_4">Ca 4 (15:30 - 17:45)</option>
              <option value="SHIFT_5">Ca 5 (18:00 - 20:15)</option>
            </select>
          </div>
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
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg shadow-teal-600/30 transition"
          >
            {isEdit ? 'Lưu thay đổi' : 'Lưu lịch học'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

