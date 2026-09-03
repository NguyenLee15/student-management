// cSpell:disable
import React from 'react';

export default function TranscriptSummaryFooter({ transcript, overview }) {
  const totalCredits = transcript?.totalCreditsEarned ?? overview?.totalAccumulatedCredits ?? 0;
  const gpa10 = transcript?.cumulativeGpa10 ?? overview?.cumulativeGpa10 ?? '0.00';
  const gpa4 = transcript?.cumulativeGpa4 ?? overview?.cumulativeGpa4 ?? '0.00';
  const academicStanding = transcript?.academicStanding || overview?.academicStanding || 'Chưa xét';

  return (
    <>
      {/* GPA Summary Box */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-900 text-white rounded-xl text-center">
        <div>
          <div className="text-[11px] text-slate-400 uppercase font-bold">Tổng Tín Chỉ Tích Lũy</div>
          <div className="text-xl font-black text-white">{totalCredits} TC</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 uppercase font-bold">Điểm GPA Hệ 10</div>
          <div className="text-xl font-black text-emerald-400">{gpa10}</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 uppercase font-bold">Điểm GPA Hệ 4</div>
          <div className="text-xl font-black text-blue-400">{gpa4}</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 uppercase font-bold">Xếp Loại Học Lực</div>
          <div className="text-xl font-black text-amber-400">{academicStanding}</div>
        </div>
      </div>

      {/* Signatures for Print */}
      <div className="hidden print:grid grid-cols-2 pt-12 text-center text-xs">
        <div>
          <div className="font-bold uppercase">Người Lập Bảng</div>
          <div className="italic text-slate-400">(Ký và ghi rõ họ tên)</div>
        </div>
        <div>
          <div className="font-bold uppercase">Phòng Đào Tạo & Quản Lý Sinh Viên</div>
          <div className="italic text-slate-400">(Ký tên và đóng dấu)</div>
        </div>
      </div>
    </>
  );
}
