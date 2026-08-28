import React, { useState } from 'react';
import { LogIn, Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';
import Modal from '../common/Modal';
import ForgotPasswordModal from './ForgotPasswordModal';
import { authApi } from '../../api';

import { setMemoryToken } from '../../api/axiosClient';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ userName: username, password });
      const payload = res.data || res;

      if (payload && payload.token) {
        setMemoryToken(payload.token);
        const userInfo = {
          username: payload.userName || username,
          role: payload.role,
          studentId: payload.studentId,
        };
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        onLoginSuccess(userInfo);
        onClose();
      } else {
        setError('Phản hồi từ máy chủ không hợp lệ.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đăng nhập Hệ thống Đào tạo" subtitle="Cổng thông tin sinh viên & Giảng viên EduPortal" maxWidth="max-w-md">
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tên đăng nhập / Mã SV</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              required
              placeholder="Nhập mã sinh viên hoặc tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/50">
          <p className="text-[11px] text-slate-400 mb-3 text-center">Dành cho Nhà tuyển dụng / HR Demo</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setUsername('admin'); setPassword('admin123'); }}
              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:text-indigo-300 text-slate-300 text-[10px] font-medium transition"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => { setUsername('teacher'); setPassword('teacher123'); }}
              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:text-indigo-300 text-slate-300 text-[10px] font-medium transition"
            >
              Demo Giảng viên
            </button>
            <button
              type="button"
              onClick={() => { setUsername('student'); setPassword('student123'); }}
              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:text-indigo-300 text-slate-300 text-[10px] font-medium transition"
            >
              Demo Sinh viên
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}


