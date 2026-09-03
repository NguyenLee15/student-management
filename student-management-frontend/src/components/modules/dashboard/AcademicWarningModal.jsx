// cSpell:disable
import React from 'react';
import { AlertTriangle, AlertOctagon, ArrowUpRight } from 'lucide-react';
import Modal from '../../common/Modal';

export default function AcademicWarningModal({
  isOpen,
  onClose,
  warningCount = 0,
  onNavigate,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Danh sách sinh viên bị Cảnh báo Học vụ (GPA < 2.0)"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-rose-400 mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Quy chế đào tạo theo tín chỉ (Thông tư 08/2021/TT-BGDĐT):</span>
          </div>
          Sinh viên có điểm trung bình chung tích lũy (GPA) dưới 2.0 (thang 4) qua 2 học kỳ liên tiếp sẽ bị xếp vào diện Cảnh báo học vụ mức 1 hoặc buộc thôi học nếu quá 3 lần cảnh báo liên tiếp.
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Số lượng sinh viên diện nguy cơ:</span>
            <span className="font-bold text-rose-400 text-sm">{warningCount} Sinh viên</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Hệ thống khuyến nghị Cố vấn học tập và Phòng Đào tạo sớm gửi thông báo học vụ để sinh viên có lộ trình đăng ký học lại hoặc cải thiện điểm kịp thời.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('students');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-md transition active:scale-95"
          >
            <span>Xem danh sách sinh viên</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
}

