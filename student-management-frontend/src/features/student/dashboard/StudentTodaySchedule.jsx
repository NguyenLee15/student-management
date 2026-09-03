// cSpell:disable
import React from 'react';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export default function StudentTodaySchedule({ todaySchedule = [], onNavigateTab }) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800">Lịch Học Hôm Nay</h3>
        </div>
        <button
          onClick={() => onNavigateTab?.('timetable')}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Xem ma trận TKB <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {(!todaySchedule || todaySchedule.length === 0) ? (
          <div className="py-10 text-center text-slate-400 space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="text-sm">Hôm nay không có lịch học.</p>
          </div>
        ) : (
          todaySchedule.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4 hover:border-blue-300 transition-colors"
            >
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-xs rounded">
                  {item.subjectId}
                </span>
                <h4 className="font-bold text-slate-800 text-sm">{item.subjectName}</h4>
                <p className="text-xs text-slate-500">
                  GV: {item.teacherName || 'Chưa phân công'} • {item.credits} Tín chỉ
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800 text-xs">{item.roomName || 'Chưa xếp phòng'}</div>
                <div className="text-xs text-slate-400">{item.studyTime || item.shiftName}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
