import React, { useState } from 'react';
import { 
  LogIn, Lock, User, AlertCircle, ShieldCheck, Eye, EyeOff, 
  Loader2, GraduationCap, AlertTriangle, Shield, Check
} from 'lucide-react';
import Modal from '../common/Modal';
import ForgotPasswordModal from './ForgotPasswordModal';
import { authApi } from '../../api';
import { setMemoryToken } from '../../api/axiosClient';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleKeyUp = (e) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ userName: username.trim(), password });
      const payload = res.data || res;

      if (payload && payload.token) {
        setMemoryToken(payload.token);
        const userInfo = {
          username: payload.userName || username.trim(),
          role: payload.role,
          studentId: payload.studentId,
        };
        if (rememberMe) {
          localStorage.setItem('user_info', JSON.stringify(userInfo));
        } else {
          sessionStorage.setItem('user_info', JSON.stringify(userInfo));
        }
        onLoginSuccess(userInfo);
        if (onClose) onClose();
      } else {
        setError('Phản hồi từ máy chủ không hợp lệ.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showForgot}
        onClose={currentUser ? onClose : () => {}}
        title="Đăng Nhập Hệ Thống"
        subtitle="Cổng Thông Tin Đào Tạo & Quản Lý EduPortal"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="login-username" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tên đăng nhập / Mã SV *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Nhập mã sinh viên hoặc tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300">
                Mật khẩu *
              </label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition font-medium"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyUp}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* CapsLock Indicator */}
            {isCapsLockOn && (
              <div className="flex items-center gap-1.5 mt-1.5 text-amber-400 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Phím Caps Lock đang bật</span>
              </div>
            )}
          </div>

          {/* Remember Me & Security Notice */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-[11px]">Ghi nhớ đăng nhập</span>
            </label>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <Shield className="h-3 w-3 text-indigo-400" />
              <span>JWT RBAC 256-bit</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            {currentUser && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition"
              >
                Hủy bỏ
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-50 ${
                currentUser ? 'px-5' : 'w-full'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang xác thực bảo mật...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Đăng Nhập Vào Hệ Thống</span>
                </>
              )}
            </button>
          </div>

          {/* Sandbox Demo Accounts */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 mb-2.5 text-center font-medium">
              ⚡ Tài khoản trải nghiệm nhanh (Sandbox Demo)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123')}
                className="flex flex-col items-center py-2 px-1 rounded-xl bg-slate-950 border border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-950/20 text-indigo-300 text-[11px] font-semibold transition active:scale-95"
              >
                <span>Quản trị viên</span>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5">admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('teacher', 'teacher123')}
                className="flex flex-col items-center py-2 px-1 rounded-xl bg-slate-950 border border-sky-500/30 hover:border-sky-500 hover:bg-sky-950/20 text-sky-300 text-[11px] font-semibold transition active:scale-95"
              >
                <span>Giảng viên</span>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5">teacher</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('student', 'student123')}
                className="flex flex-col items-center py-2 px-1 rounded-xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-300 text-[11px] font-semibold transition active:scale-95"
              >
                <span>Sinh viên</span>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5">student</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* 🔑 FORGOT PASSWORD MODAL */}
      <ForgotPasswordModal
        isOpen={showForgot}
        onClose={() => setShowForgot(false)}
        onBackToLogin={() => setShowForgot(false)}
      />
    </>
  );
}