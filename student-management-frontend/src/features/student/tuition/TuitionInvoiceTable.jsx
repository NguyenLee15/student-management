// cSpell:disable
import React from 'react';
import { Receipt } from 'lucide-react';

export default function TuitionInvoiceTable({ items = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-6">
      <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
        <Receipt className="w-5 h-5 text-blue-600" />
        Chi Tiết Học Phí Theo Học Phần
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Mã Học Phần</th>
              <th className="px-4 py-3">Tên Môn Học</th>
              <th className="px-4 py-3 text-center">Số TC</th>
              <th className="px-4 py-3 text-right">Đơn Giá / TC</th>
              <th className="px-4 py-3 text-right">Thành Tiền</th>
              <th className="px-4 py-3 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-mono font-bold text-xs text-blue-700">
                  {item.subjectId || item.classCode}
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">
                  {item.subjectName || item.classCode}
                </td>
                <td className="px-4 py-3 text-center font-semibold">{item.credits}</td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {Number(item.unitPrice || 0).toLocaleString('vi-VN')} đ
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-800">
                  {Number(item.amount || 0).toLocaleString('vi-VN')} đ
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      item.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500 line-through'
                    }`}
                  >
                    {item.status === 'ACTIVE' ? 'Áp dụng' : 'Đã hủy'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
