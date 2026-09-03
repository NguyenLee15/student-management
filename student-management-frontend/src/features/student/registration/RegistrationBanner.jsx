// cSpell:disable
import React from 'react';
import { Calendar, Clock, BookOpen, ShoppingCart, AlertCircle } from 'lucide-react';
import { msg } from '../../../lib/messages';

export default function RegistrationBanner({ activePeriod, cartCount = 0, onOpenCart }) {
  return (
    <div className={`bg-gradient-to-r ${activePeriod ? 'from-blue-700 via-indigo-700 to-purple-800' : 'from-slate-800 via-slate-900 to-indigo-950'} rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {activePeriod ? (
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Đợt Đăng Ký Đang Mở
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Chưa Có Đợt Đăng Ký
            </span>
          )}
          <span className="text-blue-200 text-xs">
            {activePeriod ? (activePeriod.semesterName ? `${activePeriod.semesterName} • ${activePeriod.academicYearName || ''}` : (activePeriod.semester ? (msg.enum.semester[activePeriod.semester] || activePeriod.semester) : 'Học kỳ chính khóa')) : 'Học kỳ hiện tại'}
          </span>
        </div>
        <h1 className="text-2xl font-black">
          {activePeriod?.name || 'Hiện Tại Chưa Mở Đợt Đăng Ký Học Phần Mới'}
        </h1>
        {activePeriod ? (
          <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-300" />
              Bắt đầu: {activePeriod?.startTime ? new Date(activePeriod.startTime).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-300" />
              Hạn chót: {activePeriod?.endTime ? new Date(activePeriod.endTime).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
            </span>
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              <BookOpen className="w-4 h-4" />
              Tối đa: {activePeriod?.maxCreditsAllowed || 24} tín chỉ / kỳ
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-300">
            Phòng Đào Tạo sẽ thông báo khi mở đợt đăng ký tín chỉ mới. Sinh viên vẫn có thể tra cứu các môn học đã đăng ký thành công ở tab bên dưới.
          </p>
        )}
      </div>

      {/* Quick Cart Trigger Floating Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCart}
          className="relative px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2.5 active:scale-95"
        >
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          <span>Giỏ Môn Học</span>
          {cartCount > 0 && (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-xs font-black rounded-full animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

