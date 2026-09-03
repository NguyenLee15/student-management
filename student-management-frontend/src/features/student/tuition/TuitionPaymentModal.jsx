// cSpell:disable
import React from 'react';
import { CreditCard, X, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';

export default function TuitionPaymentModal({
  isOpen,
  onClose,
  invoice,
  payAmount,
  setPayAmount,
  payMethod,
  setPayMethod,
  isPaying,
  onProcessPayment,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Cổng Nộp Học Phí Trực Tuyến
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onProcessPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Số tiền thanh toán (VNĐ)
            </label>
            <input
              type="number"
              min="10000"
              max={invoice?.remainingAmount || 100000000}
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Phương thức thanh toán
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'PAYOS', name: '⚡ Cổng PayOS (Quét mã VietQR tự động cập nhật)' },
                { id: 'BANK_TRANSFER', name: 'Chuyển khoản thủ công' },
                { id: 'CASH', name: 'Nộp tiền mặt tại quầy kế toán' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    payMethod === m.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{m.name}</span>
                  {payMethod === m.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800">
            Giao dịch được bảo mật và tự động ghi nhận vào sổ cái sinh viên ngay khi hoàn tất.
          </div>

          <button
            type="submit"
            disabled={isPaying || !payAmount}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isPaying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang xử lý giao dịch...</span>
              </>
            ) : (
              <>
                <span>Xác Nhận Nộp {Number(payAmount || 0).toLocaleString('vi-VN')} đ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
