import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Upload, Download, Edit3, Trash2, 
  GraduationCap, RefreshCw, Mail, Phone, Calendar, School, Check, FileSpreadsheet, X, Award, FileText 
} from 'lucide-react';
import { studentApi, facultyApi, studentClassApi, academicYearApi } from '../../api';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Skeleton from '../common/Skeleton';
import ConfirmDialog from '../common/ConfirmDialog';
import TranscriptModal from './TranscriptModal';

export default function StudentModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';
  const isTeacher = currentUser?.role === 'ROLE_TEACHER' || currentUser?.role === 'TEACHER';
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Dropdown Metadata
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [transcriptStudent, setTranscriptStudent] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null); // { status, processedRows, totalRows, errorCount }

  // Form State
  const initialForm = {
    studentId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: 'MALE',
    dateOfBirth: '2004-01-01',
    address: 'Hà Nội, Việt Nam',
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
      console.warn('Máy chủ backend không phản hồi hoặc đang trống', err);
    } finally {
      setLoading(false);
    }
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
      academicYearId: academicYears[0]?.academicYearId || 'K65',
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
      dateOfBirth: student.dateOfBirth || '2004-01-01',
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
    } catch (err) {
      onNotify('error', 'Xuất file Excel thất bại.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImporting(true);
    setImportProgress({ status: 'UPLOADING', processedRows: 0, totalRows: 0, errorCount: 0 });
    
    try {
      const res = await studentApi.importExcel(file);
      const taskId = res.data?.taskId;
      
      if (!taskId) {
        throw new Error("No taskId returned from server");
      }
      
      // Poll for progress
      const pollInterval = setInterval(async () => {
        try {
          const taskRes = await studentApi.getImportTask(taskId);
          const taskData = taskRes.data;
          if (taskData) {
            setImportProgress({
              status: taskData.status,
              processedRows: taskData.processedRows,
              totalRows: taskData.totalRows,
              errorCount: taskData.errorCount
            });
            
            if (taskData.status === 'COMPLETED' || taskData.status === 'COMPLETED_WITH_ERRORS' || taskData.status === 'FAILED') {
              clearInterval(pollInterval);
              setImporting(false);
              
              if (taskData.status === 'FAILED') {
                onNotify('error', `Nhập dữ liệu thất bại: ${msg.safeMessage(taskData.errorDetails, 'Lỗi không xác định')}`);
              } else if (taskData.status === 'COMPLETED_WITH_ERRORS') {
                onNotify('warning', `Nhập dữ liệu hoàn tất với ${taskData.errorCount} lỗi.`);
                loadStudents();
              } else {
                onNotify('success', 'Nhập dữ liệu Excel thành công!');
                loadStudents();
                setTimeout(() => { setShowImportModal(false); setImportProgress(null); }, 2000);
              }
            }
          }
        } catch (pollErr) {
          console.error("Lỗi tiến trình:", pollErr);
        }
      }, 2000);
      
    } catch (err) {
      setImporting(false);
      setImportProgress(null);
      onNotify('error', err?.response?.data?.message || err?.message || 'Lỗi khi bắt đầu nhập file');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
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

      {/* Filter and Search Bar */}
      <div className="panel-card p-4 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm theo họ tên hoặc mã sinh viên (VD: SV001)..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedFaculty}
            onChange={(e) => { setSelectedFaculty(e.target.value); setPage(0); }}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">Tất cả các Khoa</option>
            {faculties.map((f) => (
              <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setPage(0); }}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">Tất cả các Lớp</option>
            {classes.map((c) => (
              <option key={c.classId} value={c.classId}>{c.className || c.classId}</option>
            ))}
          </select>

          <button
            onClick={loadStudents}
            title="Tải lại dữ liệu"
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Sinh Viên Data Table */}
      <div className="panel-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Mã sinh viên</th>
                <th className="px-5 py-3.5">Họ và Tên & Giới tính</th>
                <th className="px-5 py-3.5">Lớp / Khoa</th>
                <th className="px-5 py-3.5">Niên khóa</th>
                <th className="px-5 py-3.5">Thông tin liên hệ</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-8" /></td>
                    </tr>
                  ))
                ) : students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-0">
                    <EmptyState title="Không tìm thấy sinh viên" message="Không có sinh viên nào khớp với điều kiện tìm kiếm hiện tại." />
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr key={st.studentId} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-bold text-indigo-400 font-mono">{st.studentId}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shadow-md">
                          {st.fullName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{st.fullName}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{msg.enum.gender[st.gender] || st.gender || 'Nam'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      <div>
                        <div className="font-medium text-slate-200">{st.className || st.classId || ''}</div>
                        <div className="text-[10px] text-slate-500">{st.facultyName || st.facultyId || 'Chưa phân khoa'}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono font-medium">
                      {st.academicYearId || st.academicYearName || 'K65'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-slate-300">{st.email || '—'}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{st.phoneNumber || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => setTranscriptStudent(st)}
                        title="Xem Bảng Điểm & GPA Chi Tiết"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                      >
                        <Award className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(st)}
                            title="Sửa Sinh Viên"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(st)}
                            title="Xóa Sinh viên"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <Pagination
          page={page}
          size={size}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* ➕ Modal: Add / Sửa Sinh Viên */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? `Sửa Sinh viên: ${formData.studentId}` : 'Đăng ký Sinh viên Mới'}
        subtitle="Điền đầy đủ thông tin lý lịch và phân lớp của sinh viên"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mã Sinh Viên*</label>
              <input
                type="text"
                required
                disabled={isEdit}
                placeholder="VD: SV001"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Họ và Tên*</label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn An"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Khoa*</label>
              <select
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {faculties.map((f) => (
                  <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Lớp học*</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {classes.map((c) => (
                  <option key={c.classId} value={c.classId}>{c.className || c.classId}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Khóa học (Niên khóa)*</label>
              <select
                value={formData.academicYearId}
                onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {academicYears.map((y) => (
                  <option key={y.academicYearId} value={y.academicYearId}>{y.academicYearName || y.academicYearId}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Địa chỉ Email</label>
              <input
                type="email"
                placeholder="student@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Số điện thoại</label>
              <input
                type="text"
                placeholder="0987654321"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ngày sinh</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
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
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition"
            >
              {isEdit ? 'Lưu thay đổi' : 'Thêm Sinh viên'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showImportModal}
        onClose={() => { if(!importing) { setShowImportModal(false); setImportProgress(null); } }}
        title="Nhập Danh Sách Sinh Viên Bằng Excel"
        subtitle="Tải lên tệp .xlsx theo đúng cấu trúc dữ liệu nhà trường"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {!importing && !importProgress ? (
            <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 text-center space-y-3 cursor-pointer transition block bg-slate-950/60">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Nhấp để chọn tệp bảng tính Excel</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Hỗ trợ định dạng Microsoft Excel (.xlsx, .xls)</p>
              </div>
              <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            </label>
          ) : (
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col items-center">
              <div className="mb-4 text-center">
                <p className="text-sm font-semibold text-slate-200 mb-1">
                  {importProgress?.status === 'UPLOADING' && "Đang tải tệp lên..."}
                  {importProgress?.status === 'PENDING' && "Đang trong hàng đợi..."}
                  {importProgress?.status === 'PROCESSING' && "Đang xử lý dữ liệu..."}
                  {importProgress?.status === 'COMPLETED' && "Hoàn tất thành công!"}
                  {importProgress?.status === 'COMPLETED_WITH_ERRORS' && "Hoàn tất với một số lỗi"}
                  {importProgress?.status === 'FAILED' && "Nhập tệp thất bại"}
                </p>
                {importProgress?.totalRows > 0 && (
                  <p className="text-xs text-slate-400">
                    Đã xử lý {importProgress.processedRows} / {importProgress.totalRows} dòng
                  </p>
                )}
                {importProgress?.errorCount > 0 && (
                  <p className="text-xs text-rose-400 mt-1">
                    Lỗi: {importProgress.errorCount}
                  </p>
                )}
              </div>
              
              <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${importProgress?.status === 'FAILED' ? 'bg-rose-500' : 'bg-indigo-500'}`}
                  style={{ width: importProgress?.totalRows ? `${(importProgress.processedRows / importProgress.totalRows) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 📜 Official Academic Transcript Modal */}
      <TranscriptModal
        isOpen={!!transcriptStudent}
        onClose={() => setTranscriptStudent(null)}
        student={transcriptStudent}
      />

      {/* 🗑️ Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xác Nhận Xóa Sinh Viên"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn sinh viên "${deleteTarget?.fullName}" (ID: ${deleteTarget?.studentId})?`}
      />
    </div>
  );
}




