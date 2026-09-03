// cSpell:disable
import { useState, useEffect, useCallback } from 'react';
import { msg } from '../../../lib/messages';
import { studentPortalApi, paymentApi } from '../../../api';

export function useTuitionPayment({ onNotify }) {
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

  const loadInvoice = useCallback(async () => {
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
      console.warn('Chưa phát sinh học phí học kỳ này:', err?.response?.data?.message || err.message);
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  }, [selectedSemester]);

  const handleSyncPayOSStatus = useCallback(async (orderCodeToSync) => {
    const code = orderCodeToSync || currentOrderCode;
    if (!code) return;

    setIsSyncing(true);
    try {
      const res = await paymentApi.syncStatus(code);
      const txn = res.data;
      if (txn?.status === 'PAID') {
        const msgText = `Giao dịch #${code} đã được xác nhận thanh toán thành công! Công nợ đã giảm.`;
        setSuccessMsg(msgText);
        onNotify?.('success', msgText);
      } else {
        const msgText = `Trạng thái giao dịch #${code}: ${msg.enum.paymentStatus[txn?.status] || txn?.status || 'Đang chờ xử lý'}.`;
        setErrorMsg(msgText);
        onNotify?.('info', msgText);
      }
      await loadInvoice();
    } catch (err) {
      console.error('Lỗi khi đồng bộ trạng thái giao dịch', err);
      onNotify?.('error', 'Không thể đồng bộ trạng thái giao dịch từ cổng thanh toán');
    } finally {
      setIsSyncing(false);
    }
  }, [currentOrderCode, onNotify, loadInvoice]);

  useEffect(() => {
    loadInvoice();

    // Check if returning from PayOS checkout URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderCodeParam = urlParams.get('order_code') || urlParams.get('orderCode');
    const paymentStatus = urlParams.get('payment_status') || urlParams.get('status');

    if (orderCodeParam) {
      setCurrentOrderCode(orderCodeParam);
      handleSyncPayOSStatus(orderCodeParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      const cancelMsg = 'Bạn đã hủy phiên thanh toán VietQR PayOS.';
      setErrorMsg(cancelMsg);
      onNotify?.('warning', cancelMsg);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [selectedSemester, loadInvoice, handleSyncPayOSStatus, onNotify]);

  const handleProcessPayment = async (e) => {
    if (e) e.preventDefault();
    if (!invoice || !payAmount || Number(payAmount) <= 0) return;

    setIsPaying(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (payMethod === 'PAYOS') {
        const res = await paymentApi.createCheckout({
          invoiceId: invoice.id,
          returnUrl: `${window.location.origin}${window.location.pathname}?payment_status=success`,
          cancelUrl: `${window.location.origin}${window.location.pathname}?payment_status=cancelled`,
        });

        const txn = res.data;
        if (txn?.checkoutUrl) {
          setCurrentOrderCode(txn.orderCode);
          window.location.href = txn.checkoutUrl;
          return;
        }
      }

      await studentPortalApi.payTuition({
        invoiceId: invoice.id,
        amount: Number(payAmount),
        paymentMethod: payMethod,
        note: `Nộp học phí qua cổng ${payMethod}`,
      });

      const successText = 'Thanh toán học phí thành công! Công nợ đã được cập nhật.';
      setSuccessMsg(successText);
      onNotify?.('success', successText);
      setIsPayModalOpen(false);
      await loadInvoice();
    } catch (err) {
      console.error('Lỗi khi khởi tạo thanh toán', err);
      const errorText = err.response?.data?.message || 'Giao dịch thanh toán thất bại.';
      setErrorMsg(errorText);
      onNotify?.('error', errorText);
    } finally {
      setIsPaying(false);
    }
  };

  return {
    invoice,
    loading,
    selectedSemester,
    setSelectedSemester,
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
    isSyncing,
    loadInvoice,
    handleProcessPayment,
  };
}

