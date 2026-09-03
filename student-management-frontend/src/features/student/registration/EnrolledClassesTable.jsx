// cSpell:disable
import React from 'react';
import { BookOpen, CheckCircle, Trash2 } from 'lucide-react';
import EmptyState from '../../../components/common/EmptyState';

export default function EnrolledClassesTable({
  myEnrollments = [],
  enrolledCredits = 0,
  onDropCourse,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">
          Danh sách {myEnrollments.length} học phần chính thức đã đăng ký
        </span>
        <span className="text-sm font-bold text-blue-700">
          Tổng số tín chỉ: {enrolledCredits} / 24
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5">Mã & Tên Môn Học</th>
              <th className="px-4 py-3.5">Số TC</th>
              <th className="px-4 py-3.5">Giảng Viên</th>
              <th className="px-4 py-3.5">Phòng Học</th>
              <th className="px-4 py-3.5">Ngày Đăng Ký</th>
              <th className="px-4 py-3.5">Trạng Thái</th>
              <th className="px-5 py-3.5 text-center">Rút Môn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70">
            {myEnrollments.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12">
                  <EmptyState
                    icon={BookOpen}
                    title="Chưa có học phần nào được đăng ký"
                    description="Bạn chưa đăng ký lớp học phần nào trong học kỳ này. Hãy chuyển sang tab 'Môn Mở Đăng Ký' để bắt đầu chọn môn."
                  />
                </td>
              </tr>
            ) : (
              myEnrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-xs rounded mb-1">
                      {enr.subjectId}
                    </span>
                    <div className="font-bold text-slate-900">{enr.subjectName}</div>
                    <div className="text-xs text-slate-400">{enr.classCode}</div>
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-800">{enr.credits}</td>
                  <td className="px-4 py-4 text-slate-700">{enr.teacherName || 'Chưa phân công'}</td>
                  <td className="px-4 py-4 text-slate-700">{enr.roomName || 'Chưa xếp phòng'}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {enr.enrollmentDate ? new Date(enr.enrollmentDate).toLocaleDateString('vi-VN') : 'Chưa ghi nhận'}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {enr.statusName || 'Đang theo học'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => onDropCourse(enr.id, enr.subjectName)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Rút môn học"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
