import React, { useState } from 'react';
import { userApi } from '../../api';

import { Lock, X } from 'lucide-react';

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
      setSuccessMsg('Đổi mật khẩu thành công');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => { setSuccessMsg(''); onClose(); }, 1500);
    } catch (error) {
      setErrorMsg(error.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700/50 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Đổi Mật Khẩu</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && <div className="p-3 text-xs bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg">{errorMsg}</div>}
          {successMsg && <div className="p-3 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg">{successMsg}</div>}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang lưu...' : 'Lưu mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;


