// cSpell:disable
import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, Download, RefreshCw, Search } from 'lucide-react';
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

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');

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
  }, []);

  useEffect(() => {
    loadCreditClasses();
  }, [page, size]);

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
      const res = await creditClassApi.getAll({ page, size });
      const d = res.data || res;
      if (d && d.content) {
        setCreditClasses(d.content);
        setTotalPages(d.totalPages || 1);
        setTotalElements(d.totalElements || d.content.length);
      } else if (Array.isArray(d)) {
        setCreditClasses(d);
        setTotalPages(1);
        setTotalElements(d.length);
      }
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
    setSelectedClass(c);
    setFormData({
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
      if (isEdit) {
        await creditClassApi.update(selectedClass.creditClassId || selectedClass.id, formData);
        onNotify('success', msg.success.updated('lớp tín chỉ', selectedClass.creditClassId || selectedClass.id));
      } else {
        await creditClassApi.create(formData);
        onNotify('success', msg.success.created('lớp tín chỉ', 'mới'));
      }
      setShowModal(false);
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi lưu lớp tín chỉ');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await creditClassApi.delete(deleteTarget.creditClassId || deleteTarget.id);
      onNotify('success', msg.success.deleted('lớp tín chỉ', deleteTarget.creditClassId || deleteTarget.id));
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa lớp tín chỉ');
    }
  };

  const handleOpenStudents = async (c) => {
    setSelectedClass(c);
    setNewStudentId('');
    setShowStudentsModal(true);
    try {
      const res = await creditClassApi.getStudents(c.creditClassId || c.id);
      const d = res.data || res;
      setEnrolledStudents(Array.isArray(d) ? d : []);
    } catch (err) {
      onNotify('error', 'Lỗi khi tải danh sách sinh viên');
    }
  };

  const handleAddStudentToClass = async (e) => {
    e.preventDefault();
    if (!newStudentId.trim()) return;
    try {
      await creditClassApi.addStudent(selectedClass.creditClassId || selectedClass.id, newStudentId.trim());
      onNotify('success', `Đã thêm sinh viên ${newStudentId} vào lớp`);
      setNewStudentId('');
      handleOpenStudents(selectedClass);
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi thêm sinh viên vào lớp');
    }
  };

  const handleRemoveStudentFromClass = async (studentId) => {
    try {
      await creditClassApi.removeStudent(selectedClass.creditClassId || selectedClass.id, studentId);
      onNotify('success', `Đã xóa sinh viên ${studentId} khỏi lớp`);
      handleOpenStudents(selectedClass);
      loadCreditClasses();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa sinh viên khỏi lớp');
    }
  };

  const filteredClasses = keyword.trim() === ''
    ? creditClasses
    : creditClasses.filter(c => 
        (c.subjectName || '').toLowerCase().includes(keyword.toLowerCase()) ||
        (c.subjectId || '').toLowerCase().includes(keyword.toLowerCase()) ||
        (c.teacherName || '').toLowerCase().includes(keyword.toLowerCase())
      );

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Lớp Tín Chỉ (Học Phần)</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý các lớp môn học, sĩ số và giảng viên phụ trách theo từng học kỳ</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo môn học, giảng viên..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={loadCreditClasses}
            title="Tải lại danh sách"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Mở Lớp Tín Chỉ</span>
            </button>
          )}
        </div>
      </div>

      {/* Credit Classes Table with Server Pagination */}
      <CreditClassTable
        creditClasses={filteredClasses}
        loading={loading}
        isAdmin={isAdmin}
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
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
        onClose={() => setDeleteTarget(null)}
        isDanger={true}
      />
    </div>
  );
}
