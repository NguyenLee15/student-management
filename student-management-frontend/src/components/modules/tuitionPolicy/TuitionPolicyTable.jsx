// cSpell:disable
import React from 'react';
import { Receipt, Edit3, Trash2, Power, Calendar, ShieldCheck } from 'lucide-react';
import EmptyState from '../../common/EmptyState';
import Skeleton from '../../common/Skeleton';

export default function TuitionPolicyTable({
  policies = [],
  loading = false,
  isAdmin = false,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
  onToggleActive,
}) {
  if (loading) {
    return (
      <div className="panel-card p-5 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-slate-800/60 last:border-0">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <EmptyState
        title="Chưa có chính sách học phí nào"
        description="Hiện chưa có định mức đơn giá học phí nào được thiết lập."
        actionText={isAdmin ? "Thêm Biểu Phí Mới" : undefined}
        onAction={isAdmin ? onOpenCreate : undefined}
      />
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  return (
    <div className="panel-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Phạm Vi Áp Dụng</th>
              <th className="px-5 py-3.5">Học Kỳ</th>
              <th className="px-5 py-3.5">Đơn Giá / Tín Chỉ</th>
              <th className="px-5 py-3.5">Ngày Hiệu Lực</th>
              <th className="px-5 py-3.5 text-center">Trạng Thái</th>
              <th className="px-5 py-3.5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {policies.map((p) => {
              const isAllUniversity = !p.facultyId;

              return (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        isAllUniversity 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {p.scope || (isAllUniversity ? 'TOÀN TRƯỜNG' : p.facultyName || p.facultyId)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">
                    <div className="font-semibold text-white">{p.semesterName || `Học kỳ ${p.semesterId}`}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{p.semesterCode || ''}</div>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-emerald-400 text-sm">
                    {formatCurrency(p.unitPricePerCredit)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{p.effectiveDate ? new Date(p.effectiveDate).toLocaleDateString('vi-VN') : '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {p.active ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        HIỆU LỰC
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-500">
                        HẾT HẠN
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onToggleActive(p)}
                          title={p.active ? "Tắt kích hoạt" : "Bật kích hoạt"}
                          className={`p-1.5 rounded-lg transition ${
                            p.active 
                              ? 'text-emerald-400 hover:text-amber-400 hover:bg-slate-800' 
                              : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800'
                          }`}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenEdit(p)}
                          title="Sửa biểu phí"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenDelete(p)}
                          title="Xóa biểu phí"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
