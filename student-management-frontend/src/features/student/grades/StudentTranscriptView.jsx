// cSpell:disable
import React, { useState, useEffect } from 'react';
import { msg } from '../../../lib/messages';
import { gradeApi, studentPortalApi } from '../../../api';
import TranscriptActionHeader from './TranscriptActionHeader';
import TranscriptSummaryFooter from './TranscriptSummaryFooter';
import StudentTranscriptTable from './StudentTranscriptTable';

export default function StudentTranscriptView({ currentUser, onNotify }) {
  const [transcript, setTranscript] = useState(null);
  const [grades, setGrades] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTranscriptData();
  }, []);

  const loadTranscriptData = async () => {
    setLoading(true);
    try {
      try {
        const overRes = await studentPortalApi.getMyOverview();
        setOverview(overRes?.data);
      } catch (e) {
        console.warn('Không thể tải overview', e);
      }

      let transcriptData = null;
      try {
        const transcriptRes = await studentPortalApi.getMyTranscript();
        transcriptData = transcriptRes?.data;
      } catch (err) {
        console.warn('Endpoint cá nhân gặp sự cố, thử fallback theo mã SV', err);
        let targetStudentId = currentUser?.studentId;
        if (!targetStudentId) {
          try {
            const stored = localStorage.getItem('user_info') || sessionStorage.getItem('user_info');
            if (stored) {
              const parsed = JSON.parse(stored);
              targetStudentId = parsed.studentId || (parsed.username?.startsWith('SV') ? parsed.username : null);
            }
          } catch (e) {}
        }

        if (targetStudentId) {
          const fallbackRes = await gradeApi.getTranscript(targetStudentId);
          transcriptData = fallbackRes?.data;
        }
      }

      setTranscript(transcriptData);

      let allGrades = [];
      if (transcriptData?.semesterTranscripts?.length > 0) {
        transcriptData.semesterTranscripts.forEach((st) => {
          if (st.grades) {
            allGrades.push(...st.grades.map(g => ({ ...g, semester: st.semester, academicYear: st.academicYear })));
          }
        });
      }
      setGrades(allGrades);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu bảng điểm', err);
      onNotify?.('error', 'Không thể tải bảng điểm học tập');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!grades || grades.length === 0) {
      onNotify?.('warning', 'Chưa có dữ liệu bảng điểm để xuất file.');
      return;
    }

    const headers = [
      'STT',
      'Mã Học Phần',
      'Tên Môn Học',
      'Số Tín Chỉ',
      'Điểm Hệ 10',
      'Điểm Hệ 4',
      'Điểm Chữ',
      'Kết Quả',
      'Học Kỳ',
      'Năm Học'
    ];

    const rows = grades.map((g, idx) => {
      const score10 = g.scoreScale10 != null ? Number(g.scoreScale10).toFixed(1) : '';
      const score4 = g.scoreScale4 != null ? Number(g.scoreScale4).toFixed(2) : '';
      const letter = g.letterGrade || '';
      const result = letter === 'F' ? 'Học lại' : 'Đạt';
      const sem = g.semester ? (msg.enum.semester[g.semester] || `Học kỳ ${g.semester}`) : '';
      const year = g.academicYear || '';

      return [
        idx + 1,
        `"${g.subjectId || ''}"`,
        `"${(g.subjectName || '').replace(/"/g, '""')}"`,
        g.credits || 3,
        score10,
        score4,
        letter,
        result,
        `"${sem}"`,
        `"${year}"`
      ].join(',');
    });

    const metaBlock = [
      `"TRƯỜNG ĐẠI HỌC CÔNG NGHỆ & ĐÀO TẠO"`,
      `"BẢNG ĐIỂM TỔNG HỢP KẾT QUẢ HỌC TẬP"`,
      `"Họ và tên sinh viên: ${(overview?.fullName || currentUser?.fullName || 'Sinh viên').replace(/"/g, '""')}"`,
      `"Mã sinh viên: ${overview?.studentId || currentUser?.studentId || 'SV'}"`,
      `"Lớp danh nghĩa: ${overview?.className || 'Chưa xếp lớp'} | Khoa: ${overview?.facultyName || 'Công nghệ thông tin'}"`,
      `"Tổng tín chỉ tích lũy: ${transcript?.totalCreditsEarned ?? overview?.totalAccumulatedCredits ?? 0} TC | GPA Hệ 10: ${transcript?.cumulativeGpa10 ?? overview?.cumulativeGpa10 ?? '0.00'} | GPA Hệ 4: ${transcript?.cumulativeGpa4 ?? overview?.cumulativeGpa4 ?? '0.00'}"`,
      `"Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}"`,
      ''
    ];

    const csvContent = '\uFEFF' + [...metaBlock, headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const stId = overview?.studentId || currentUser?.studentId || 'BangDiem';
    link.download = `BangDiem_${stId}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify?.('success', 'Đã xuất bảng điểm kết quả học tập (CSV) thành công!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Header */}
      <TranscriptActionHeader
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
      />

      {/* Official A4 Sheet */}
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-lg max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 space-y-6">
        {/* Printable Official Header */}
        <div className="border-b-2 border-slate-900 pb-6 text-center space-y-1">
          <div className="text-xs uppercase font-bold tracking-widest text-slate-500">
            BỘ GIÁO DỤC VÀ ĐÀO TẠO
          </div>
          <div className="text-lg font-black uppercase text-slate-900 tracking-wider">
            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ & ĐÀO TẠO
          </div>
          <div className="text-xs italic text-slate-500">
            Hà Nội, Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
          </div>
          <h2 className="text-xl font-black uppercase text-blue-900 pt-4">
            BẢNG ĐIỂM TỔNG HỢP TOÀN KHÓA
          </h2>
        </div>

        {/* Sinh Viên Profile Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block">Họ và tên:</span>
            <strong className="text-slate-800 text-sm">{overview?.fullName || 'Sinh viên'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Mã sinh viên:</span>
            <strong className="text-slate-800 text-sm font-mono">{overview?.studentId || 'Chưa có'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Lớp danh nghĩa:</span>
            <strong className="text-slate-800">{overview?.className || 'Chưa xếp lớp'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Khoa / Ngành:</span>
            <strong className="text-slate-800">{overview?.facultyName || 'Chưa phân khoa'}</strong>
          </div>
        </div>

        {/* Grades Table Component */}
        <StudentTranscriptTable
          grades={grades}
          loading={loading}
        />

        {/* GPA Summary & Official Signatures */}
        <TranscriptSummaryFooter
          transcript={transcript}
          overview={overview}
        />
      </div>
    </div>
  );
}
