// cSpell:disable
import { useState, useRef, useEffect } from 'react';
import { studentApi } from '../../../api';
import { msg } from '../../../lib/messages';

export function useStudentImport({ onNotify, onRefresh }) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const pollRef = useRef(null);
  const timeoutRef = useRef(null);
  const isPollingRef = useRef(false);
  const consecutiveErrorsRef = useRef(0);

  const clearTimers = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    consecutiveErrorsRef.current = 0;
    isPollingRef.current = false;
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file extension
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    if (!isValidExtension) {
      if (onNotify) onNotify('error', 'Chỉ hỗ trợ file Excel có định dạng .xlsx hoặc .xls!');
      e.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      if (onNotify) onNotify('error', 'Dung lượng file vượt quá giới hạn cho phép (tối đa 10MB)!');
      e.target.value = '';
      return;
    }

    setImporting(true);
    setImportProgress({ status: 'UPLOADING', processedRows: 0, totalRows: 0, errorCount: 0 });
    clearTimers();

    try {
      const res = await studentApi.importExcel(file);
      const taskId = res.data?.taskId;
      if (!taskId) throw new Error('Không nhận được mã tác vụ (taskId) từ máy chủ');

      pollRef.current = setInterval(async () => {
        if (isPollingRef.current) return;
        isPollingRef.current = true;
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
              clearTimers();
              setImporting(false);
              if (taskData.status === 'FAILED') {
                onNotify('error', `Nhập dữ liệu thất bại: ${msg.safeMessage(taskData.errorDetails, 'Lỗi không xác định')}`);
              } else if (taskData.status === 'COMPLETED_WITH_ERRORS') {
                onNotify('warning', `Nhập dữ liệu hoàn tất với ${taskData.errorCount} lỗi.`);
                if (onRefresh) onRefresh();
              } else {
                onNotify('success', 'Nhập dữ liệu Excel thành công!');
                if (onRefresh) onRefresh();
                timeoutRef.current = setTimeout(() => {
                  setShowImportModal(false);
                  setImportProgress(null);
                  timeoutRef.current = null;
                }, 2000);
              }
            }
          }
        } catch (pollErr) {
          consecutiveErrorsRef.current += 1;
          console.error('Lỗi kiểm tra tiến trình import:', pollErr);
          if (consecutiveErrorsRef.current >= 5) {
            clearTimers();
            setImporting(false);
            onNotify('error', 'Mất kết nối theo dõi tiến trình nhập file. Vui lòng tải lại trang để kiểm tra kết quả.');
          }
        } finally {
          isPollingRef.current = false;
        }
      }, 2000);
    } catch (err) {
      clearTimers();
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
