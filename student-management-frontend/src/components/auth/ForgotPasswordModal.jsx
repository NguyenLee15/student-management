import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import { authApi } from '../../api';

export default function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Quên Mật Khẩu" subtitle="Khôi phục quyền truy cập tài khoản" maxWidth="max-w-md">
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email đã đăng ký</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Chúng tôi sẽ gửi một liên kết đến email này để bạn đặt lại mật khẩu.
            </p>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition"
            >
              Quay lại Đăng nhập
            </button>
            
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading || !email}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
              >
                <span>{loading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}</span>
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Kiểm tra Email của bạn</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Nếu email <strong className="text-slate-200">{email}</strong> có trong hệ thống, chúng tôi đã gửi một liên kết để đặt lại mật khẩu.
            </p>
          </div>
          <div className="pt-4">
            <button
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
            >
              Quay lại Đăng nhập
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
