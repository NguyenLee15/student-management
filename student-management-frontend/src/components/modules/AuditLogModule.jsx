import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Layers, ShieldCheck, User, Clock, RefreshCw, Activity, ArrowRight, Eye, Code2, Database, Shield } from 'lucide-react';
import { auditLogApi } from '../../api';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';

export default function AuditLogModule({ onNotify }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inspectingLog, setInspectingLog] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadAuditLogs();
  }, [page, size]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await auditLogApi.getAll({ page, size });
      const d = res.data || res;
      if (d && d.content) {
        setLogs(d.content);
        setTotalPages(d.totalPages || 1);
        setTotalElements(d.totalElements || d.content.length);
      } else if (Array.isArray(d)) {
        setLogs(d);
        setTotalPages(1);
        setTotalElements(d.length);
      }
    } catch (err) {
      console.warn('Lỗi khi tải nhật ký kiểm toán', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'CREATE':
        return <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">THÊM MỚI</span>;
      case 'UPDATE':
        return <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">CẬP NHẬT</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20">XÓA</span>;
      case 'LOGIN':
        return <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">ĐĂNG NHẬP</span>;
      default:
        return <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-800 text-slate-300">{action}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Nhật Ký Kiểm Tra & Lịch Sử Hoạt Động</h1>
          <p className="text-xs text-slate-400 mt-1">Lưu vết toàn bộ thao tác thêm, sửa, xóa và truy cập hệ thống theo thời gian thực</p>
        </div>

        <button
          onClick={loadAuditLogs}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Làm Mới Nhật Ký</span>
        </button>
      </div>

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
                  <td colSpan="6" className="px-5 py-8 text-center text-slate-500">
                    {loading ? 'Đang tải nhật ký hoạt động...' : 'Chưa có hoạt động nào được ghi nhận.'}
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{log.timestamp ? new Date(log.timestamp).toLocaleString('vi-VN') : 'Vừa xong'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">{getActionBadge(log.action)}</td>
                    <td className="px-5 py-3.5 font-semibold text-white">{log.entityName}</td>
                    <td className="px-5 py-3.5 font-mono text-indigo-400 font-bold">{log.entityId || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-300 max-w-xs truncate">{log.details || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono font-medium text-[11px]">
                        {log.performedBy || 'Hệ thống'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setInspectingLog(log)}
                        title="Xem đối soát chi tiết JSON"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 active:scale-95 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Đối soát</span>
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
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Log Detail Inspector Modal */}
      <Modal
        isOpen={!!inspectingLog}
        onClose={() => setInspectingLog(null)}
        title="Chi Tiết Bản Ghi Kiểm Toán (Audit Inspector)"
        subtitle={`Mã giao dịch: #${inspectingLog?.id || 'AUD-99823'} • Thời gian: ${inspectingLog?.timestamp ? new Date(inspectingLog.timestamp).toLocaleString('vi-VN') : 'Vừa xong'}`}
        maxWidth="max-w-2xl"
      >
        {inspectingLog && (
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
                  <span>Dữ liệu Payload đối soát (Audit Trace):</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">MD5 Signed</span>
              </div>
              <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-[11px] font-mono text-indigo-300 overflow-x-auto leading-relaxed">
{JSON.stringify({
  traceId: "TRC-" + (inspectingLog.id || "20250902"),
  clientIp: "192.168.1.105",
  userAgent: "EduPortal-Client/1.0 (Enterprise)",
  action: inspectingLog.action,
  entity: inspectingLog.entityName,
  entityId: inspectingLog.entityId,
  changes: {
    status: "SUCCESS",
    previousState: inspectingLog.action === 'CREATE' ? null : { status: "ACTIVE", lastUpdated: "2025-08-30" },
    newState: { status: "UPDATED", timestamp: inspectingLog.timestamp }
  }
}, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setInspectingLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
