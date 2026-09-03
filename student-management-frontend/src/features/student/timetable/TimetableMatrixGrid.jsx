// cSpell:disable
import React from 'react';
import { Clock, MapPin, User } from 'lucide-react';

export default function TimetableMatrixGrid({
  daysOfWeek = [],
  timeSlots = [],
  getEntriesForCell,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-slate-900 text-white text-xs font-bold uppercase">
              <th className="p-3.5 border-r border-slate-800 w-36 text-center">Ca / Khung Giờ</th>
              {daysOfWeek.map((day) => (
                <th key={day} className="p-3.5 border-r border-slate-800 last:border-r-0 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {timeSlots.map((slot, sIdx) => (
              <tr key={sIdx} className="hover:bg-slate-50/50">
                <td className="p-3 bg-slate-50 border-r border-slate-200 text-center space-y-0.5">
                  <div className="font-bold text-xs text-slate-800">{slot.label}</div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {slot.time}
                  </div>
                </td>

                {daysOfWeek.map((day, dIdx) => {
                  const entries = getEntriesForCell(day, slot);

                  return (
                    <td
                      key={dIdx}
                      className="p-2 border-r border-slate-200 last:border-r-0 align-top h-24 w-1/7 bg-slate-50/20"
                    >
                      {entries.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg shadow-xs space-y-1 hover:shadow-md transition-all"
                        >
                          <div className="font-black text-xs text-blue-900 line-clamp-1">
                            {item.subjectName}
                          </div>
                          <div className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{item.roomName || 'Chưa xếp phòng'}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{item.teacherName || 'Chưa phân công'}</span>
                          </div>
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
