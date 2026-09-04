// cSpell:disable
import { useState, useEffect, useMemo } from 'react';
import { studentApi, facultyApi, studentClassApi, academicYearApi } from '../../../api';
import { msg } from '../../../lib/messages';

export function useStudentModule({ onNotify }) {
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
    if (!batchClassId) {
      onNotify('error', 'Vui lòng chọn lớp cần gán.');
      return;
    }
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
      setBatchClassId('');
      loadStudents();
    } catch (err) {
      onNotify('error', err?.message || 'Có lỗi xảy ra khi chuyển lớp hàng loạt.');
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
    } catch (err) {
      onNotify('error', err?.message || 'Có lỗi xảy ra khi xóa sinh viên.');
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

  return {
    students,
    sortedStudents,
    loading,
    page,
    setPage,
    size,
    setSize,
    totalPages,
    totalElements,
    keyword,
    setKeyword,
    selectedFaculty,
    setSelectedFaculty,
    selectedClass,
    setSelectedClass,
    selectedYear,
    setSelectedYear,
    selectedStatus,
    setSelectedStatus,
    selectedIds,
    setSelectedIds,
    sortField,
    sortOrder,
    faculties,
    classes,
    academicYears,
    showModal,
    setShowModal,
    isEdit,
    formData,
    setFormData,
    showBatchClassModal,
    setShowBatchClassModal,
    batchClassId,
    setBatchClassId,
    deleteTarget,
    setDeleteTarget,
    transcriptStudent,
    setTranscriptStudent,
    loadStudents,
    handleSort,
    handleSelectAll,
    handleToggleSelect,
    handleClearFilters,
    handleSearchSubmit,
    handleOpenCreate,
    handleOpenEdit,
    handleSaveStudent,
    handleConfirmDelete,
    handleExportExcel,
    handleBatchClassSubmit,
    handleBatchDelete,
  };
}
