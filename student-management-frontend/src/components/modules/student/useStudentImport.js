// cSpell:disable
import { useState } from 'react';
import { studentApi } from '../../../api';
import { msg } from '../../../lib/messages';

export function useStudentImport({ onNotify, onRefresh }) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress({ status: 'UPLOADING', processedRows: 0, totalRows: 0, errorCount: 0 });

    try {
      const res = await studentApi.importExcel(file);
      const taskId = res.data?.taskId;
      if (!taskId) throw new Error('No taskId returned from server');

      const pollInterval = setInterval(async () => {
        try {
          const taskRes = await studentApi.getImportTask(taskId);
          const taskData = taskRes.data;
          if (taskData) {
            setImportProgress({
              status: taskData.status,
              processedRows: taskData.processedRows,
              totalRows: taskData.totalRows,
              errorCount: taskData.errorCount,
            });

            if (
              taskData.status === 'COMPLETED' ||
              taskData.status === 'COMPLETED_WITH_ERRORS' ||
              taskData.status === 'FAILED'
            ) {
              clearInterval(pollInterval);
              setImporting(false);
              if (taskData.status === 'FAILED') {
                onNotify('error', `Nhập dữ liệu thất bại: ${msg.safeMessage(taskData.errorDetails, 'Lỗi không xác định')}`);
              } else if (taskData.status === 'COMPLETED_WITH_ERRORS') {
                onNotify('warning', `Nhập dữ liệu hoàn tất với ${taskData.errorCount} lỗi.`);
                onRefresh();
              } else {
                onNotify('success', 'Nhập dữ liệu Excel thành công!');
                onRefresh();
                setTimeout(() => {
                  setShowImportModal(false);
                  setImportProgress(null);
                }, 2000);
              }
            }
          }
        } catch (pollErr) {
          console.error('Lỗi tiến trình import:', pollErr);
        }
      }, 2000);
    } catch (err) {
      setImporting(false);
      setImportProgress(null);
      onNotify('error', err?.response?.data?.message || err?.message || 'Lỗi khi bắt đầu nhập file');
    }
  };

  return {
    showImportModal,
    setShowImportModal,
    importing,
    importProgress,
    handleFileUpload,
  };
}
