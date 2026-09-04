import React, { useEffect } from 'react';
import { CreditCard, X, CheckCircle2, RefreshCw, ArrowRight, Send } from 'lucide-react';

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
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // When switching to PayOS, lock amount to remaining balance
  useEffect(() => {
    if (payMethod === 'PAYOS' && invoice?.remainingAmount) {
      setPayAmount(invoice.remainingAmount);
    }
  }, [payMethod, invoice, setPayAmount]);

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
              Số tiền thanh toán (VNĐ) {payMethod === 'PAYOS' && <span className="text-blue-600 font-normal">(Cố định theo dư nợ)</span>}
            </label>
            <input
              id="tuition-pay-amount"
              type="number"
              min="10000"
              max={invoice?.remainingAmount || 100000000}
              value={payAmount}
              readOnly={payMethod === 'PAYOS'}
              onChange={(e) => setPayAmount(e.target.value)}
              required
              className={`w-full px-4 py-3 border rounded-xl font-bold text-lg focus:outline-none ${
                payMethod === 'PAYOS'
                  ? 'bg-slate-100 border-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-blue-500'
              }`}
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
              ⚡ Cổng VietQR PayOS sẽ tạo mã QR thanh toán toàn bộ công nợ còn lại ({Number(invoice?.remainingAmount || 0).toLocaleString('vi-VN')} đ) của học kỳ này và tự động gạch nợ sau khi quét.
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={isPaying || !payAmount}
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-colors text-xs flex items-center justify-center gap-1.5"
              >
                {isPaying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang gửi xác nhận...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Xác Nhận Nộp {Number(payAmount || 0).toLocaleString('vi-VN')} đ</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
