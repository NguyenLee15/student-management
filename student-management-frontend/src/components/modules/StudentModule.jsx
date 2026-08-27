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
    address: 'Ha Noi, Viet Nam',
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
      console.error('Failed loading metadata', e);
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
      console.warn('Backend not responding or empty, using local cache', err);
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
    try {
      if (isEdit) {
        await studentApi.update(formData.studentId, formData);
        onNotify('success', `Student ${formData.studentId} updated successfully!`);
      } else {
        await studentApi.create(formData);
        onNotify('success', `Student ${formData.studentId} created successfully!`);
      }
      setShowModal(false);
      loadStudents();
    } catch (err) {
      onNotify('error', err?.message || 'Error saving student');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await studentApi.delete(deleteTarget.studentId);
      onNotify('success', `Student ${deleteTarget.studentId} deleted successfully!`);
      loadStudents();
    } catch (err) {
      onNotify('error', err?.message || 'Error deleting student');
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await studentApi.exportExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Students_List_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      onNotify('success', 'Excel student report exported successfully!');
    } catch (err) {
      onNotify('error', 'Failed exporting Excel file.');
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
                onNotify('error', `Import Failed: ${taskData.errorDetails || 'Unknown error'}`);
              } else if (taskData.status === 'COMPLETED_WITH_ERRORS') {
                onNotify('warning', `Import completed with ${taskData.errorCount} errors.`);
                loadStudents();
              } else {
                onNotify('success', 'Imported Excel data successfully!');
                loadStudents();
                setTimeout(() => { setShowImportModal(false); setImportProgress(null); }, 2000);
              }
            }
          }
        } catch (pollErr) {
          console.error("Polling error:", pollErr);
        }
      }, 2000);
      
    } catch (err) {
      setImporting(false);
      setImportProgress(null);
      onNotify('error', err?.response?.data?.message || err?.message || 'Failed to start import');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Student Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enrollment records, biographical details, and faculty assignments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-800 transition shadow-sm"
            >
              <Upload className="h-4 w-4" />
              <span>Import Excel</span>
            </button>
          )}

          {(isAdmin || isTeacher) && (
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-800 transition shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Export (.xlsx)</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>New Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by student name or student ID (e.g. SV001)..."
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
            <option value="">All Faculties</option>
            {faculties.map((f) => (
              <option key={f.facultyId} value={f.facultyId}>{f.facultyName || f.facultyId}</option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setPage(0); }}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c.classId} value={c.classId}>{c.className || c.classId}</option>
            ))}
          </select>

          <button
            onClick={loadStudents}
            title="Reload data"
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Student Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Student ID</th>
                <th className="px-5 py-3.5">Full Name & Gender</th>
                <th className="px-5 py-3.5">Class / Faculty</th>
                <th className="px-5 py-3.5">Academic Year</th>
                <th className="px-5 py-3.5">Contact Info</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
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
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                          {st.fullName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{st.fullName}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{st.gender?.toLowerCase() || 'Male'}</div>
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
                        title="View Official Transcript & GPA"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                      >
                        <Award className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(st)}
                            title="Edit Student"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(st)}
                            title="Delete Student"
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

      {/* ➕ Modal: Add / Edit Student */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? `Edit Student: ${formData.studentId}` : 'Register New Student'}
        subtitle="Provide student biographical and academic enrolment parameters"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Student ID (Mã Sinh Viên)*</label>
              <input
                type="text"
                required
                disabled={isEdit}
                placeholder="e.g. SV001"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name (Họ và Tên)*</label>
              <input
                type="text"
                required
                placeholder="e.g. Nguyen Van An"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Faculty (Khoa)*</label>
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
              <label className="block text-slate-300 font-semibold mb-1">Class (Lớp học)*</label>
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
              <label className="block text-slate-300 font-semibold mb-1">Academic Year (Khóa)*</label>
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
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                placeholder="student@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
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
              <label className="block text-slate-300 font-semibold mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="MALE">Male (Nam)</option>
                <option value="FEMALE">Female (Nữ)</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date of Birth</label>
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition"
            >
              {isEdit ? 'Save Changes' : 'Create Student'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showImportModal}
        onClose={() => { if(!importing) { setShowImportModal(false); setImportProgress(null); } }}
        title="Batch Import Students via Excel"
        subtitle="Upload an .xlsx file conforming to university schema"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {!importing && !importProgress ? (
            <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center space-y-3 cursor-pointer transition block bg-slate-950/60">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Click to select an Excel spreadsheet</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Supports Microsoft Excel (.xlsx, .xls)</p>
              </div>
              <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            </label>
          ) : (
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
              <div className="mb-4 text-center">
                <p className="text-sm font-semibold text-slate-200 mb-1">
                  {importProgress?.status === 'UPLOADING' && "Uploading file..."}
                  {importProgress?.status === 'PENDING' && "In Queue..."}
                  {importProgress?.status === 'PROCESSING' && "Processing rows..."}
                  {importProgress?.status === 'COMPLETED' && "Finished successfully!"}
                  {importProgress?.status === 'COMPLETED_WITH_ERRORS' && "Finished with errors"}
                  {importProgress?.status === 'FAILED' && "Import failed"}
                </p>
                {importProgress?.totalRows > 0 && (
                  <p className="text-xs text-slate-400">
                    Processed {importProgress.processedRows} of {importProgress.totalRows} rows
                  </p>
                )}
                {importProgress?.errorCount > 0 && (
                  <p className="text-xs text-rose-400 mt-1">
                    Errors: {importProgress.errorCount}
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
        title="Confirm Student Deletion"
        message={`Are you sure you want to permanently remove student "${deleteTarget?.fullName}" (ID: ${deleteTarget?.studentId})?`}
      />
    </div>
  );
}




