import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title = 'Xác Nhận Thao Tác',
  message,
  confirmText = 'Xóa',
  cancelText = 'Hủy',
  isDanger = true,
  isDestructive
}) {
  const handleClose = onClose || onCancel || (() => {});
  const danger = isDestructive !== undefined ? isDestructive : isDanger;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className={`p-2 rounded-lg ${danger ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
            {message || 'Bạn có chắc chắn muốn thực hiện thao tác này? Hành động này không thể hoàn tác.'}
          </p>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              handleClose();
            }}
            className={`px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-lg transition active:scale-95 ${
              danger 
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
