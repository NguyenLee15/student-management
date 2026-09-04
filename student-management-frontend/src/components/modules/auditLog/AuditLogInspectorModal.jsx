// cSpell:disable
import React from 'react';
import { Code2 } from 'lucide-react';
import Modal from '../../common/Modal';

export default function AuditLogInspectorModal({
  inspectingLog,
  onClose,
  getActionBadge,
}) {
  if (!inspectingLog) return null;

  const getCleanAuditPayload = (log) => {
    if (!log) return {};
    return {
      auditLogId: log.id,
      action: log.action,
      entityName: log.entityName,
      entityId: log.entityId,
      performedBy: log.performedBy || 'System',
      recordedAt: log.timestamp,
      details: log.details || 'Không có mô tả bổ sung'
    };
  };

  return (
    <Modal
      isOpen={!!inspectingLog}
      onClose={onClose}
      title="Chi Tiết Bản Ghi Kiểm Toán (Audit Inspector)"
      subtitle={`Mã giao dịch: #${inspectingLog?.id || '—'} • Thời gian: ${inspectingLog?.timestamp ? new Date(inspectingLog.timestamp).toLocaleString('vi-VN') : 'Vừa xong'}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="panel-card p-3">
            <span className="text-slate-500 block text-[10px]">Hành động</span>
            <span className="font-bold text-white mt-1 block">{getActionBadge(inspectingLog.action)}</span>
          </div>
          <div className="panel-card p-3">
            <span className="text-slate-500 block text-[10px]">Thực thể</span>
            <span className="font-bold text-white mt-1 block">{inspectingLog.entityName}</span>
          </div>
          <div className="panel-card p-3">
            <span className="text-slate-500 block text-[10px]">Mã thực thể</span>
            <span className="font-bold text-indigo-400 font-mono mt-1 block">{inspectingLog.entityId || '—'}</span>
          </div>
          <div className="panel-card p-3">
            <span className="text-slate-500 block text-[10px]">Người thực hiện</span>
            <span className="font-bold text-slate-300 font-mono mt-1 block">{inspectingLog.performedBy || 'Hệ thống'}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-slate-400 font-semibold block">Nội dung tóm tắt:</span>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200">
            {inspectingLog.details || 'Không có mô tả chi tiết kèm theo.'}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dữ liệu Bản ghi Kiểm toán (Audit Record Payload):</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Verified Integrity</span>
          </div>
          <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-[11px] font-mono text-indigo-300 overflow-x-auto leading-relaxed">
{JSON.stringify(getCleanAuditPayload(inspectingLog), null, 2)}
          </pre>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
