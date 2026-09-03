// cSpell:disable
import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { msg } from '../../../lib/messages';
import Skeleton from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export default function AvailableClassesTable({
  loading = false,
  filteredClasses = [],
  cart = [],
  myEnrollments = [],
  onAddToCart,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5">Mã & Tên Học Phần</th>
              <th className="px-4 py-3.5">Số TC</th>
              <th className="px-4 py-3.5">Giảng Viên</th>
              <th className="px-4 py-3.5">Phòng / Lịch Học</th>
              <th className="px-4 py-3.5 text-center">Sĩ Số</th>
              <th className="px-4 py-3.5 text-right">Học Phí</th>
              <th className="px-5 py-3.5 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-16 mb-2 rounded" />
                    <Skeleton className="h-5 w-48 mb-1 rounded" />
                    <Skeleton className="h-3 w-32 rounded" />
                  </td>
                  <td className="px-4 py-4"><Skeleton className="h-5 w-8 rounded" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-4 w-28 rounded" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-4 w-24 rounded" /></td>
                  <td className="px-4 py-4 text-center"><Skeleton className="h-4 w-16 mx-auto rounded" /></td>
                  <td className="px-4 py-4 text-right"><Skeleton className="h-4 w-24 ml-auto rounded" /></td>
                  <td className="px-5 py-4 text-center"><Skeleton className="h-8 w-24 mx-auto rounded-xl" /></td>
                </tr>
              ))
            ) : filteredClasses.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12">
                  <EmptyState
                    icon={BookOpen}
                    title="Không tìm thấy lớp học phần nào"
                    description="Hiện tại không có lớp học phần nào mở đăng ký khớp với từ khóa tìm kiếm."
                  />
                </td>
              </tr>
            ) : (
              filteredClasses.map((item) => {
                const classId = item.creditClassId || item.id;
                const isSelected = cart.some(c => (c.creditClassId || c.id) === classId);
                const isAlreadyEnrolled = myEnrollments.some(e => e.creditClassId === classId);
                const isFull = (item.enrolledCount || 0) >= (item.maxStudents || 40);

                return (
                  <tr key={classId} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-xs rounded mb-1">
                        {item.subjectId}
                      </span>
                      <div className="font-bold text-slate-900">{item.subjectName}</div>
                      <div className="text-xs text-slate-400">{item.creditClassName}</div>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-800">
                      {item.credits || 3}
                    </td>
                    <td className="px-4 py-4 text-slate-700 font-medium">
                      {item.teacherName || 'Chưa phân công'}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800">{item.roomName || 'Chưa xếp phòng'}</div>
                      <div className="text-slate-400">{item.semester ? msg.enum.semester[item.semester] : 'Học kỳ 1'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs font-bold ${isFull ? 'text-rose-600' : 'text-slate-700'}`}>
                          {item.enrolledCount || 0} / {item.maxStudents || 40}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? 'bg-rose-500' : 'bg-blue-600'
                            }`}
                            style={{
                              width: `${Math.min(100, ((item.enrolledCount || 0) / (item.maxStudents || 40)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-slate-800">
                      {((item.credits || 3) * (item.tuitionPerCredit || item.pricePerCredit || 500000)).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-5 py-4 text-center">
                      {isAlreadyEnrolled ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5" /> Đã ĐK
                        </span>
                      ) : isFull ? (
                        <span className="inline-block text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">
                          Hết chỗ
                        </span>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item)}
                          className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 mx-auto ${
                            isSelected
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95'
                          }`}
                        >
                          {isSelected ? 'Bỏ chọn' : '+ Chọn lớp'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
