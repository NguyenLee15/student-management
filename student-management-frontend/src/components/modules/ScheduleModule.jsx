// cSpell:disable
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { scheduleApi, creditClassApi, teacherApi, classroomApi } from '../../api';
import { msg } from '../../lib/messages';
import ConfirmDialog from '../common/ConfirmDialog';
import ScheduleTable from './schedule/ScheduleTable';
import ScheduleFormModal from './schedule/ScheduleFormModal';

const SHIFT_CONFIGS = {
  'SHIFT_1': { classShift: 'MORNING', label: 'Ca 1 (Tiết 1-3: 07:00 - 09:15)', period: 'Tiết 1-3 (07:00 - 09:15)' },
  'SHIFT_2': { classShift: 'MORNING', label: 'Ca 2 (Tiết 4-6: 09:30 - 11:45)', period: 'Tiết 4-6 (09:30 - 11:45)' },
  'SHIFT_3': { classShift: 'AFTERNOON', label: 'Ca 3 (Tiết 7-9: 13:00 - 15:15)', period: 'Tiết 7-9 (13:00 - 15:15)' },
  'SHIFT_4': { classShift: 'AFTERNOON', label: 'Ca 4 (Tiết 10-12: 15:30 - 17:45)', period: 'Tiết 10-12 (15:30 - 17:45)' },
  'SHIFT_5': { classShift: 'EVENING', label: 'Ca 5 (Tiết 13-15: 18:00 - 20:15)', period: 'Tiết 13-15 (18:00 - 20:15)' },
};

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
    subjectId: '',
    teacherId: '',
    roomId: '',
    semester: 'SEMESTER_1',
    academicYear: '2026-2027',
    dayOfWeek: 2,
    classShift: 'SHIFT_1',
    studyTime: '',
    startDate: '2026-09-01',
    endDate: '2027-01-15',
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
      console.warn('Lỗi khi tải dữ liệu lịch học', e);
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
      console.warn('Lỗi khi tải lịch học', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    const firstCc = creditClasses[0];
    setFormData({
      ...initialForm,
      creditClassId: firstCc?.creditClassId || '',
      subjectId: firstCc?.subjectId || '',
      teacherId: firstCc?.teacherId || teachers[0]?.teacherId || '',
      roomId: firstCc?.classroomId || classrooms[0]?.roomId || '',
      semester: firstCc?.semester || 'SEMESTER_1',
      academicYear: firstCc?.academicYearId || firstCc?.academicYearName || '2026-2027',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setIsEdit(true);
    setFormData({
      scheduleId: s.scheduleId,
      creditClassId: s.creditClassId || '',
      subjectId: s.subjectId || '',
      teacherId: s.teacherId || '',
      roomId: s.roomId || '',
      semester: s.semester || 'SEMESTER_1',
      academicYear: s.academicYear || '2026-2027',
      dayOfWeek: s.dayOfWeek || 2,
      classShift: s.classShift?.startsWith('SHIFT_') ? s.classShift : 'SHIFT_1',
      studyTime: s.studyTime || '',
      startDate: s.startDate || '2026-09-01',
      endDate: s.endDate || '2027-01-15',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const selectedCc = creditClasses.find(c => String(c.creditClassId) === String(formData.creditClassId));
      const subjectId = selectedCc?.subjectId || formData.subjectId || '';
      if (!subjectId) {
        onNotify('error', 'Vui lòng chọn lớp tín chỉ hợp lệ có gắn môn học.');
        return;
      }
      const semester = formData.semester || selectedCc?.semester || 'SEMESTER_1';
      const academicYear = formData.academicYear || selectedCc?.academicYearId || selectedCc?.academicYearName || '';
      if (!academicYear) {
        onNotify('error', 'Vui lòng chọn hoặc điền thông tin niên khóa cho lịch học.');
        return;
      }
      const shiftCfg = SHIFT_CONFIGS[formData.classShift] || { classShift: 'MORNING', period: 'Tiết 1-3 (07:00 - 09:15)' };
      const weekdayStr = Number(formData.dayOfWeek) === 8 ? 'Chủ Nhật' : `Thứ ${formData.dayOfWeek}`;
      const studyTime = `${weekdayStr}, ${shiftCfg.period}`;

      const payload = {
        ...formData,
        creditClassId: Number(formData.creditClassId),
        subjectId,
        semester,
        academicYear,
        studyTime,
        classShift: shiftCfg.classShift,
      };

      if (isEdit) {
        await scheduleApi.update(formData.scheduleId, payload);
        onNotify('success', msg.success.updated('lịch học', '#' + formData.scheduleId));
      } else {
        await scheduleApi.create(payload);
        onNotify('success', msg.success.created('lịch học', ''));
      }
      setShowModal(false);
      loadSchedules();
    } catch (err) {
      onNotify('error', err?.message || msg.error.save('lịch học'));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await scheduleApi.delete(deleteTarget.scheduleId);
      onNotify('success', msg.success.deleted('lịch học', '#' + deleteTarget.scheduleId));
      loadSchedules();
    } catch (err) {
      onNotify('error', err?.message || msg.error.delete('lịch học'));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
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
            <span>Thêm Lịch Học Mới</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="panel-card p-4 flex flex-wrap items-center gap-3">
        <select
          value={selectedSemester}
          onChange={(e) => { setSelectedSemester(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-teal-500 transition"
        >
          <option value="">Tất Cả Các Học Kỳ (Tất cả học kỳ)</option>
          <option value="SEMESTER_1">Học kỳ 1</option>
          <option value="SEMESTER_2">Học kỳ 2</option>
          <option value="SEMESTER_SUMMER">Học kỳ phụ</option>
        </select>

        <select
          value={selectedShift}
          onChange={(e) => { setSelectedShift(e.target.value); setPage(0); }}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-teal-500 transition"
        >
          <option value="">Tất cả ca học</option>
          <option value="MORNING">Ca Sáng (07:00 - 11:45)</option>
          <option value="AFTERNOON">Ca Chiều (13:00 - 17:45)</option>
          <option value="EVENING">Ca Tối (18:00 - 20:15)</option>
        </select>

        <button
          onClick={loadSchedules}
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition ml-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
        </button>
      </div>

      {/* Schedule Table Component */}
      <ScheduleTable
        schedules={schedules}
        isAdmin={isAdmin}
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
        onEdit={handleOpenEdit}
        onDelete={(s) => setDeleteTarget(s)}
      />

      {/* Schedule Form Modal */}
      <ScheduleFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        creditClasses={creditClasses}
        teachers={teachers}
        classrooms={classrooms}
        onSubmit={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Lịch Học"
        message={msg.confirm.delete('lịch học', '', '#' + deleteTarget?.scheduleId)}
      />
    </div>
  );
}
