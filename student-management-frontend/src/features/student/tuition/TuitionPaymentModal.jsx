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
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tuition-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 id="tuition-modal-title" className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Cổng Nộp Học Phí Trực Tuyến
          </h3>
          <button
            onClick={onClose}
            aria-label="Đóng cửa sổ thanh toán"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onProcessPayment} className="space-y-4">
          <div>
            <label htmlFor="tuition-pay-amount" className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Số tiền thanh toán (VNĐ)
            </label>
            <input
              id="tuition-pay-amount"
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
                { id: 'BANK_TRANSFER', name: 'Chuyển khoản thủ công qua STK trường' },
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

          {payMethod === 'PAYOS' ? (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800">
              ⚡ Giao dịch VietQR được mã hóa bảo mật và tự động ghi nhận vào sổ cái sinh viên ngay sau khi thanh toán thành công.
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <span>ℹ️ Hướng dẫn thanh toán trực tiếp:</span>
              </div>
              <p>
                {payMethod === 'CASH'
                  ? 'Vui lòng đến Phòng Kế toán - Tài chính (Phòng A101, Tòa nhà Điều hành) để nộp tiền mặt. Cán bộ kế toán sẽ xuất biên lai và gạch nợ trên hệ thống.'
                  : 'Vui lòng chuyển khoản theo STK nhà trường (Ngân hàng BIDV - STK: 12410001234567 - Chủ TK: Truong Dai Hoc CNTT). Ghi rõ nội dung: [Mã SV] [Họ tên] nop hoc phi. Kế toán sẽ đối soát và cập nhật trong 24h.'}
              </p>
            </div>
          )}

          {payMethod === 'PAYOS' ? (
            <button
              type="submit"
              disabled={isPaying || !payAmount}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isPaying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang khởi tạo mã thanh toán VietQR...</span>
                </>
              ) : (
                <>
                  <span>Tạo Mã VietQR Nộp {Number(payAmount || 0).toLocaleString('vi-VN')} đ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs"
            >
              Đã Nắm Rõ Hướng Dẫn - Đóng Hộp Thoại
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
