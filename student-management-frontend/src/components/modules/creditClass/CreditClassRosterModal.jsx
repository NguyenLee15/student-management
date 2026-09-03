// cSpell:disable
import React from 'react';
import { UserPlus, X } from 'lucide-react';
import Modal from '../../common/Modal';

export default function CreditClassRosterModal({
  isOpen,
  onClose,
  selectedClass,
  enrolledStudents = [],
  newStudentId,
  setNewStudentId,
  onAddStudent,
  onRemoveStudent,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Danh sách sinh viên: ${selectedClass?.subjectName || selectedClass?.creditClassName} (#${selectedClass?.creditClassId})`}
    >
      <div className="space-y-4">
        {/* Form add student to class */}
        <form onSubmit={onAddStudent} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Nhập mã sinh viên (VD: SV001)..."
            value={newStudentId}
            onChange={(e) => setNewStudentId(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition"
          >
            <UserPlus className="h-4 w-4" />
            <span>Thêm SV</span>
          </button>
        </form>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-800 border border-slate-800 rounded-xl">
          {enrolledStudents.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              Lớp tín chỉ này hiện chưa có sinh viên nào đăng ký.
            </div>
          ) : (
            enrolledStudents.map((st) => (
              <div key={st.studentId} className="p-3 flex items-center justify-between hover:bg-slate-800/30 transition text-xs">
                <div>
                  <div className="font-semibold text-white">{st.fullName}</div>
                  <div className="text-[10px] text-indigo-400 font-mono">
                    Mã SV: {st.studentId} • Lớp: {st.className || st.classId || 'Chưa xếp'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveStudent(st.studentId)}
                  title="Hủy ghi danh sinh viên khỏi lớp"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
          <span>Tổng số: <strong className="text-white">{enrolledStudents.length}</strong> sinh viên</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}

