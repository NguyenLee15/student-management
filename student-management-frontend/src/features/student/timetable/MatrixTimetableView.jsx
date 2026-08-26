import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Download, Printer, RefreshCw } from 'lucide-react';
import { studentPortalApi } from '../../../api';

export default function MatrixTimetableView() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(1);

  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const timeSlots = [
    { label: 'Sáng (Tiết 1-3)', time: '07:00 - 09:25', shift: 'MORNING' },
    { label: 'Sáng (Tiết 4-6)', time: '09:35 - 12:00', shift: 'MORNING' },
    { label: 'Chiều (Tiết 7-9)', time: '13:00 - 15:25', shift: 'AFTERNOON' },
    { label: 'Chiều (Tiết 10-12)', time: '15:35 - 18:00', shift: 'AFTERNOON' },
    { label: 'Tối (Tiết 13-15)', time: '18:15 - 20:45', shift: 'EVENING' },
  ];

  useEffect(() => {
    loadTimetable();
  }, [selectedSemester]);

  const loadTimetable = async () => {
    setLoading(true);
    try {
      const res = await studentPortalApi.getMyTimetable(selectedSemester);
      setTimetable(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load timetable', err);
    } finally {
      setLoading(false);
    }
  };

  const getEntriesForCell = (day, slot) => {
    return timetable.filter((item) => {
      const studyTime = item.studyTime || '';
      const matchesDay = studyTime.toLowerCase().includes(day.toLowerCase());
      const matchesShift = item.classShift === slot.shift;
      return matchesDay || (matchesShift && studyTime.includes(day));
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-blue-600" />
            Thời Khóa Biểu Tuần Học
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ma trận lịch học trực quan theo ngày trong tuần và ca học
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value={1}>Học kỳ 1 (2026-2027)</option>
            <option value={2}>Học kỳ 2 (2026-2027)</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>In TKB</span>
          </button>
        </div>
      </div>

      {/* Timetable Matrix Grid */}
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
                              <span className="truncate">{item.roomName || 'Phòng TBA'}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{item.teacherName || 'GV'}</span>
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
    </div>
  );
}
