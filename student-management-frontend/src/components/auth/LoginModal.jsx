// cSpell:disable
import React, { useState } from 'react';
import { 
  LogIn, Lock, User, AlertCircle, ShieldCheck, Eye, EyeOff, 
  Loader2, GraduationCap, AlertTriangle,
  BookOpen, Calendar, CreditCard, HelpCircle, FileText, CheckCircle2, ChevronRight
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
          className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" aria-hidden="true" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Username / Student ID */}
      <div className="space-y-1.5">
        <label htmlFor="login-username" className="block text-xs font-semibold text-slate-300">
          Mã số sinh viên / Tên đăng nhập <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            id="login-username"
            name="username"
            type="text"
            autoComplete="username"
            autoFocus={!currentUser}
            required
            disabled={loading}
            placeholder="VD: SV001 hoặc admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-slate-600 disabled:opacity-50"
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Sinh viên nhập mã SV (VD: SV001). Cán bộ & Giảng viên nhập tên tài khoản.
        </p>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300">
            Mật khẩu <span className="text-rose-400">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-[11px] text-blue-400 hover:text-blue-300 transition font-medium focus-visible:outline-none focus-visible:underline"
          >
            Quên mật khẩu?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
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
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            aria-pressed={showPassword}
            title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-slate-400 hover:text-slate-200 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg"
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        {/* CapsLock Indicator */}
        {isCapsLockOn && (
          <div className="flex items-center gap-1.5 pt-1 text-amber-400 text-xs" role="status">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Phím Caps Lock đang bật</span>
          </div>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-300">
          <input
            type="checkbox"
            checked={rememberMe}
            disabled={loading}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-xs">Ghi nhớ đăng nhập trên thiết bị này</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold transition shadow-sm disabled:opacity-50 select-none cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang xác thực thông tin...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Đăng nhập hệ thống</span>
            </>
          )}
        </button>
      </div>

      {/* Discreet Demo Quick-Fill Bar */}
      <RolePresetSelector
        activeRole={activeRole}
        onRoleSelect={handleRoleSelect}
        onQuickLogin={handleQuickLogin}
        disabled={loading}
      />
    </form>
  );

  // 🌟 CASE 1: FULL-PAGE INSTITUTIONAL ACADEMIC PORTAL (Khi người dùng chưa đăng nhập)
  if (!currentUser && isOpen && !showForgot) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#0a0f1d] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
        
        {/* Top Institutional Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-600/30">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Trường Đại Học Công Nghệ & Đào Tạo
                </div>
                <div className="text-xs font-semibold text-white">
                  Cổng Thông Tin Đào Tạo & Quản Lý Học Vụ (SIS)
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Năm học: 2026 - 2027</span>
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px] font-medium">
                Học kỳ 1
              </span>
            </div>
          </div>
        </header>

        {/* Main Content: 2-Column Split Institutional Layout */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
            
            {/* Left Column (7 cols): Academic Notice Board & Institutional Info */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge & Headline */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Cổng Đăng Nhập Tập Trung (Central Authentication Service)</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Hệ Thống Quản Trị Đào Tạo & Thông Tin Học Vụ
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  Nền tảng số quản lý học chế tín chỉ, đăng ký môn học trực tuyến, theo dõi tiến độ đào tạo, biểu học phí và kết quả học tập dành cho sinh viên, giảng viên và các khoa đào tạo.
                </p>
              </div>

              {/* Academic Notices (Bảng tin thông báo số) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <FileText className="w-4 h-4" />
                    <span>Thông Báo Học Vụ Mới Nhất</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Học kỳ 1 • 2026 - 2027</span>
                </div>

                {/* Notice 1: Course Registration */}
                <article className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Đang diễn ra
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">20/08 - 05/09/2026</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-200">
                    Kế hoạch Đăng ký Học phần & Lớp Tín chỉ Học kỳ 1 (2026 - 2027)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Hệ thống mở cổng đăng ký tín chỉ tự động. Sinh viên kiểm tra điều kiện tiên quyết và lịch biểu trước khi bấm xác nhận đăng ký học phần.
                  </p>
                </article>

                {/* Notice 2: Tuition & VietQR */}
                <article className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      <CreditCard className="w-3 h-3" />
                      Thanh toán số
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Tự động 24/7</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-200">
                    Hướng dẫn Nộp Học phí Trực tuyến qua Cổng VietQR / PayOS
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Hóa đơn học phí được xuất tự động theo số tín chỉ đăng ký. Sinh viên quét mã QR trên phiếu thu để hệ thống tự động gạch nợ tức thời qua đối soát ngân hàng.
                  </p>
                </article>

                {/* Notice 3: Circular 08 Regulations */}
                <article className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <BookOpen className="w-3 h-3" />
                      Quy chế Đào tạo
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Thông tư 08/BGDĐT</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-200">
                    Quy chuẩn Thang điểm chữ, Điểm hệ 4 và Điều kiện Cảnh báo Học vụ
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tính toán điểm học phần (A, B, C, D, F) và tự động gắn cờ cảnh báo đối với sinh viên có điểm GPA tích lũy dưới 2.0 theo quy chế hiện hành.
                  </p>
                </article>
              </div>

              {/* Help & Support Line */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>Hỗ trợ kỹ thuật: <strong>(024) 3754 7506</strong></span>
                </span>
                <span className="text-slate-700 hidden sm:inline">•</span>
                <span>Email: daotao@eduportal.edu.vn</span>
              </div>

            </div>

            {/* Right Column (5 cols): Clean Professional Login Box */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/40">
                
                {/* Form Header */}
                <div className="mb-5 space-y-1 text-left pb-4 border-b border-slate-800/80">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Đăng Nhập Tài Khoản
                  </h2>
                  <p className="text-xs text-slate-400">
                    Sử dụng tài khoản nội bộ do Nhà trường cấp để đăng nhập
                  </p>
                </div>

                {renderLoginForm()}

                {/* Security Note Footer */}
                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Xác thực an toàn qua giao thức mã hóa HTTPS & Stateless JWT</span>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* Institutional Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/90 py-3 px-6 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 Trường Đại học Công nghệ & Đào tạo. Bản quyền thuộc về Phòng Đào tạo & Quản lý Học sinh - Sinh viên.</span>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-slate-300 transition">Quy chế đào tạo</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300 transition">Chính sách bảo mật</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300 transition">Liên hệ hỗ trợ</a>
            </div>
          </div>
        </footer>

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
        subtitle="Cổng Thông Tin Đào Tạo & Quản Lý Học Vụ"
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
