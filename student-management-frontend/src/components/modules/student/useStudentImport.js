// cSpell:disable
import { useState, useRef, useEffect } from 'react';
import { studentApi } from '../../../api';
import { msg } from '../../../lib/messages';

export function useStudentImport({ onNotify, onRefresh }) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const pollRef = useRef(null);
  const consecutiveErrorsRef = useRef(0);

  const clearPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    consecutiveErrorsRef.current = 0;
  };

  useEffect(() => {
    return () => clearPolling();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress({ status: 'UPLOADING', processedRows: 0, totalRows: 0, errorCount: 0 });
    clearPolling();

    try {
      const res = await studentApi.importExcel(file);
      const taskId = res.data?.taskId;
      if (!taskId) throw new Error('Không nhận được mã tác vụ (taskId) từ máy chủ');

      pollRef.current = setInterval(async () => {
        try {
          const taskRes = await studentApi.getImportTask(taskId);
          consecutiveErrorsRef.current = 0;
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
              clearPolling();
              setImporting(false);
              if (taskData.status === 'FAILED') {
                onNotify('error', `Nhập dữ liệu thất bại: ${msg.safeMessage(taskData.errorDetails, 'Lỗi không xác định')}`);
              } else if (taskData.status === 'COMPLETED_WITH_ERRORS') {
                onNotify('warning', `Nhập dữ liệu hoàn tất với ${taskData.errorCount} lỗi.`);
                if (onRefresh) onRefresh();
              } else {
                onNotify('success', 'Nhập dữ liệu Excel thành công!');
                if (onRefresh) onRefresh();
                setTimeout(() => {
                  setShowImportModal(false);
                  setImportProgress(null);
                }, 2000);
              }
            }
          }
        } catch (pollErr) {
          consecutiveErrorsRef.current += 1;
          console.error('Lỗi kiểm tra tiến trình import:', pollErr);
          if (consecutiveErrorsRef.current >= 5) {
            clearPolling();
            setImporting(false);
            onNotify('error', 'Mất kết nối theo dõi tiến trình nhập file. Vui lòng tải lại trang để kiểm tra kết quả.');
          }
        }
      }, 2000);
    } catch (err) {
      clearPolling();
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
