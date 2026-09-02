import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { authApi } from '../../api';

export default function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    // Client-side regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ (VD: user@example.com).');
      return;
    }

    if (cooldown > 0) {
      setError(`Vui lòng đợi ${cooldown} giây trước khi gửi lại yêu cầu.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authApi.forgotPassword({ email: cleanEmail });
      setSuccess(true);
      setCooldown(60); // 60 seconds cooldown
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Khôi Phục Mật Khẩu" 
      subtitle="Nhận liên kết đặt lại mật khẩu bảo mật qua Email" 
      maxWidth="max-w-md"
    >
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="forgot-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email đã đăng ký tài khoản *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="forgot-email"
                type="email"
                required
                placeholder="VD: sinhvien@eduportal.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Hệ thống sẽ gửi một liên kết bảo mật có thời hạn 15 phút đến email này để bạn thiết lập mật khẩu mới.
            </p>
          </div>

          <div className="pt-3 flex justify-between items-center border-t border-slate-800/80">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition"
            >
              ← Quay lại Đăng nhập
            </button>
            
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={loading || !email.trim() || cooldown > 0}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : cooldown > 0 ? (
                  <span>Gửi lại ({cooldown}s)</span>
                ) : (
                  <>
                    <span>Gửi Yêu Cầu</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-5 text-center py-3">
          <div className="mx-auto w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">Đã Gửi Liên Kết Thành Công</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Nếu email <strong className="text-emerald-300 font-mono">{email}</strong> tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu trong hộp thư.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80">
            <button
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <span>Quay Lại Màn Hình Đăng Nhập</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}