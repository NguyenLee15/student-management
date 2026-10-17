// cSpell:disable
import React, { useState } from 'react';
import { 
  LogIn, Lock, User, AlertCircle, ShieldCheck, Eye, EyeOff, 
  Loader2, GraduationCap, AlertTriangle,
  Award, BookOpen, CreditCard, Sparkles, HelpCircle, CornerDownLeft
} from 'lucide-react';
import Modal from '../common/Modal';
import ForgotPasswordModal from './ForgotPasswordModal';
import RolePresetSelector, { ROLE_PRESETS } from './RolePresetSelector';
import { authApi } from '../../api';
import { setMemoryToken } from '../../api/axiosClient';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentUser }) {
  const [activeRole, setActiveRole] = useState('student');
  const [username, setUsername] = useState(ROLE_PRESETS.student.demoUser);
  const [password, setPassword] = useState(ROLE_PRESETS.student.demoPass);
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

  const handleRoleSelect = (roleKey) => {
    setActiveRole(roleKey);
    const preset = ROLE_PRESETS[roleKey];
    if (preset) {
      setUsername(preset.demoUser);
      setPassword(preset.demoPass);
      setError('');
    }
  };

  const performLogin = async (loginUser, loginPass) => {
    if (!loginUser.trim() || !loginPass) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ userName: loginUser.trim(), password: loginPass });
      const payload = res.data || res;

      if (payload && payload.token) {
        setMemoryToken(payload.token);
        const userInfo = {
          username: payload.userName || loginUser.trim(),
          role: payload.role,
          studentId: payload.studentId,
          facultyId: payload.facultyId,
        };
        if (rememberMe) {
          localStorage.setItem('user_info', JSON.stringify(userInfo));
          sessionStorage.removeItem('user_info');
        } else {
          sessionStorage.setItem('user_info', JSON.stringify(userInfo));
          localStorage.removeItem('user_info');
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

  const handleLogin = (e) => {
    e.preventDefault();
    performLogin(username, password);
  };

  const handleQuickLogin = (roleKey) => {
    const preset = ROLE_PRESETS[roleKey];
    if (preset) {
      setActiveRole(roleKey);
      setUsername(preset.demoUser);
      setPassword(preset.demoPass);
      performLogin(preset.demoUser, preset.demoPass);
    }
  };

  // Render form contents (dùng chung cho cả Full-Page và Popup Modal)
  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4 text-sm">
      {error && (
        <div
          className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-shake"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" aria-hidden="true" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Role Selection Tabs Component with 1-Click Login Trigger */}
      <RolePresetSelector
        activeRole={activeRole}
        onRoleSelect={handleRoleSelect}
        onQuickLogin={handleQuickLogin}
        disabled={loading}
      />

      {/* Username / Student ID */}
      <div className="space-y-1.5">
        <label htmlFor="login-username" className="block text-xs font-semibold text-slate-300">
          {activeRole === 'student' ? 'Mã Sinh Viên / Tên Đăng Nhập *' : 'Tên Đăng Nhập *'}
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" aria-hidden="true" />
          <input
            id="login-username"
            name="username"
            type="text"
            autoComplete="username"
            autoFocus={!currentUser}
            required
            disabled={loading}
            placeholder={ROLE_PRESETS[activeRole]?.placeholder || 'Nhập tên đăng nhập'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800/90 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition placeholder:text-slate-600 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300">
            Mật khẩu *
          </label>
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 transition font-medium focus-visible:outline-none focus-visible:underline"
          >
            Quên mật khẩu?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" aria-hidden="true" />
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            disabled={loading}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyUp}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800/90 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition font-mono disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            aria-pressed={showPassword}
            title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-slate-500 hover:text-slate-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        {/* CapsLock Indicator */}
        {isCapsLockOn && (
          <div className="flex items-center gap-1.5 pt-1 text-amber-400 text-xs animate-pulse" role="status">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Phím Caps Lock đang được bật</span>
          </div>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200">
          <input
            type="checkbox"
            checked={rememberMe}
            disabled={loading}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-xs">Ghi nhớ đăng nhập</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end gap-2.5">
        {currentUser && (
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition"
          >
            Đóng
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] disabled:opacity-50 select-none ${
            currentUser ? 'px-6' : 'w-full'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang xác thực thông tin...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Đăng Nhập Ngay</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-indigo-200 opacity-60 hidden sm:inline" />
            </>
          )}
        </button>
      </div>

      {/* Quick Tips */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-3 text-[11px] text-slate-400 text-center">
        <span>💡 Nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">Enter</kbd> để đăng nhập</span>
        <span>•</span>
        <span>Dùng <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">Tab</kbd> chuyển ô</span>
      </div>
    </form>
  );

  // 🌟 CASE 1: FULL-PAGE MODERN EDTECH PORTAL (Khi người dùng chưa đăng nhập)
  if (!currentUser && isOpen && !showForgot) {
    return (
      <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-x-hidden overflow-y-auto selection:bg-indigo-500 selection:text-white">
        
        {/* Ambient Gradient Glows in Background */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />

        {/* Subtle Background Grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" 
          aria-hidden="true"
        />

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
          
          {/* Left Column: Academic Brand & Value Props */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 text-left">
            
            {/* Version & Environment Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>EduPortal Higher Education Platform • v3.5 LTS</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Cổng Thông Tin Đào Tạo & <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                  Quản Trị Học Vụ Số
                </span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                Hệ sinh thái đại học số quản trị đào tạo theo học chế tín chỉ thông minh, tối ưu hóa quy trình đăng ký môn học, tự động hóa tính điểm quy chế và hỗ trợ thanh toán học phí trực tuyến.
              </p>
            </div>

            {/* 3 Core Academic Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2 backdrop-blur-md hover:border-indigo-500/40 transition-colors group">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs group-hover:text-indigo-300">
                  <BookOpen className="w-4 h-4" />
                  <span>Học Chế Tín Chỉ</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Đăng ký học phần theo thời gian thực, tự động phát hiện trùng lịch học và sức chứa phòng.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2 backdrop-blur-md hover:border-emerald-500/40 transition-colors group">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs group-hover:text-emerald-300">
                  <Award className="w-4 h-4" />
                  <span>Chuẩn Quy Chế</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Tính toán điểm chữ, điểm hệ 4 và GPA chuẩn Thông tư 08/2021/TT-BGDĐT.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2 backdrop-blur-md hover:border-sky-500/40 transition-colors group">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs group-hover:text-sky-300">
                  <CreditCard className="w-4 h-4" />
                  <span>Học Phí VietQR</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Xuất hóa đơn học phí tự động, thanh toán quét mã QR qua cổng PayOS với webhook đối soát.
                </p>
              </div>
            </div>

            {/* Security & Support Ribbon */}
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bảo mật Stateless JWT • Phân quyền RBAC 3 cấp độ</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 hover:text-slate-200 transition">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  Hotline: 1900 6868
                </span>
                <span>•</span>
                <span>support@eduportal.edu.vn</span>
              </div>
            </div>

          </div>

          {/* Right Column: Modern Glassmorphism Login Card */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-indigo-950/60 relative">
              
              {/* Header inside Card */}
              <div className="mb-5 space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Xác thực hệ thống</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                    Sẵn sàng kết nối
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Đăng Nhập Cổng Đào Tạo</h2>
                <p className="text-xs text-slate-400">Chọn vai trò để tự động điền tài khoản mẫu hoặc nhập tài khoản của bạn</p>
              </div>

              {renderLoginForm()}
            </div>
          </div>

        </div>

      </div>
    );
  }

  // 🌟 CASE 2: POPUP MODAL (Khi người dùng đã đăng nhập và bấm mở lại LoginModal từ Header)
  return (
    <>
      <Modal
        isOpen={isOpen && !showForgot}
        onClose={currentUser ? onClose : () => {}}
        title="Đăng Nhập Hệ Thống"
        subtitle="Cổng Thông Tin Đào Tạo & Quản Lý EduPortal"
        maxWidth="max-w-md"
      >
        {renderLoginForm()}
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
