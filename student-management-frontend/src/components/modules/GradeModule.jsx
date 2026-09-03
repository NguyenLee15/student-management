// cSpell:disable
import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, Download, RefreshCw, Search, X } from 'lucide-react';
import { gradeApi, studentApi, subjectApi } from '../../api';
import ConfirmDialog from '../common/ConfirmDialog';
import GradeStatsBar from './grade/GradeStatsBar';
import GradeTable from './grade/GradeTable';
import GradeFormModal from './grade/GradeFormModal';

export default function GradeModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';
  const isTeacher = currentUser?.role === 'ROLE_TEACHER' || currentUser?.role === 'TEACHER';
  const canManage = isAdmin || isTeacher;

  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [studentSearch, setStudentsSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    gradeId: null,
    studentId: '',
    subjectId: '',
    attendanceScore: '',
    midtermScore: '',
    finalExamScore: '',
    semester: 'SEMESTER_1',
    academicYear: '2026-2027',
    studyPhase: 'PHASE_1',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadDependencies();
  }, []);

  useEffect(() => {
    loadGrades();
  }, [page, size, selectedSemester]);

  const loadDependencies = async () => {
    try {
      const [stRes, subRes] = await Promise.allSettled([
        studentApi.getAll({ page: 0, size: 50 }),
        subjectApi.getAll({ page: 0, size: 50 }),
      ]);
      if (stRes.status === 'fulfilled') {
        const d = stRes.value.data || stRes.value;
        setStudents(Array.isArray(d) ? d : d.content || []);
      }
      if (subRes.status === 'fulfilled') {
        const d = subRes.value.data || subRes.value;
        setSubjects(Array.isArray(d) ? d : d.content || []);
      }
    } catch (e) {
      console.warn('Lỗi khi tải dữ liệu phụ thuộc cho điểm', e);
    }
  };

  const loadGrades = async () => {
    setLoading(true);
    try {
      const res = await gradeApi.getAll({
        page,
        size,
        studentId: studentSearch || undefined,
        semester: selectedSemester || undefined,
      });
      const d = res.data || res;
      if (d && d.content) {
        setGrades(d.content);
        setTotalPages(d.totalPages || 1);
        setTotalElements(d.totalElements || d.content.length);
      } else if (Array.isArray(d)) {
        setGrades(d);
        setTotalPages(1);
        setTotalElements(d.length);
      }
    } catch (err) {
      console.warn('Lỗi khi tải bảng điểm', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData({
      ...initialForm,
      studentId: students[0]?.studentId || '',
      subjectId: subjects[0]?.subjectId || '',
      attendanceScore: '',
      midtermScore: '',
      finalExamScore: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (g) => {
    setIsEdit(true);
    setFormData({
      gradeId: g.gradeId,
      studentId: g.studentId || '',
      subjectId: g.subjectId || '',
      attendanceScore: g.attendanceScore ?? '',
      midtermScore: g.midtermScore ?? '',
      finalExamScore: g.finalExamScore ?? '',
      semester: g.semester || 'SEMESTER_1',
      academicYear: g.academicYear || '2026-2027',
      studyPhase: g.studyPhase || 'PHASE_1',
    });
    setShowModal(true);
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        attendanceScore: formData.attendanceScore !== '' ? Number(formData.attendanceScore) : null,
        midtermScore: formData.midtermScore !== '' ? Number(formData.midtermScore) : null,
        finalExamScore: formData.finalExamScore !== '' ? Number(formData.finalExamScore) : null,
      };

      if (isEdit) {
        await gradeApi.update(formData.gradeId, payload);
        onNotify('success', msg.success.updated('điểm', formData.gradeId));
      } else {
        await gradeApi.create(payload);
        onNotify('success', msg.success.created('điểm'));
      }
      setShowModal(false);
      loadGrades();
    } catch (err) {
      onNotify('error', err?.message || msg.error.save('điểm'));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await gradeApi.delete(deleteTarget.gradeId);
      onNotify('success', msg.success.deleted('điểm'));
      loadGrades();
    } catch (err) {
      onNotify('error', err?.message || msg.error.delete('điểm'));
    }
  };

  const handleExportCSV = () => {
    if (!grades || grades.length === 0) {
      onNotify('error', 'Chưa có bản ghi điểm để xuất file.');
      return;
    }

    const headers = [
      'STT', 'Mã Điểm', 'Mã Sinh Viên', 'Họ Và Tên', 'Môn Học', 'Điểm Chuyên Cần', 'Điểm Giữa Kỳ', 'Điểm Cuối Kỳ', 'Tổng Kết (Hệ 10)', 'Hệ 4', 'Điểm Chữ', 'Học Kỳ', 'Năm Học'
    ];

    const rows = grades.map((g, idx) => [
      idx + 1,
      `"${g.gradeId || ''}"`,
      `"${g.studentId || ''}"`,
      `"${(g.studentName || '').replace(/"/g, '""')}"`,
      `"${(g.subjectName || '').replace(/"/g, '""')}"`,
      g.attendanceScore != null ? g.attendanceScore : '',
      g.midtermScore != null ? g.midtermScore : '',
      g.finalExamScore != null ? g.finalExamScore : '',
      g.scoreScale10 != null ? g.scoreScale10 : '',
      g.scoreScale4 != null ? g.scoreScale4 : '',
      `"${g.letterGrade || ''}"`,
      `"${msg.enum.semester[g.semester] || g.semester || ''}"`,
      `"${g.academicYear || ''}"`
    ].join(','));

    const metaBlock = [
      `"TRƯỜNG ĐẠI HỌC CÔNG NGHỆ & ĐÀO TẠO"`,
      `"BẢNG TỔNG HỢP KẾT QUẢ HỌC TẬP SINH VIÊN"`,
      `"Tổng số bản ghi: ${grades.length}"`,
      `"Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}"`,
      ''
    ];

    const csvContent = '\uFEFF' + [...metaBlock, headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BangDiem_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify('success', 'Đã xuất bảng điểm ra file CSV thành công!');
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Điểm Số & Học Vụ</h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi, cập nhật điểm học phần và tự động quy đổi thang 4, thang chữ
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

          {canManage && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Nhập Điểm</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <GradeStatsBar grades={grades} />

      {/* Filter Toolbar */}
      <div className="panel-card p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(0);
              loadGrades();
            }}
            className="relative flex-1 w-full"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã sinh viên..."
              value={studentSearch}
              onChange={(e) => setStudentsSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition font-mono"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setPage(0);
              }}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="">Tất cả học kỳ</option>
              <option value="SEMESTER_1">Học kỳ 1</option>
              <option value="SEMESTER_2">Học kỳ 2</option>
              <option value="SUMMER_SEMESTER">Học kỳ hè</option>
            </select>

            {(studentSearch || selectedSemester) && (
              <button
                onClick={() => {
                  setStudentsSearch('');
                  setSelectedSemester('');
                  setPage(0);
                }}
                className="flex items-center gap-1 text-xs px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-slate-800 transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Xóa lọc</span>
              </button>
            )}

            <button
              onClick={loadGrades}
              title="Tải lại dữ liệu"
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition active:scale-95"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <GradeTable
        grades={grades}
        loading={loading}
        canManage={canManage}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={(g) => setDeleteTarget(g)}
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
      />

      {/* Grade Form Modal */}
      <GradeFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        students={students}
        subjects={subjects}
        onSubmit={handleSaveGrade}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Xác nhận xóa bản ghi điểm"
        message={deleteTarget ? `Bạn có chắc chắn muốn xóa điểm môn '${deleteTarget.subjectName}' của sinh viên '${deleteTarget.studentName}' (${deleteTarget.studentId}) không?` : ''}
        confirmText="Xóa điểm"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDestructive={true}
      />
    </div>
  );
}
