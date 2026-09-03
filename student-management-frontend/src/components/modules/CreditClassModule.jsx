import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Layers, Users, BookOpen, UserPlus, X, RefreshCw, Download } from 'lucide-react';
import { creditClassApi, subjectApi, studentClassApi, studentApi, teacherApi, classroomApi, academicYearApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';

export default function CreditClassModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [creditClasses, setCreditClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [newStudentId, setNewStudentId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    creditClassName: '',
    subjectId: '',
    teacherId: '',
    classroomId: '',
    academicYearId: '',
    semester: 'SEMESTER_1',
    maxStudents: 60,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadDependencies();
    loadCreditClasses();
  }, []);

  const loadDependencies = async () => {
    try {
      const [subRes, clsRes, tRes, crRes, ayRes] = await Promise.allSettled([
        subjectApi.getAll({ page: 0, size: 100 }),
        studentClassApi.getAll({ page: 0, size: 50 }),
        teacherApi.getAll({ page: 0, size: 100 }),
        classroomApi.getAll({ page: 0, size: 100 }),
        academicYearApi.getAll({ unpaged: true }),
      ]);
      if (subRes.status === 'fulfilled') {
        const d = subRes.value.data || subRes.value;
        setSubjects(Array.isArray(d) ? d : d.content || []);
      }
      if (clsRes.status === 'fulfilled') {
        const d = clsRes.value.data || clsRes.value;
        setClasses(Array.isArray(d) ? d : d.content || []);
      }
      if (tRes.status === 'fulfilled') {
        const d = tRes.value.data || tRes.value;
        setTeachers(Array.isArray(d) ? d : d.content || []);
      }
      if (crRes.status === 'fulfilled') {
        const d = crRes.value.data || crRes.value;
        setClassrooms(Array.isArray(d) ? d : d.content || []);
      }
      if (ayRes.status === 'fulfilled') {
        const d = ayRes.value.data || ayRes.value;
        setAcademicYears(Array.isArray(d) ? d : d.content || []);
      }
    } catch (e) {
      console.warn('Lỗi khi tải danh mục phụ thuộc', e);
    }
  };

  const loadCreditClasses = async () => {
    setLoading(true);
    try {
      const res = await creditClassApi.getAll();
      const d = res.data || res;
      setCreditClasses(Array.isArray(d) ? d : d.content || []);
    } catch (err) {
      console.warn('Lỗi khi tải lớp tín chỉ', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      creditClassName: '',
      subjectId: subjects[0]?.subjectId || '',
      teacherId: teachers[0]?.teacherId || '',
      classroomId: classrooms[0]?.classroomId || '',
      academicYearId: academicYears[0]?.academicYearId || '',
      semester: 'SEMESTER_1',
      maxStudents: 60,
    });
    setShowModal(true);
  };

  const handleExportCSV = () => {
    if (!creditClasses || creditClasses.length === 0) {
      onNotify('error', 'Chưa có lớp tín chỉ để xuất file.');
      return;
    }

    const headers = [
      'STT',
      'Mã Lớp Tín Chỉ',
      'Mã Môn Học',
      'Tên Môn Học',
      'Số Tín Chỉ',
      'Giảng Viên',
      'Phòng Học',
      'Học Kỳ',
      'Năm Học',
      'Đã ĐK / Tối Đa'
    ];

    const rows = creditClasses.map((c, idx) => {
      const sem = c.semester ? (msg.enum.semester[c.semester] || c.semester) : '';
      return [
        idx + 1,
        `"${c.creditClassId || c.id || ''}"`,
        `"${c.subjectId || ''}"`,
        `"${(c.subjectName || '').replace(/"/g, '""')}"`,
        c.credits || 3,
        `"${(c.teacherName || '').replace(/"/g, '""')}"`,
        `"${c.roomName || ''}"`,
        `"${sem}"`,
        `"${c.academicYearName || c.academicYearId || ''}"`,
        `"${c.enrolledCount || 0} / ${c.maxStudents || 60}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DanhSach_LopTinChi_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.subjectId || !formData.teacherId || !formData.classroomId || !formData.academicYearId) {
      onNotify('error', 'Vui lòng chọn đầy đủ môn học, giảng viên, phòng học và năm học.');
      return;
    }
    try {
      await creditClassApi.create(formData);
      onNotify('success', 'Mở lớp tín chỉ mới thành công!');
      setShowModal(false);
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.response?.data?.message || err?.message || 'Lỗi khi mở lớp tín chỉ');
    }
  };

  const handleViewStudents = async (cc) => {
    setSelectedClass(cc);
    setShowStudentsModal(true);
    try {
      const res = await creditClassApi.getStudents(cc.creditClassId);
      const data = res.data || res;
      setEnrolledStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      setEnrolledStudents([]);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentId || !selectedClass) return;
    try {
      await creditClassApi.addStudent(selectedClass.creditClassId, newStudentId.trim());
      onNotify('success', `Sinh Viên ${newStudentId} đã được thêm vào lớp tín chỉ!`);
      setNewStudentId('');
      handleViewStudents(selectedClass);
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi thêm sinh viên');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!selectedClass) return;
    try {
      await creditClassApi.removeStudent(selectedClass.creditClassId, studentId);
      onNotify('success', `Sinh Viên ${studentId} đã được xóa khỏi lớp tín chỉ!`);
      handleViewStudents(selectedClass);
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa sinh viên');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await creditClassApi.delete(deleteTarget.creditClassId);
      onNotify('success', msg.success.deleted('lớp tín chỉ', deleteTarget.creditClassId));
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi hủy lớp tín chỉ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Lớp tín chỉ & Đăng ký</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý mở lớp học phần, phân công giảng viên và danh sách sinh viên đăng ký</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition active:scale-95"
          >
            <Download className="h-4 w-4 text-slate-400" />
            <span>Xuất Danh Sách (CSV)</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Lớp tín chỉ mới</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {creditClasses.map((cc) => (
          <div
            key={cc.creditClassId}
            className="panel-card p-6 space-y-4 hover:border-blue-500/40 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-105 transition">
                <Layers className="h-6 w-6" />
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-blue-300 rounded-lg">
                Mã: {cc.creditClassId}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{cc.subjectName || cc.subjectId}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Giảng viên: <span className="text-slate-200 font-semibold">{cc.teacherName || 'Chưa phân công'}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Phòng: <span className="text-blue-300 font-semibold">{cc.roomName || cc.classroomId || 'Chưa xếp'}</span> • Học kỳ: <span className="text-slate-200">{msg.enum.semester[cc.semester] || cc.semester || 'Học kỳ 1'}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500">Đã Đăng Ký</span>
                <p className="text-lg font-bold text-emerald-400">{cc.enrolledStudentsCount || cc.enrolledCount || cc.students?.length || 0} SV</p>
              </div>
              <div>
                <span className="text-slate-500">Sĩ Số Tối Đa</span>
                <p className="text-lg font-bold text-slate-300">{cc.maxStudents || 60} SV</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              {isAdmin && (
                <>
                  <button
                    onClick={() => handleViewStudents(cc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/20 transition"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Quản Lý Sĩ Số</span>
                  </button>

                  <button
                    onClick={() => setDeleteTarget(cc)}
                    className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Credit Class */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Mở lớp tín chỉ mới"
        subtitle="Gắn môn học với giảng viên, phòng học và thời gian tổ chức"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Môn Học (Học Phần) *</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {subjects.map((s) => (
                  <option key={s.subjectId} value={s.subjectId}>{s.subjectName} ({s.subjectId})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Giảng Viên Phụ Trách *</label>
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {teachers.map((t) => (
                  <option key={t.teacherId} value={t.teacherId}>{t.fullName} ({t.teacherId})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phòng Học / Giảng Đường *</label>
              <select
                value={formData.classroomId}
                onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {classrooms.map((cr) => (
                  <option key={cr.classroomId} value={cr.classroomId}>{cr.roomName || cr.classroomId}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Niên Khóa / Năm Học *</label>
              <select
                value={formData.academicYearId}
                onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {academicYears.map((ay) => (
                  <option key={ay.academicYearId} value={ay.academicYearId}>{ay.academicYearName || ay.academicYearId}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Học Kỳ Bắt Buộc *</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="SEMESTER_1">Học kỳ 1</option>
                <option value="SEMESTER_2">Học kỳ 2</option>
                <option value="SUMMER">Học kỳ hè</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sĩ Số Tối Đa Cho Phép *</label>
              <input
                type="number"
                min="10"
                max="300"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 60 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              />
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition"
            >
              Mở lớp mới
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Quản Lý Sĩ Số */}
      <Modal
        isOpen={showStudentsModal}
        onClose={() => setShowStudentsModal(false)}
        title={`Danh Sách Sinh Viên: ${selectedClass?.subjectName || selectedClass?.subjectId}`}
        subtitle={`Mã LTC: ${selectedClass?.creditClassId} | Tổng: ${enrolledStudents.length} sinh viên đã đăng ký`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-xs">
          <form onSubmit={handleAddStudent} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Nhập mã SV để thêm vào lớp (VD: SV001)..."
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              <span>Ghi Danh</span>
            </button>
          </form>

          <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-800 rounded-xl p-2 bg-slate-950/50">
            {enrolledStudents.length === 0 ? (
              <p className="text-center py-6 text-slate-500">Chưa có sinh viên nào đăng ký lớp tín chỉ này.</p>
            ) : (
              enrolledStudents.map((st) => (
                <div key={st.studentId} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                      {st.fullName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{st.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{st.studentId}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveStudent(st.studentId)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Hủy Lớp Tín Chỉ"
        message={msg.confirm.delete('lớp tín chỉ', '', deleteTarget?.creditClassId)}
      />
    </div>
  );
}
