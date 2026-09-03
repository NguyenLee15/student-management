// cSpell:disable
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, BookOpen, Layers } from 'lucide-react';
import { msg } from '../../lib/messages';
import { WEEKDAYS } from '../../utils/gradeCalculations';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

export default function TeacherScheduleTab({ schedules = [], classes = [], loading = false }) {
  const [selectedDay, setSelectedDay] = useState('ALL');

  const filteredSchedules = schedules.filter((s) => {
    if (selectedDay === 'ALL') return true;
    return s.dayOfWeek === selectedDay;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Thời Khóa Biểu Giảng Dạy</h2>
          <p className="text-xs text-slate-400 mt-0.5">Lịch trình các ca dạy trong tuần theo kế hoạch đào tạo</p>
        </div>

        {/* Day Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedDay('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedDay === 'ALL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Cả tuần
          </button>
          {WEEKDAYS.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedDay === d.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : filteredSchedules.length === 0 ? (
        <EmptyState
          title="Không có lịch dạy"
          description={
            selectedDay === 'ALL'
              ? 'Hiện Thầy/Cô chưa có ca dạy nào được phân công trong tuần này.'
              : `Thầy/Cô không có ca dạy nào vào ${WEEKDAYS.find((d) => d.key === selectedDay)?.label || selectedDay}.`
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.map((s, idx) => {
            const classMatch = classes.find((c) => c.creditClassId === s.creditClassId);
            const weekday = WEEKDAYS.find((w) => w.key === s.dayOfWeek);

            return (
              <div
                key={s.scheduleId || s.id || idx}
                className="panel-card p-5 border-l-4 border-l-emerald-500 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {weekday ? weekday.label : s.dayOfWeek || 'Lịch dạy'}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {msg.enum.shift[s.classShift] || s.classShift || 'Ca học'}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {s.subjectName || classMatch?.subjectName || `Học phần #${s.creditClassId}`}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Layers className="h-3.5 w-3.5 text-slate-500" />
                    <span>Lớp tín chỉ #{s.creditClassId}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>
                      {s.studyTime ||
                        (s.startDate && s.endDate
                          ? `${s.startDate} - ${s.endDate}`
                          : 'Thời gian thông báo sau')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    <span>{s.roomName || (s.roomId ? `Phòng ${s.roomId}` : 'Chưa xếp phòng')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
