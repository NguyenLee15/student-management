// cSpell:disable
import React from 'react';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export default function StudentTodaySchedule({ todaySchedule = [], onNavigateTab }) {
  return (
    <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Lịch Học Hôm Nay</h3>
            <p className="text-[11px] text-slate-400">Các ca học phần diễn ra trong ngày</p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab?.('timetable')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline transition"
        >
          <span>Xem Thời khóa biểu tuần</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {(!todaySchedule || todaySchedule.length === 0) ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Calendar className="w-9 h-9 mx-auto text-slate-300 stroke-1" />
            <p className="text-xs font-medium text-slate-500">Hôm nay bạn không có ca học nào.</p>
            <p className="text-[11px] text-slate-400">Tận dụng thời gian để ôn tập hoặc chuẩn bị bài tập lớn.</p>
          </div>
        ) : (
          todaySchedule.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 hover:bg-blue-50/20 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold text-[11px] rounded">
                    {item.subjectId}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {item.credits} Tín chỉ
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{item.subjectName}</h4>
                <p className="text-xs text-slate-500">
                  Giảng viên: <strong className="text-slate-700 font-medium">{item.teacherName || 'Chưa phân công'}</strong>
                </p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-200/70 text-slate-800">
                  Phòng: {item.roomName || 'Chưa xếp'}
                </div>
                <div className="text-xs text-blue-700 font-semibold font-mono mt-0.5">
                  {item.studyTime || item.shiftName || 'Theo thông báo'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

