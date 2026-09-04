
import React, { useEffect } from 'react';
import { 
  X, ShoppingCart, AlertTriangle, CheckCircle2, 
  Trash2, BookOpen, Clock, MapPin, User, ArrowRight, ShieldAlert, RefreshCw 
} from 'lucide-react';

export default function RegistrationCartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onRemoveFromCart,
  onClearCart,
  validationResult,
  isValidating,
  isSubmitting,
  onSubmitRegistration
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalCredits = cartItems.reduce((acc, item) => acc + (item.credits || 0), 0);
  const estimatedTuition = cartItems.reduce((acc, item) => {
    const price = item.unitPrice || item.tuitionPerCredit || item.pricePerCredit || 450000;
    return acc + price * (item.credits || 0);
  }, 0);

  const hasErrors = validationResult?.violations?.some(v => v.severity === 'ERROR');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Giỏ đăng ký học phần">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Giỏ Đăng Ký Học Phần</h2>
                <p className="text-sm text-blue-200">
                  {cartItems.length} lớp học phần đã chọn ({totalCredits} tín chỉ)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Validation Progress Indicator */}
            {isValidating && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" />
                <span>Đang kiểm tra xung đột lịch và điều kiện tiên quyết...</span>
              </div>
            )}

            {/* Validation Banner (Hiển thị toàn bộ vi phạm tích lũy) */}
            {validationResult?.violations?.length > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span>Phát hiện {validationResult.violations.length} xung đột / vi phạm điều kiện:</span>
                </div>
                <ul className="space-y-1.5 pl-7 text-xs text-rose-600 list-disc">
                  {validationResult.violations.map((v, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <strong>[{v.code || 'LỖI'}]</strong> {v.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult?.valid && cartItems.length > 0 && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-700 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Giỏ học phần hợp lệ 100%! Đạt điều kiện tiên quyết, không trùng lịch.</span>
              </div>
            )}

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <ShoppingCart className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                <p className="text-base font-medium text-slate-600">Giỏ đăng ký hiện đang trống</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Hãy duyệt danh sách học phần bên trái và nhấn "+ Chọn lớp" để thêm vào giỏ.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  <span>Danh sách môn chọn ({cartItems.length})</span>
                  <button 
                    onClick={onClearCart}
                    className="text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.creditClassId || item.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-xs rounded mb-1">
                          {item.subjectId || item.classCode}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {item.subjectName || item.creditClassName}
                        </h4>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(item.creditClassId || item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Bỏ khỏi giỏ"
                        aria-label={`Bỏ môn ${item.subjectName || item.creditClassName || ''} khỏi giỏ`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.credits || 3} Tín chỉ</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{item.teacherName || 'Chưa phân công'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.roomName || 'Chưa xếp phòng'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                        <span>{((item.unitPrice || item.tuitionPerCredit || item.pricePerCredit || 450000) * (item.credits || 3)).toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary & Action */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Tổng số tín chỉ chọn:</span>
                  <span className="font-bold text-slate-800">{totalCredits} tín chỉ</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ước tính học phí đợt này:</span>
                  <span className="font-bold text-blue-700 text-base">
                    {estimatedTuition.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

              <button
                disabled={cartItems.length === 0 || hasErrors || isSubmitting}
                onClick={onSubmitRegistration}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                  hasErrors
                    ? 'bg-slate-400 cursor-not-allowed'
                    : isSubmitting
                    ? 'bg-blue-600 cursor-wait opacity-80'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/25 active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xử lý giao dịch nguyên tử...</span>
                  </>
                ) : (
                  <>
                    <span>Xác Nhận Đăng Ký Lô Học Phần</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
