import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, CalendarDays, Clock, MapPin, User, BookOpen, RefreshCw } from 'lucide-react';
import { scheduleApi, creditClassApi, teacherApi, classroomApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';

export default function ScheduleModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [schedules, setSchedules] = useState([]);
  const [creditClasses, setCreditClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    scheduleId: null,
    creditClassId: '',
    teacherId: '',
    roomId: '',
    semester: 'SEMESTER_1',
    academicYear: '2025-2026',
    dayOfWeek: 2, // Monday
    classShift: 'SHIFT_1', // Morning 07:00 - 09:15
    startDate: '2025-09-01',
    endDate: '2025-12-30',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadDependencies();
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [page, size, selectedSemester, selectedShift]);

  const loadDependencies = async () => {
    try {
      const [ccRes, tRes, crRes] = await Promise.allSettled([
        creditClassApi.getAll(),
        teacherApi.getAll({ page: 0, size: 100 }),
        classroomApi.getAll({ page: 0, size: 100 }),
      ]);
      if (ccRes.status === 'fulfilled') {
        const d = ccRes.value.data || ccRes.value;
        setCreditClasses(Array.isArray(d) ? d : d.content || []);
      }
      if (tRes.status === 'fulfilled') {
        const d = tRes.value.data || tRes.value;
        setTeachers(Array.isArray(d) ? d : d.content || []);
      }
      if (crRes.status === 'fulfilled') {
        const d = crRes.value.data || crRes.value;
        setClassrooms(Array.isArray(d) ? d : d.content || []);
      }
    } catch (e) {
      console.warn('Err load schedule dependencies', e);
    }
  };

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const res = await scheduleApi.getAll({
        page,
        size,
        semester: selectedSemester || undefined,
        classShift: selectedShift || undefined,
      });
      const d = res.data || res;
      if (d && d.content) {
        setSchedules(d.content);
        setTotalPages(d.totalPages || 1);
        setTotalElements(d.totalElements || d.content.length);
      } else if (Array.isArray(d)) {
        setSchedules(d);
        setTotalPages(1);
        setTotalElements(d.length);
      }
    } catch (err) {
      console.warn('Err load schedules', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData({
      ...initialForm,
      creditClassId: creditClasses[0]?.creditClassId || '',
      teacherId: teachers[0]?.teacherId || '',
      roomId: classrooms[0]?.roomId || '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setIsEdit(true);
    setFormData({
      scheduleId: s.scheduleId,
      creditClassId: s.creditClassId || '',
      teacherId: s.teacherId || '',
      roomId: s.roomId || '',
      semester: s.semester || 'SEMESTER_1',
      academicYear: s.academicYear || '2025-2026',
      dayOfWeek: s.dayOfWeek || 2,
      classShift: s.classShift || 'SHIFT_1',
      startDate: s.startDate || '2025-09-01',
      endDate: s.endDate || '2025-12-30',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await scheduleApi.update(formData.scheduleId, formData);
        onNotify('success', `Schedule slot updated successfully!`);
      } else {
        await scheduleApi.create(formData);
        onNotify('success', `Schedule slot created successfully!`);
      }
      setShowModal(false);
      loadSchedules();
    } catch (err) {
      onNotify('error', err?.message || 'Error saving timetable slot');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await scheduleApi.delete(deleteTarget.scheduleId);
      onNotify('success', `Schedule slot deleted successfully!`);
      loadSchedules();
    } catch (err) {
      onNotify('error', err?.message || 'Error deleting timetable slot');
    }
  };

  const dayOfWeekNames = {
    2: 'Thứ 2 (Mon)',
    3: 'Thứ 3 (Tue)',
    4: 'Thứ 4 (Wed)',
    5: 'Thứ 5 (Thu)',
    6: 'Thứ 6 (Fri)',
    7: 'Thứ 7 (Sat)',
    8: 'Chủ Nhật (Sun)',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Thời Khóa Biểu & Lịch Học</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý phân bổ ca học, thứ trong tuần, giảng viên phụ trách và phòng học</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-teal-600/30 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm Lịch Học Mới Slot</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
        <select
          value={selectedSemester}
          onChange={(e) => { setSelectedSemester(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-teal-500 transition"
        >
          <option value="">Tất Cả Các Học Kỳ (Tất cả học kỳ)</option>
          <option value="SEMESTER_1">Học kỳ 1 (Fall Semester)</option>
          <option value="SEMESTER_2">Học kỳ 2 (Spring Semester)</option>
          <option value="SEMESTER_SUMMER">Học kỳ Phụ (Summer)</option>
        </select>

        <select
          value={selectedShift}
          onChange={(e) => { setSelectedShift(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-teal-500 transition"
        >
          <option value="">All Class Shifts (Tất cả ca học)</option>
          <option value="SHIFT_1">Ca 1: 07:00 - 09:15 (Sáng)</option>
          <option value="SHIFT_2">Ca 2: 09:30 - 11:45 (Sáng)</option>
          <option value="SHIFT_3">Ca 3: 13:00 - 15:15 (Chiều)</option>
          <option value="SHIFT_4">Ca 4: 15:30 - 17:45 (Chiều)</option>
          <option value="SHIFT_5">Ca 5: 18:00 - 20:15 (Tối)</option>
        </select>

        <button
          onClick={loadSchedules}
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition ml-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
        </button>
      </div>

      {/* Schedule Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Thứ Trong Tuần & Ca Học</th>
                <th className="px-5 py-3.5">Course / Học Phần</th>
                <th className="px-5 py-3.5">Giảng Viên Phụ Trách</th>
                <th className="px-5 py-3.5">Phòng Học / Giảng Đường</th>
                <th className="px-5 py-3.5">Học kỳ</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {schedules.map((s) => (
                <tr key={s.scheduleId} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5 font-bold text-teal-400">
                    <div>
                      <div>{dayOfWeekNames[s.dayOfWeek] || `Day ${s.dayOfWeek}`}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal mt-0.5">{s.classShift || 'SHIFT_1'}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white">{s.subjectName || `Credit Class #${s.creditClassId}`}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Class ID: {s.creditClassId}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{s.teacherName || s.teacherId || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-300 font-mono font-semibold">
                      {s.roomName || s.roomId || 'Hall A101'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {s.semester} ({s.academicYear || '2025-2026'})
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          size={size}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? `Edit Schedule Slot #${formData.scheduleId}` : 'Schedule Class Slot'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Lớp Tín Chỉ*</label>
              <select
                value={formData.creditClassId}
                onChange={(e) => setFormData({ ...formData, creditClassId: parseInt(e.target.value) || e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
              >
                {creditClasses.map((cc) => (
                  <option key={cc.creditClassId} value={cc.creditClassId}>
                    {cc.subjectName || cc.subjectId} (Section #{cc.creditClassId})
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
              <label className="block text-slate-300 font-semibold mb-1">Weekday (Thứ)*</label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) || 2 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value={2}>Thứ 2 (Monday)</option>
                <option value={3}>Thứ 3 (Tuesday)</option>
                <option value={4}>Thứ 4 (Wednesday)</option>
                <option value={5}>Thứ 5 (Thursday)</option>
                <option value={6}>Thứ 6 (Friday)</option>
                <option value={7}>Thứ 7 (Saturday)</option>
                <option value={8}>Chủ Nhật (Sunday)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Class Shift (Ca Học)*</label>
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
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >Hủy</button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg shadow-teal-600/30 transition"
            >
              {isEdit ? 'Lưu thay đổi' : 'Schedule Class'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Lịch Học"
        message={`Are you sure you want to remove timetable slot #${deleteTarget?.scheduleId}?`}
      />
    </div>
  );
}
