// cSpell:disable
import React from 'react';
import { CreditCard } from 'lucide-react';

export default function TuitionSummaryCard({ invoice, onOpenPayModal }) {
  if (!invoice) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="space-y-1">
        <span className="text-xs uppercase font-bold text-slate-400">Mã Hóa Đơn</span>
        <div className="font-mono font-bold text-lg text-blue-300">{invoice.invoiceCode}</div>
        <div className="text-xs text-slate-400">
          Hạn: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('vi-VN') : 'Theo thông báo'}
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-xs uppercase font-bold text-slate-400">Tổng Học Phí</span>
        <div className="text-2xl font-black text-white">
          {Number(invoice.totalAmount || 0).toLocaleString('vi-VN')} đ
        </div>
        <div className="text-xs text-slate-400">{invoice.items?.length || 0} học phần đăng ký</div>
      </div>

      <div className="space-y-1">
        <span className="text-xs uppercase font-bold text-slate-400">Đã Thanh Toán</span>
        <div className="text-2xl font-black text-emerald-400">
          {Number(invoice.paidAmount || 0).toLocaleString('vi-VN')} đ
        </div>
        <div className="text-xs text-slate-400">
          Trạng thái: <strong>{invoice.statusName}</strong>
        </div>
      </div>

      <div className="flex flex-col justify-between items-start md:items-end">
        <div className="space-y-1 text-left md:text-right">
          <span className="text-xs uppercase font-bold text-slate-400">Còn Phải Nộp</span>
          <div className="text-2xl font-black text-amber-400">
            {Number(invoice.remainingAmount || 0).toLocaleString('vi-VN')} đ
          </div>
        </div>

        {invoice.remainingAmount > 0 && (
          <button
            onClick={onOpenPayModal}
            className="mt-3 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Nộp Học Phí Ngay</span>
          </button>
        )}
      </div>
    </div>
  );
}

