// cSpell:disable
import React, { useState, useEffect } from 'react';
import { Calendar, Download, Printer } from 'lucide-react';
import { studentPortalApi, registrationPeriodApi } from '../../../api';
import Skeleton from '../../../components/common/Skeleton';
import TimetableMatrixGrid from './TimetableMatrixGrid';

export default function MatrixTimetableView({ onNotify }) {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [semesters, setSemesters] = useState([]);

  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const timeSlots = [
    { key: '1-3', label: 'Sáng (Tiết 1-3)', time: '07:00 - 09:25', shift: 'MORNING' },
    { key: '4-6', label: 'Sáng (Tiết 4-6)', time: '09:35 - 12:00', shift: 'MORNING' },
    { key: '7-9', label: 'Chiều (Tiết 7-9)', time: '13:00 - 15:25', shift: 'AFTERNOON' },
    { key: '10-12', label: 'Chiều (Tiết 10-12)', time: '15:35 - 18:00', shift: 'AFTERNOON' },
    { key: '13-15', label: 'Tối (Tiết 13-15)', time: '18:15 - 20:45', shift: 'EVENING' },
  ];

  useEffect(() => {
    async function loadTimetableSemesters() {
      try {
        const res = await registrationPeriodApi.getAll();
        const periods = res.data || [];
        const semesterList = [];
        const seenIds = new Set();
        periods.forEach((p) => {
          if (p.semesterId && !seenIds.has(p.semesterId)) {
            seenIds.add(p.semesterId);
            semesterList.push({
              id: p.semesterId,
              name: p.semesterName ? `${p.semesterName} (${p.academicYearName || ''})` : `Học kỳ ${p.semesterId}`,
              active: p.active,
            });
          }
        });
        if (semesterList.length > 0) {
          setSemesters(semesterList);
          const activeSem = semesterList.find((s) => s.active);
          if (activeSem) {
            setSelectedSemester(activeSem.id);
          }
        }
      } catch (err) {
        console.warn('Không thể tải danh sách học kỳ', err);
      }
    }
    loadTimetableSemesters();
  }, []);

  useEffect(() => {
    loadTimetable();
  }, [selectedSemester]);

  const loadTimetable = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentPortalApi.getMyTimetable(selectedSemester);
      setTimetable(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải thời khóa biểu', err);
      const msg = err.response?.data?.message || err.message || 'Không thể tải thời khóa biểu học tập';
      setError(msg);
      onNotify?.('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const getEntriesForCell = (day, slot) => {
    return timetable.filter((item) => {
      const studyTime = (item.studyTime || '').toLowerCase();
      const dayNorm = day.toLowerCase();
      const dayMatches = studyTime.includes(dayNorm) || 
        (dayNorm === 'thứ 2' && (studyTime.includes('thứ hai') || studyTime.includes('t2') || studyTime.includes('monday'))) ||
        (dayNorm === 'thứ 3' && (studyTime.includes('thứ ba') || studyTime.includes('t3') || studyTime.includes('tuesday'))) ||
        (dayNorm === 'thứ 4' && (studyTime.includes('thứ tư') || studyTime.includes('t4') || studyTime.includes('wednesday'))) ||
        (dayNorm === 'thứ 5' && (studyTime.includes('thứ năm') || studyTime.includes('t5') || studyTime.includes('thursday'))) ||
        (dayNorm === 'thứ 6' && (studyTime.includes('thứ sáu') || studyTime.includes('t6') || studyTime.includes('friday'))) ||
        (dayNorm === 'thứ 7' && (studyTime.includes('thứ bảy') || studyTime.includes('t7') || studyTime.includes('saturday'))) ||
        (dayNorm === 'chủ nhật' && (studyTime.includes('cn') || studyTime.includes('sunday')));

      if (!dayMatches) return false;

      if (slot.key && studyTime.includes(slot.key)) return true;
      if (slot.key === '1-3' && (studyTime.includes('tiết 1') || studyTime.includes('ca 1'))) return true;
      if (slot.key === '4-6' && (studyTime.includes('tiết 4') || studyTime.includes('ca 2'))) return true;
      if (slot.key === '7-9' && (studyTime.includes('tiết 7') || studyTime.includes('ca 3'))) return true;
      if (slot.key === '10-12' && (studyTime.includes('tiết 10') || studyTime.includes('ca 4'))) return true;
      if (slot.key === '13-15' && (studyTime.includes('tiết 13') || studyTime.includes('ca 5'))) return true;

      if (!studyTime.includes('tiết') && !studyTime.includes('-')) {
        return item.classShift === slot.shift && (slot.key === '1-3' || slot.key === '7-9' || slot.key === '13-15');
      }

      return false;
    });
  };

  const handleExportCSV = () => {
    if (!timetable || timetable.length === 0) {
      onNotify?.('warning', 'Chưa có lịch học trong học kỳ này để xuất file.');
      return;
    }

    const headers = [
      'STT',
      'Mã Lớp Học Phần',
      'Mã Môn Học',
      'Tên Môn Học',
      'Số Tín Chỉ',
      'Giảng Viên',
      'Phòng Học',
      'Thời Gian / Ca Học',
      'Ngày Bắt Đầu',
      'Ngày Kết Thúc'
    ];

    const rows = timetable.map((t, idx) => {
      const shift = t.shiftName || t.classShift || '';
      const timeStr = t.studyTime ? `${t.studyTime} (${shift})` : shift;
      const start = t.startDate ? new Date(t.startDate).toLocaleDateString('vi-VN') : '';
      const end = t.endDate ? new Date(t.endDate).toLocaleDateString('vi-VN') : '';

      return [
        idx + 1,
        `"${t.classCode || t.creditClassId || ''}"`,
        `"${t.subjectId || ''}"`,
        `"${(t.subjectName || '').replace(/"/g, '""')}"`,
        t.credits || 3,
        `"${(t.teacherName || '').replace(/"/g, '""')}"`,
        `"${t.roomName || ''}"`,
        `"${timeStr}"`,
        `"${start}"`,
        `"${end}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ThoiKhoaBieu_HK${selectedSemester}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify?.('success', 'Đã xuất thời khóa biểu học kỳ (CSV) thành công!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
            aria-label="Chọn học kỳ hiển thị thời khóa biểu"
          >
            {semesters && semesters.length > 0 ? (
              semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))
            ) : (
              <>
                <option value={1}>Học kỳ 1 (2026-2027)</option>
                <option value={2}>Học kỳ 2 (2026-2027)</option>
              </>
            )}
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Xuất TKB (CSV)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>In TKB</span>
          </button>
        </div>
      </div>

      {/* Timetable Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-center space-y-3 shadow-sm">
          <p className="text-base font-bold text-rose-700">{error}</p>
          <button
            onClick={loadTimetable}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
          >
            Thử Lại
          </button>
        </div>
      ) : timetable.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-3 shadow-sm">
          <Calendar className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
          <p className="text-base font-bold text-slate-700">Chưa có lịch học nào trong học kỳ này</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Thời khóa biểu các môn học sẽ tự động hiển thị sau khi bạn hoàn tất đăng ký học phần hoặc khi phòng Đào tạo phân bổ thời gian học.
          </p>
        </div>
      ) : (
        <TimetableMatrixGrid
          daysOfWeek={daysOfWeek}
          timeSlots={timeSlots}
          getEntriesForCell={getEntriesForCell}
        />
      )}
    </div>
  );
}
