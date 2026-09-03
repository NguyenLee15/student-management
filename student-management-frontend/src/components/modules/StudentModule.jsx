// cSpell:disable
import { msg } from '../../lib/messages';
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Upload, Download } from 'lucide-react';
import { studentApi, facultyApi, studentClassApi, academicYearApi } from '../../api';
import ConfirmDialog from '../common/ConfirmDialog';
import TranscriptModal from './TranscriptModal';
import StudentFilterBar from './student/StudentFilterBar';
import StudentTable from './student/StudentTable';
import StudentFormModal from './student/StudentFormModal';
import StudentImportModal from './student/StudentImportModal';
import BatchClassModal from './student/BatchClassModal';
import { useStudentImport } from './student/useStudentImport';

export default function StudentModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';
  const isTeacher = currentUser?.role === 'ROLE_TEACHER' || currentUser?.role === 'TEACHER';
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters & Sorting
  const [keyword, setKeyword] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortField, setSortField] = useState('studentId');
  const [sortOrder, setSortOrder] = useState('asc');

  // Metadata
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showBatchClassModal, setShowBatchClassModal] = useState(false);
  const [batchClassId, setBatchClassId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [transcriptStudent, setTranscriptStudent] = useState(null);

  const initialForm = {
    studentId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: 'MALE',
    dateOfBirth: '',
    address: '',
    classId: '',
    facultyId: '',
    academicYearId: '',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadMetadata();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [page, size, selectedFaculty, selectedClass, selectedYear]);

  const loadMetadata = async () => {
    try {
      const [facRes, clsRes, yrRes] = await Promise.allSettled([
        facultyApi.getAll({ unpaged: true }),
        studentClassApi.getAll({ page: 0, size: 50 }),
        academicYearApi.getAll({ unpaged: true }),
      ]);

      if (facRes.status === 'fulfilled') {
        const d = facRes.value.data || facRes.value;
        setFaculties(Array.isArray(d) ? d : d.content || []);
      }
      if (clsRes.status === 'fulfilled') {
        const d = clsRes.value.data || clsRes.value;
        setClasses(Array.isArray(d) ? d : d.content || []);
      }
      if (yrRes.status === 'fulfilled') {
        const d = yrRes.value.data || yrRes.value;
        setAcademicYears(Array.isArray(d) ? d : d.content || []);
      }
    } catch (e) {
      console.error('Lỗi khi tải danh mục', e);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await studentApi.getAll({
        page,
        size,
        keyword: keyword || undefined,
        facultyId: selectedFaculty || undefined,
        classId: selectedClass || undefined,
        academicYearId: selectedYear || undefined,
      });

      const pageData = res.data || res;
      if (pageData && pageData.content) {
        setStudents(pageData.content);
        setTotalPages(pageData.totalPages || 1);
        setTotalElements(pageData.totalElements || pageData.content.length);
      } else if (Array.isArray(pageData)) {
        setStudents(pageData);
        setTotalPages(1);
        setTotalElements(pageData.length);
      }
    } catch (err) {
      console.warn('Lỗi khi tải danh sách sinh viên', err);
    } finally {
      setLoading(false);
    }
  };

  const {
    showImportModal,
    setShowImportModal,
    importing,
    importProgress,
    handleFileUpload,
  } = useStudentImport({ onNotify, onRefresh: loadStudents });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === students.length && students.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(students.map((s) => s.studentId)));
    }
  };

  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedFaculty('');
    setSelectedClass('');
    setSelectedYear('');
    setSelectedStatus('');
    setPage(0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadStudents();
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData({
      ...initialForm,
      facultyId: faculties[0]?.facultyId || '',
      classId: classes[0]?.classId || '',
      academicYearId: academicYears[0]?.academicYearId || '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (student) => {
    setIsEdit(true);
    setFormData({
      studentId: student.studentId,
      fullName: student.fullName,
      email: student.email || '',
      phoneNumber: student.phoneNumber || '',
      gender: student.gender || 'MALE',
      dateOfBirth: student.dateOfBirth || '',
      address: student.address || '',
      classId: student.classId || student.studentClassId || '',
      facultyId: student.facultyId || '',
      academicYearId: student.academicYearId || '',
    });
    setShowModal(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!formData.studentId?.trim()) {
      onNotify('error', 'Mã sinh viên không được để trống.');
      return;
    }
    if (!formData.fullName?.trim() || formData.fullName.trim().length < 2) {
      onNotify('error', 'Họ và tên sinh viên phải có ít nhất 2 ký tự.');
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      onNotify('error', 'Địa chỉ email không đúng định dạng.');
      return;
    }
    if (formData.phoneNumber && !/^[0-9]{9,11}$/.test(formData.phoneNumber.trim())) {
      onNotify('error', 'Số điện thoại phải từ 9 đến 11 chữ số.');
      return;
    }
    try {
      if (isEdit) {
        await studentApi.update(formData.studentId, formData);
        onNotify('success', msg.success.updated('sinh viên', formData.studentId));
      } else {
        await studentApi.create(formData);
        onNotify('success', msg.success.created('sinh viên', formData.studentId));
      }
      setShowModal(false);
      loadStudents();
    } catch (err) {
      onNotify('error', err?.message || msg.error.save('sinh viên'));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await studentApi.delete(deleteTarget.studentId);
      onNotify('success', msg.success.deleted('sinh viên', deleteTarget.studentId));
      loadStudents();
    } catch (err) {
      onNotify('error', err?.message || msg.error.delete('sinh viên'));
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await studentApi.exportExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DanhSachSinhVien_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      onNotify('success', 'Xuất báo cáo Excel thành công!');
    } catch {
      onNotify('error', 'Xuất file Excel thất bại.');
    }
  };

  const handleBatchClassSubmit = async (e) => {
    e.preventDefault();
    if (!batchClassId) return;
    setLoading(true);
    try {
      for (const id of Array.from(selectedIds)) {
        const st = students.find((s) => s.studentId === id);
        if (st) {
          await studentApi.update(id, { ...st, classId: batchClassId });
        }
      }
      onNotify('success', `Đã chuyển lớp thành công cho ${selectedIds.size} sinh viên!`);
      setSelectedIds(new Set());
      setShowBatchClassModal(false);
      loadStudents();
    } catch {
      onNotify('error', 'Có lỗi xảy ra khi chuyển lớp hàng loạt.');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} sinh viên đã chọn không?`)) return;
    setLoading(true);
    try {
      for (const id of Array.from(selectedIds)) {
        await studentApi.delete(id);
      }
      onNotify('success', `Đã xóa thành công ${selectedIds.size} sinh viên!`);
      setSelectedIds(new Set());
      loadStudents();
    } catch {
      onNotify('error', 'Có lỗi xảy ra khi xóa sinh viên.');
    } finally {
      setLoading(false);
    }
  };

  const sortedStudents = useMemo(() => {
    let result = [...students];
    if (selectedStatus === 'WARNING') {
      result = result.filter(s => (s.gpa || s.cumulativeGpa || 3.0) < 2.0);
    }
    result.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return result;
  }, [students, sortField, sortOrder, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Sinh viên</h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý hồ sơ lý lịch, phân lớp hành chính và theo dõi tiến độ đào tạo
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-800 transition shadow-sm"
            >
              <Upload className="h-4 w-4" />
              <span>Nhập Excel</span>
            </button>
          )}

          {(isAdmin || isTeacher) && (
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-800 transition shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Xuất Excel</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm Sinh viên</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <StudentFilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        selectedFaculty={selectedFaculty}
        setSelectedFaculty={setSelectedFaculty}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        faculties={faculties}
        classes={classes}
        academicYears={academicYears}
        onSearchSubmit={handleSearchSubmit}
        onClearFilters={handleClearFilters}
        onReload={loadStudents}
        loading={loading}
      />

      {/* Main Student Data Table */}
      <StudentTable
        students={sortedStudents}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onToggleSelect={handleToggleSelect}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        loading={loading}
        isAdmin={isAdmin}
        onOpenTranscript={(st) => setTranscriptStudent(st)}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={(st) => setDeleteTarget(st)}
        onOpenBatchClass={() => setShowBatchClassModal(true)}
        onBatchDelete={handleBatchDelete}
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
      />

      {/* Form Modal */}
      <StudentFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        faculties={faculties}
        classes={classes}
        academicYears={academicYears}
        onSubmit={handleSaveStudent}
      />

      {/* Excel Import Modal */}
      <StudentImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        importing={importing}
        importProgress={importProgress}
        onFileUpload={handleFileUpload}
      />

      {/* Batch Class Modal */}
      <BatchClassModal
        isOpen={showBatchClassModal}
        onClose={() => setShowBatchClassModal(false)}
        selectedCount={selectedIds.size}
        classes={classes}
        batchClassId={batchClassId}
        setBatchClassId={setBatchClassId}
        onSubmit={handleBatchClassSubmit}
        loading={loading}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Xác nhận xóa sinh viên"
        message={deleteTarget ? `Bạn có chắc chắn muốn xóa sinh viên ${deleteTarget.fullName} (${deleteTarget.studentId}) không? Thao tác này không thể hoàn tác.` : ''}
        confirmText="Xóa sinh viên"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDestructive={true}
      />

      {/* Transcript Modal */}
      {transcriptStudent && (
        <TranscriptModal
          isOpen={!!transcriptStudent}
          onClose={() => setTranscriptStudent(null)}
          student={transcriptStudent}
          onNotify={onNotify}
        />
      )}
    </div>
  );
}
