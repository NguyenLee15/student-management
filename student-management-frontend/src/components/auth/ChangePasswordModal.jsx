import React, { useState } from 'react';
import { userApi } from '../../api';
import { Lock } from 'lucide-react';
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
      setTimeout(() => { setSuccessMsg(''); onClose(); }, 1500);
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
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 text-xs bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl font-semibold">
            {successMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Mật khẩu hiện tại *
          </label>
          <input
            type="password"
            required
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Mật khẩu mới (tối thiểu 8 ký tự) *
          </label>
          <input
            type="password"
            required
            minLength={8}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Xác nhận mật khẩu mới *
          </label>
          <input
            type="password"
            required
            minLength={8}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition font-semibold"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition active:scale-95 font-semibold disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Đang xử lý...' : 'Lưu mật khẩu mới'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;


