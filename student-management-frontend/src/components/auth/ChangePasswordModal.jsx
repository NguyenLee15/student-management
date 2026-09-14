import React, { useEffect, useRef, useState } from 'react';
import { userApi } from '../../api';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [visibleFields, setVisibleFields] = useState({});
  const closeTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  const handleClose = () => {
    clearTimeout(closeTimerRef.current);
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setVisibleFields({});
    setErrorMsg('');
    setSuccessMsg('');
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.newPassword.length < 8) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await userApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccessMsg('Đổi mật khẩu thành công!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      closeTimerRef.current = setTimeout(handleClose, 1500);
    } catch (error) {
      setErrorMsg(error.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Đổi Mật Khẩu Bảo Mật"
      subtitle="Thiết lập mật khẩu mới (tối thiểu 8 ký tự)"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm" noValidate>
        {errorMsg && (
          <div className="flex gap-2.5 p-3 text-sm bg-rose-500/10 text-rose-200 border border-rose-500/30 rounded-xl" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex gap-2.5 p-3 text-sm bg-emerald-500/10 text-emerald-200 border border-emerald-500/30 rounded-xl font-semibold" role="status" aria-live="polite">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="relative">
          <label htmlFor="change-current-password" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Mật khẩu hiện tại *
          </label>
          <input
            id="change-current-password"
            name="currentPassword"
            type={visibleFields.currentPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className="w-full px-3.5 py-2.5 pr-12 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setVisibleFields((current) => ({ ...current, currentPassword: !current.currentPassword }))}
            aria-label={visibleFields.currentPassword ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'}
            aria-pressed={Boolean(visibleFields.currentPassword)}
            className="absolute right-1.5 top-[1.95rem] inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-slate-400 transition hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            {visibleFields.currentPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        <div className="relative">
          <label htmlFor="change-new-password" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Mật khẩu mới (tối thiểu 8 ký tự) *
          </label>
          <input
            id="change-new-password"
            name="newPassword"
            type={visibleFields.newPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            aria-describedby="change-new-password-helper"
            className="w-full px-3.5 py-2.5 pr-12 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
          <button type="button" onClick={() => setVisibleFields((current) => ({ ...current, newPassword: !current.newPassword }))} aria-label={visibleFields.newPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'} aria-pressed={Boolean(visibleFields.newPassword)} className="absolute right-1.5 top-[1.95rem] inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-slate-400 transition hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            {visibleFields.newPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
          <p id="change-new-password-helper" className="mt-1.5 text-xs leading-5 text-slate-400">Tối thiểu 8 ký tự.</p>
        </div>

        <div className="relative">
          <label htmlFor="change-confirm-password" className="block text-sm font-semibold text-slate-200 mb-1.5">
            Xác nhận mật khẩu mới *
          </label>
          <input
            id="change-confirm-password"
            name="confirmPassword"
            type={visibleFields.confirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full px-3.5 py-2.5 pr-12 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <button type="button" onClick={() => setVisibleFields((current) => ({ ...current, confirmPassword: !current.confirmPassword }))} aria-label={visibleFields.confirmPassword ? 'Ẩn xác nhận mật khẩu mới' : 'Hiện xác nhận mật khẩu mới'} aria-pressed={Boolean(visibleFields.confirmPassword)} className="absolute right-1.5 top-[1.95rem] inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-slate-400 transition hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            {visibleFields.confirmPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="min-h-[40px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-sm text-slate-300 hover:text-white rounded-xl border border-slate-700 transition font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || Boolean(successMsg)}
            className="inline-flex min-h-[40px] items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm text-white rounded-xl transition active:scale-[0.98] font-semibold disabled:cursor-not-allowed disabled:opacity-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {loading ? 'Đang xử lý...' : 'Lưu mật khẩu mới'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;


