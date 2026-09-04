// cSpell:disable
import React from 'react';
import { Clock, Eye } from 'lucide-react';
import Pagination from '../../common/Pagination';

export default function AuditLogTable({
  logs = [],
  loading = false,
  page = 0,
  size = 15,
  totalPages = 1,
  totalElements = 0,
  onPageChange,
  onInspectLog,
  getActionBadge,
}) {
  return (
    <div className="panel-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto" aria-live="polite">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Thời Gian</th>
              <th className="px-5 py-3.5">Thao tác</th>
              <th className="px-5 py-3.5">Đối Tượng</th>
              <th className="px-5 py-3.5">Mã Đối Tượng</th>
              <th className="px-5 py-3.5">Chi Tiết Thao Tác</th>
              <th className="px-5 py-3.5">Người Thực Hiện</th>
              <th className="px-5 py-3.5 text-right">Đối Soát</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-5 py-8 text-center text-slate-500">
                  {loading ? 'Đang tải nhật ký hoạt động...' : 'Chưa có hoạt động nào được ghi nhận.'}
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{log.timestamp ? new Date(log.timestamp).toLocaleString('vi-VN') : '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">{getActionBadge(log.action)}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">{log.entityName}</td>
                  <td className="px-5 py-3.5 font-mono text-indigo-400 font-bold">{log.entityId || '—'}</td>
                  <td className="px-5 py-3.5 text-slate-300 max-w-xs truncate" title={log.details}>
                    {log.details || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono">{log.performedBy || 'System'}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onInspectLog(log)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi tiết</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={onPageChange}
      />
    </div>
  );
}
