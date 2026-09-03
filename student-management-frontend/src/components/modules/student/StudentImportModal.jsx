// cSpell:disable
import React from 'react';
import { Upload, FileSpreadsheet, RefreshCw } from 'lucide-react';
import Modal from '../../common/Modal';

export default function StudentImportModal({
  isOpen,
  onClose,
  importing = false,
  importProgress,
  onFileUpload,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nhập danh sách sinh viên từ file Excel (.xlsx)"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Vui lòng tải lên file định dạng <code className="text-indigo-400 font-mono">.xlsx</code> hoặc <code className="text-indigo-400 font-mono">.xls</code> theo đúng định dạng mẫu. Hệ thống sẽ tự động xử lý và báo lỗi nếu dữ liệu trùng lặp hoặc sai định dạng.
        </p>

        <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl p-6 text-center transition cursor-pointer bg-slate-950/40 relative">
          <input
            type="file"
            accept=".xlsx, .xls"
            disabled={importing}
            onChange={onFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <FileSpreadsheet className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <div className="text-xs font-semibold text-slate-200">
            {importing ? 'Đang tải file lên...' : 'Chọn hoặc kéo thả file Excel vào đây'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Dung lượng tối đa: 10MB</div>
        </div>

        {importProgress && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Tiến trình xử lý:</span>
              <span className="font-semibold text-indigo-400 font-mono">{importProgress.status}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: importProgress.totalRows > 0
                    ? `${Math.round((importProgress.processedRows / importProgress.totalRows) * 100)}%`
                    : '10%'
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Đã xử lý: {importProgress.processedRows}/{importProgress.totalRows || '—'} dòng</span>
              {importProgress.errorCount > 0 && (
                <span className="text-rose-400 font-bold">{importProgress.errorCount} lỗi</span>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={importing}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition disabled:opacity-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
