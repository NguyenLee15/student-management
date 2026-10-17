// cSpell:disable
import React from 'react';
import { BookOpen, Calendar, Award, CreditCard, ArrowRight, AlertCircle } from 'lucide-react';

export default function StudentQuickActions({ onNavigateTab }) {
  const actions = [
    {
      id: 'registration',
      title: 'Đăng ký học phần',
      desc: 'Mở đợt đăng ký tín chỉ',
      icon: BookOpen,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'timetable',
      title: 'Thời khóa biểu tuần',
      desc: 'Lịch học & phòng học',
      icon: Calendar,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'grades',
      title: 'Bảng điểm & In A4',
      desc: 'Tra cứu GPA & kết quả học tập',
      icon: Award,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'tuition',
      title: 'Học phí & Hóa đơn',
      desc: 'Biên lai & công nợ kỳ này',
      icon: CreditCard,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5 flex flex-col justify-between">
      <div>
        <div className="pb-3 border-b border-slate-100 mb-3">
          <h3 className="font-extrabold text-slate-900 text-sm">Lối Tắt Học Vụ</h3>
          <p className="text-[11px] text-slate-400">Các tiện ích thường dùng của sinh viên</p>
        </div>

        <div className="space-y-2">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => onNavigateTab?.(act.id)}
                className="w-full p-2.5 sm:p-3 bg-slate-50/70 hover:bg-blue-50/40 text-slate-800 rounded-xl text-left flex items-center justify-between border border-slate-200/80 hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${act.iconBg} transition-transform group-hover:scale-105`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 group-hover:text-blue-700 transition-colors">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {act.desc}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
        <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
          <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Hỗ trợ kỹ thuật & Đào tạo</span>
        </p>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Email: <span className="text-slate-700 font-medium">daotao@university.edu.vn</span> • Hotline: <span className="text-slate-700 font-medium">1900 6868</span>
        </p>
      </div>
    </div>
  );
}

