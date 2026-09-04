// cSpell:disable
import React from 'react';
import { CreditCard, CheckCircle2, AlertTriangle, Receipt, ArrowRight } from 'lucide-react';
import { useTuitionPayment } from '../hooks/useTuitionPayment';
import TuitionSummaryCard from './TuitionSummaryCard';
import TuitionInvoiceTable from './TuitionInvoiceTable';
import TuitionHistoryTable from './TuitionHistoryTable';
import TuitionPaymentModal from './TuitionPaymentModal';
import Skeleton from '../../../components/common/Skeleton';

export default function TuitionLedgerView({ onNotify, onNavigateTab }) {
  const {
    invoice,
    loading,
    selectedSemester,
    setSelectedSemester,
    semesters,
    isPayModalOpen,
    setIsPayModalOpen,
    payAmount,
    setPayAmount,
    payMethod,
    setPayMethod,
    isPaying,
    successMsg,
    setSuccessMsg,
    errorMsg,
    setErrorMsg,
    handleProcessPayment,
  } = useTuitionPayment({ onNotify });

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
            aria-label="Chọn học kỳ tra cứu học phí"
          >
            {semesters && semesters.length > 0 ? (
              semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))
            ) : (
              <>
                <option value={1}>Học kỳ 1 (2026-2027)</option>
                <option value={2}>Học kỳ 2 (2026-2027)</option>
              </>
            )}
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
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-3">
          <Receipt className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
          <p className="text-base font-bold text-slate-700">Chưa phát sinh học phí trong học kỳ này</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Hóa đơn học phí sẽ tự động được hệ thống phòng Đào tạo khởi tạo ngay sau khi bạn hoàn tất đăng ký các lớp học phần.
          </p>
          {onNavigateTab && (
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('registration')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                <span>Đến trang Đăng ký học phần</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Summary Card */}
          <TuitionSummaryCard
            invoice={invoice}
            onOpenPayModal={() => setIsPayModalOpen(true)}
          />

          {/* Line Items Table */}
          <TuitionInvoiceTable items={invoice.items || []} />

          {/* Payment History */}
          <TuitionHistoryTable payments={invoice.payments || []} />
        </>
      )}

      {/* Online Payment Modal */}
      <TuitionPaymentModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        invoice={invoice}
        payAmount={payAmount}
        setPayAmount={setPayAmount}
        payMethod={payMethod}
        setPayMethod={setPayMethod}
        isPaying={isPaying}
        onProcessPayment={handleProcessPayment}
      />
    </div>
  );
}
