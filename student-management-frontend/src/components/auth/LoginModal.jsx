import React, { useState } from 'react';
import { 
  LogIn, Lock, User, AlertCircle, ShieldCheck, Eye, EyeOff, 
  Loader2, GraduationCap, AlertTriangle, Shield, Check,
  UserSquare2, Award, BookOpen, CalendarDays, Sparkles, ChevronRight
} from 'lucide-react';
import Modal from '../common/Modal';
import ForgotPasswordModal from './ForgotPasswordModal';
import { authApi } from '../../api';
import { setMemoryToken } from '../../api/axiosClient';

const ROLE_PRESETS = {
  student: {
    label: 'Sinh Viên',
    icon: GraduationCap,
    placeholder: 'Mã sinh viên (VD: SV001 hoặc student)',
    demoUser: 'student',
    demoPass: 'student123',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  },
  teacher: {
    label: 'Giảng Viên',
    icon: UserSquare2,
    placeholder: 'Mã giảng viên hoặc tên đăng nhập (VD: teacher)',
    demoUser: 'teacher',
    demoPass: 'teacher123',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
  },
  admin: {
    label: 'Quản Trị Viên',
    icon: ShieldCheck,
    placeholder: 'Tài khoản quản trị viên (VD: admin)',
    demoUser: 'admin',
    demoPass: 'admin123',
    badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
  },
};

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentUser }) {
  const [activeRole, setActiveRole] = useState('student');
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

  const handleRoleSelect = (roleKey) => {
    setActiveRole(roleKey);
    const preset = ROLE_PRESETS[roleKey];
    if (preset) {
      setUsername(preset.demoUser);
      setPassword(preset.demoPass);
      setError('');
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

  const handleQuickFill = (u, p, roleKey) => {
    setUsername(u);
    setPassword(p);
    if (roleKey) setActiveRole(roleKey);
    setError('');
  };

  // Render form contents
  const renderLoginForm = (isFullPage = false) => (
    <form onSubmit={handleLogin} className="space-y-4 text-xs">
      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-shake">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          Chọn Vai Trò Đăng Nhập
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/90 border border-slate-800 rounded-xl">
          {Object.entries(ROLE_PRESETS).map(([key, item]) => {
            const Icon = item.icon;
            const isSelected = activeRole === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleRoleSelect(key)}
                className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Username / Student ID */}
      <div>
        <label htmlFor="login-username" className="block text-xs font-semibold text-slate-300 mb-1.5">
          {activeRole === 'student' ? 'Mã Sinh Viên / Tên Đăng Nhập *' : 'Tên Đăng Nhập *'}
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            id="login-username"
            name="username"
            type="text"
            autoComplete="username"
            autoFocus={!currentUser}
            required
            placeholder={ROLE_PRESETS[activeRole]?.placeholder || 'Nhập tên đăng nhập'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Password */}
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

      {/* Submit Button */}
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
        <p className="text-[11px] text-slate-400 mb-2 text-center font-medium">
          ⚡ 1-Click Tài Khoản Trải Nghiệm (Sandbox Demo)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('student', 'student123', 'student')}
            className="flex flex-col items-center py-2 px-1 rounded-xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-300 text-[11px] font-semibold transition active:scale-95"
          >
            <span>Sinh viên</span>
            <span className="text-[9px] text-slate-500 font-mono mt-0.5">student</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('teacher', 'teacher123', 'teacher')}
            className="flex flex-col items-center py-2 px-1 rounded-xl bg-slate-950 border border-sky-500/30 hover:border-sky-500 hover:bg-sky-950/20 text-sky-300 text-[11px] font-semibold transition active:scale-95"
          >
            <span>Giảng viên</span>
            <span className="text-[9px] text-slate-500 font-mono mt-0.5">teacher</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('admin', 'admin123', 'admin')}
            className="flex flex-col items-center py-2 px-1 rounded-xl bg-slate-950 border border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-950/20 text-indigo-300 text-[11px] font-semibold transition active:scale-95"
          >
            <span>Quản trị viên</span>
            <span className="text-[9px] text-slate-500 font-mono mt-0.5">admin</span>
          </button>
        </div>
      </div>
    </form>
  );

  // 🌟 CASE 1: FULL-PAGE ACADEMIC LOGIN PORTAL (Khi người dùng chưa đăng nhập)
  if (!currentUser && isOpen && !showForgot) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Academic Brand & Value Props */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>EduPortal Higher Education Platform v3.5</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Cổng Thông Tin Đào Tạo & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                Học Vụ Đại Học Số
              </span>
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              Hệ thống quản trị đào tạo theo học chế tín chỉ thông minh, tối ưu hóa đăng ký học phần, tự động tính toán điểm chuẩn quy chế và hỗ trợ giảng dạy trực quan.
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>Học Chế Tín Chỉ</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Đăng ký học phần thông minh, chống trùng lịch học.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Award className="w-4 h-4" />
                  <span>Chuẩn Quy Chế</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Điểm hệ 4 & GPA theo Thông tư 08/2021/TT-BGDĐT.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Bảo Mật JWT RBAC</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Phân quyền 3 cấp độ chặt chẽ và an toàn tuyệt đối.
                </p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-4">
              <span>Hỗ trợ kỹ thuật: support@eduportal.edu.vn</span>
              <span>•</span>
              <span>Hotline: 1900 6868</span>
            </div>
          </div>

          {/* Right Column: Glassmorphism Login Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-indigo-950/40 relative">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Đăng Nhập Hệ Thống</h2>
                <p className="text-xs text-slate-400 mt-1">Chọn vai trò và nhập thông tin tài khoản của bạn</p>
              </div>

              {renderLoginForm(true)}
            </div>
          </div>

        </div>

        {/* 🔑 FORGOT PASSWORD MODAL */}
        <ForgotPasswordModal
          isOpen={showForgot}
          onClose={() => setShowForgot(false)}
          onBackToLogin={() => setShowForgot(false)}
        />
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
        {renderLoginForm(false)}
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