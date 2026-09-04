// cSpell:disable
import React from 'react';
import { Plus, Upload, Download } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';
import TranscriptModal from './TranscriptModal';
import StudentFilterBar from './student/StudentFilterBar';
import StudentTable from './student/StudentTable';
import StudentFormModal from './student/StudentFormModal';
import StudentImportModal from './student/StudentImportModal';
import BatchClassModal from './student/BatchClassModal';
import { useStudentImport } from './student/useStudentImport';
import { useStudentModule } from './student/useStudentModule';

export default function StudentModule({ onNotify, currentUser }) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';
  const isTeacher = currentUser?.role === 'ROLE_TEACHER' || currentUser?.role === 'TEACHER';

  const {
    sortedStudents,
    loading,
    page,
    setPage,
    size,
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
  } = useStudentModule({ onNotify });

  const {
    showImportModal,
    setShowImportModal,
    importing,
    importProgress,
    handleFileUpload,
  } = useStudentImport({ onNotify, onRefresh: loadStudents });

  return (
    <div className="space-y-6 animate-fade-in">
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
