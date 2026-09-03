// cSpell:disable
import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function TuitionHistoryTable({ payments = [] }) {
  if (!payments || payments.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        Lịch Sử Giao Dịch Thanh Toán
      </h3>

      <div className="space-y-2">
        {payments.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4"
          >
            <div className="space-y-0.5">
              <div className="font-mono font-bold text-xs text-slate-700">
                Mã GD: {p.transactionCode}
              </div>
              <div className="text-xs text-slate-400">
                {p.paymentTime ? new Date(p.paymentTime).toLocaleString('vi-VN') : 'Chưa ghi nhận'} • Phương thức: {p.paymentMethodName}
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-emerald-600">
                +{Number(p.amount).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

