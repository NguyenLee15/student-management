import React, { useState, useEffect } from 'react';
import { 
  CreditCard, CheckCircle2, Clock, AlertTriangle, 
  DollarSign, Receipt, ArrowRight, ShieldCheck, RefreshCw, X 
} from 'lucide-react';
import { studentPortalApi, paymentApi } from '../../../api';
import Skeleton from '../../../components/common/Skeleton';

export default function TuitionLedgerView() {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('PAYOS');
  const [isPaying, setIsPaying] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentOrderCode, setCurrentOrderCode] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadInvoice();

    // Check if returning from PayOS checkout URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderCodeParam = urlParams.get('order_code') || urlParams.get('orderCode');
    const paymentStatus = urlParams.get('payment_status') || urlParams.get('status');

    if (orderCodeParam) {
      setCurrentOrderCode(orderCodeParam);
      handleSyncPayOSStatus(orderCodeParam);
      
      // Clear URL params so we don't re-sync on refresh or semester change
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [selectedSemester]);

  const loadInvoice = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await studentPortalApi.getMyTuition(selectedSemester);
      const inv = res.data;
      setInvoice(inv);
      if (inv) {
        setPayAmount(inv.remainingAmount || 0);
      }
    } catch (err) {
      console.error('Lỗi khi tải hóa đơn học phí', err);
      setErrorMsg('Không tìm thấy thông tin hóa đơn học phí cho học kỳ này.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncPayOSStatus = async (orderCodeToSync) => {
    const code = orderCodeToSync || currentOrderCode;
    if (!code) return;

    setIsSyncing(true);
    try {
      const res = await paymentApi.syncStatus(code);
      const txn = res.data;
      if (txn?.status === 'PAID') {
        setSuccessMsg(`✅ Giao dịch #${code} đã được xác nhận thanh toán thành công! Công nợ đã giảm.`);
      } else {
        setErrorMsg(`Trạng thái giao dịch #${code}: ${txn?.status || 'Đang chờ xử lý'}.`);
      }
      await loadInvoice();
    } catch (err) {
      console.error('Lỗi khi đồng bộ trạng thái giao dịch', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!invoice || !payAmount || Number(payAmount) <= 0) return;

    setIsPaying(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (payMethod === 'PAYOS') {
        // Khởi tạo link thanh toán PayOS VietQR
        const res = await paymentApi.createCheckout({
          invoiceId: invoice.id,
          returnUrl: `${window.location.origin}${window.location.pathname}?payment_status=success`,
          cancelUrl: `${window.location.origin}${window.location.pathname}?payment_status=cancelled`,
        });

        const txn = res.data;
        if (txn?.checkoutUrl) {
          setCurrentOrderCode(txn.orderCode);
          // Redirect trực tiếp sang trang thanh toán VietQR của PayOS
          window.location.href = txn.checkoutUrl;
          return;
        }
      }

      // Fallback thanh toán ghi nhận trực tiếp (tiền mặt / bank transfer thủ công)
      await studentPortalApi.payTuition({
        invoiceId: invoice.id,
        amount: Number(payAmount),
        paymentMethod: payMethod,
        note: `Nộp học phí qua cổng ${payMethod}`,
      });

      setSuccessMsg('Thanh toán học phí thành công! Công nợ đã được tất toán.');
      setIsPayModalOpen(false);
      await loadInvoice();
    } catch (err) {
      console.error('Lỗi khi khởi tạo thanh toán', err);
      setErrorMsg(err.response?.data?.message || 'Giao dịch thanh toán thất bại.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Sổ Cái & Công Nợ Học Phí
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu chi tiết học phí theo học phần, biểu giá tín chỉ và lịch sử giao dịch
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value={1}>Học kỳ 1</option>
            <option value={2}>Học kỳ 2</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 font-bold text-xs">
            Đóng
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-sm font-medium">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-600 font-bold text-xs">
            Đóng
          </button>
        </div>
      )}

      {/* Invoice Overview Card */}
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : !invoice ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
          <Receipt className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
          <p className="text-base font-bold text-slate-600">Chưa có hóa đơn học phí</p>
          <p className="text-xs">Hóa đơn sẽ tự động được tạo khi bạn đăng ký các lớp học phần.</p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400">Mã Hóa Đơn</span>
              <div className="font-mono font-bold text-lg text-blue-300">{invoice.invoiceCode}</div>
              <div className="text-xs text-slate-400">Hạn: {invoice.dueDate}</div>
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
                  onClick={() => setIsPayModalOpen(true)}
                  className="mt-3 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Nộp Học Phí Ngay</span>
                </button>
              )}
            </div>
          </div>

          {/* Line Items Table */}
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
                  {invoice.items?.map((item) => (
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

          {/* Payment History */}
          {invoice.payments?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Lịch Sử Giao Dịch Thanh Toán
              </h3>

              <div className="space-y-2">
                {invoice.payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <div className="font-mono font-bold text-xs text-slate-700">
                        Mã GD: {p.transactionCode}
                      </div>
                      <div className="text-xs text-slate-400">
                        {p.paymentTime ? new Date(p.paymentTime).toLocaleString('vi-VN') : 'N/A'} • Phương thức: {p.paymentMethodName}
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
          )}
        </>
      )}

      {/* Online Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Cổng Nộp Học Phí Trực Tuyến
              </h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
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
      )}
    </div>
  );
}
