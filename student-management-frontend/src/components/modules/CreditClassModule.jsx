// cSpell:disable
import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { creditClassApi, subjectApi, studentApi, teacherApi, classroomApi, academicYearApi } from '../../api';
import ConfirmDialog from '../common/ConfirmDialog';
import CreditClassTable from './creditClass/CreditClassTable';
import CreditClassFormModal from './creditClass/CreditClassFormModal';
import CreditClassRosterModal from './creditClass/CreditClassRosterModal';

export default function CreditClassModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const [creditClasses, setCreditClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
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
      const [subRes, tRes, crRes, ayRes] = await Promise.allSettled([
        subjectApi.getAll({ page: 0, size: 100 }),
        teacherApi.getAll({ page: 0, size: 100 }),
        classroomApi.getAll({ page: 0, size: 100 }),
        academicYearApi.getAll({ unpaged: true }),
      ]);
      if (subRes.status === 'fulfilled') {
        const d = subRes.value.data || subRes.value;
        setSubjects(Array.isArray(d) ? d : d.content || []);
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
    setIsEdit(false);
    setFormData({
      creditClassName: '',
      subjectId: subjects[0]?.subjectId || '',
      teacherId: teachers[0]?.teacherId || '',
      classroomId: classrooms[0]?.roomId || classrooms[0]?.classroomId || '',
      academicYearId: academicYears[0]?.academicYearId || '',
      semester: 'SEMESTER_1',
      maxStudents: 60,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setIsEdit(true);
    setFormData({
      creditClassId: c.creditClassId || c.id,
      creditClassName: c.creditClassName || '',
      subjectId: c.subjectId || '',
      teacherId: c.teacherId || '',
      classroomId: c.classroomId || '',
      academicYearId: c.academicYearId || '',
      semester: c.semester || 'SEMESTER_1',
      maxStudents: c.maxStudents || 60,
    });
    setShowModal(true);
  };

  const handleSaveClass = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && formData.creditClassId) {
        await creditClassApi.update(formData.creditClassId, formData);
        onNotify('success', msg.success.updated('lớp tín chỉ', formData.creditClassId));
      } else {
        await creditClassApi.create(formData);
        onNotify('success', msg.success.created('lớp tín chỉ'));
      }
      setShowModal(false);
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.message || msg.error.save('lớp tín chỉ'));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await creditClassApi.delete(deleteTarget.creditClassId || deleteTarget.id);
      onNotify('success', msg.success.deleted('lớp tín chỉ'));
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.message || msg.error.delete('lớp tín chỉ'));
    }
  };

  const handleOpenStudents = async (c) => {
    setSelectedClass(c);
    setShowStudentsModal(true);
    try {
      const res = await creditClassApi.getStudents(c.creditClassId || c.id);
      const d = res.data || res;
      setEnrolledStudents(Array.isArray(d) ? d : d.content || []);
    } catch (err) {
      console.warn('Lỗi khi tải sinh viên lớp', err);
    }
  };

  const handleAddStudentToClass = async (e) => {
    e.preventDefault();
    if (!newStudentId.trim() || !selectedClass) return;
    try {
      await creditClassApi.addStudent(selectedClass.creditClassId || selectedClass.id, newStudentId.trim());
      onNotify('success', `Đã thêm sinh viên ${newStudentId} vào lớp thành công!`);
      setNewStudentId('');
      handleOpenStudents(selectedClass);
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.response?.data?.message || err?.message || 'Không thể thêm sinh viên vào lớp.');
    }
  };

  const handleRemoveStudentFromClass = async (stId) => {
    if (!selectedClass) return;
    try {
      await creditClassApi.removeStudent(selectedClass.creditClassId || selectedClass.id, stId);
      onNotify('success', `Đã xóa sinh viên ${stId} khỏi lớp.`);
      handleOpenStudents(selectedClass);
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.message || 'Không thể xóa sinh viên khỏi lớp.');
    }
  };

  const handleExportCSV = () => {
    if (!creditClasses || creditClasses.length === 0) {
      onNotify('error', 'Chưa có lớp tín chỉ để xuất file.');
      return;
    }

    const headers = [
      'STT', 'Mã Lớp Tín Chỉ', 'Mã Môn Học', 'Tên Môn Học', 'Số Tín Chỉ', 'Giảng Viên', 'Phòng Học', 'Học Kỳ', 'Năm Học', 'Đã ĐK / Tối Đa'
    ];

    const rows = creditClasses.map((c, idx) => [
      idx + 1,
      `"${c.creditClassId || c.id || ''}"`,
      `"${c.subjectId || ''}"`,
      `"${(c.subjectName || '').replace(/"/g, '""')}"`,
      c.credits || 3,
      `"${(c.teacherName || '').replace(/"/g, '""')}"`,
      `"${c.roomName || ''}"`,
      `"${msg.enum.semester[c.semester] || c.semester || ''}"`,
      `"${c.academicYearName || c.academicYearId || ''}"`,
      `"${c.enrolledCount || 0} / ${c.maxStudents || 60}"`
    ].join(','));

    const metaBlock = [
      `"TRƯỜNG ĐẠI HỌC CÔNG NGHỆ & ĐÀO TẠO"`,
      `"DANH SÁCH LỚP TÍN CHỈ (HỌC PHẦN ĐÀO TẠO)"`,
      `"Tổng số lớp tín chỉ: ${creditClasses.length}"`,
      `"Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}"`,
      ''
    ];

    const csvContent = '\uFEFF' + [...metaBlock, headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DanhSachLopTinChi_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify('success', 'Đã xuất danh sách lớp tín chỉ ra file CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Lớp Tín Chỉ (Học Phần)</h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý các lớp học phần được mở trong từng học kỳ và danh sách sinh viên đăng ký
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-800 transition shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Xuất CSV</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Mở Lớp Tín Chỉ</span>
            </button>
          )}
        </div>
      </div>

      {/* Credit Classes Table */}
      <CreditClassTable
        creditClasses={creditClasses}
        loading={loading}
        isAdmin={isAdmin}
        onOpenStudents={handleOpenStudents}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={(c) => setDeleteTarget(c)}
      />

      {/* Create / Edit Modal */}
      <CreditClassFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        subjects={subjects}
        teachers={teachers}
        classrooms={classrooms}
        academicYears={academicYears}
        onSubmit={handleSaveClass}
      />

      {/* Enrolled Students Roster Modal */}
      <CreditClassRosterModal
        isOpen={showStudentsModal}
        onClose={() => setShowStudentsModal(false)}
        selectedClass={selectedClass}
        enrolledStudents={enrolledStudents}
        newStudentId={newStudentId}
        setNewStudentId={setNewStudentId}
        onAddStudent={handleAddStudentToClass}
        onRemoveStudent={handleRemoveStudentFromClass}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Xác nhận hủy lớp tín chỉ"
        message={deleteTarget ? `Bạn có chắc chắn muốn hủy lớp tín chỉ '${deleteTarget.subjectName || deleteTarget.creditClassName}' (#${deleteTarget.creditClassId || deleteTarget.id}) không?` : ''}
        confirmText="Hủy lớp tín chỉ"
        cancelText="Không"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDestructive={true}
      />
    </div>
  );
}
