import React, { useState, useEffect } from 'react';
import { Award, Printer, Download, BookOpen, CheckCircle, RefreshCw } from 'lucide-react';
import { gradeApi, studentPortalApi } from '../../../api';

export default function StudentTranscriptView() {
  const [grades, setGrades] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTranscriptData();
  }, []);

  const loadTranscriptData = async () => {
    setLoading(true);
    try {
      const [gradeRes, overRes] = await Promise.all([
        gradeApi.getAll({ unpaged: true }),
        studentPortalApi.getMyOverview(),
      ]);
      setGrades(gradeRes.data?.content || gradeRes.data || []);
      setOverview(overRes.data);
    } catch (err) {
      console.error('Failed to load transcript data', err);
    } finally {
      setLoading(false);
    }
  };

  const getLetterGrade = (score10) => {
    if (!score10) return 'F';
    const s = Number(score10);
    if (s >= 8.5) return 'A';
    if (s >= 8.0) return 'B+';
    if (s >= 7.0) return 'B';
    if (s >= 6.5) return 'C+';
    if (s >= 5.5) return 'C';
    if (s >= 5.0) return 'D+';
    if (s >= 4.0) return 'D';
    return 'F';
  };

  const getScore4 = (score10) => {
    if (!score10) return '0.0';
    return (Number(score10) * 0.4).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Award className="w-6 h-6 text-blue-600" />
            Bảng Điểm Kết Quả Học Tập
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu kết quả học tập toàn khóa và in bảng điểm chuẩn A4
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>In Bảng Điểm Chuẩn A4</span>
        </button>
      </div>

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

        {/* Student Profile Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block">Họ và tên:</span>
            <strong className="text-slate-800 text-sm">{overview?.fullName || 'Sinh viên'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Mã sinh viên:</span>
            <strong className="text-slate-800 text-sm font-mono">{overview?.studentId || 'N/A'}</strong>
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

        {/* Grades Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 uppercase font-bold text-slate-700 border-b border-slate-300">
              <tr>
                <th className="p-2.5 border-r border-slate-300 w-12 text-center">STT</th>
                <th className="p-2.5 border-r border-slate-300">Mã Học Phần</th>
                <th className="p-2.5 border-r border-slate-300">Tên Môn Học</th>
                <th className="p-2.5 border-r border-slate-300 text-center">Số TC</th>
                <th className="p-2.5 border-r border-slate-300 text-center">Điểm Hệ 10</th>
                <th className="p-2.5 border-r border-slate-300 text-center">Điểm Hệ 4</th>
                <th className="p-2.5 text-center">Điểm Chữ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-1 text-blue-600" />
                    Đang tải dữ liệu điểm...
                  </td>
                </tr>
              ) : grades.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Chưa có dữ liệu điểm học phần.
                  </td>
                </tr>
              ) : (
                grades.map((g, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2 border-r border-slate-300 text-center font-medium text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold">
                      {g.subject?.subjectId || g.subjectId || ''}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-bold text-slate-800">
                      {g.subject?.subjectName || g.subjectName || 'Học phần'}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold">
                      {g.subject?.credits || 0}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold text-blue-700">
                      {g.scoreScale10 != null ? Number(g.scoreScale10).toFixed(1) : '-'}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-semibold">
                      {getScore4(g.scoreScale10)}
                    </td>
                    <td className="p-2 text-center font-black text-slate-800">
                      {getLetterGrade(g.scoreScale10)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* GPA Summary Box */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900 text-white rounded-xl text-center">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-bold">Tổng Tín Chỉ Tích Lũy</div>
            <div className="text-xl font-black">{overview?.totalAccumulatedCredits || 0} TC</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-bold">Điểm GPA Hệ 10</div>
            <div className="text-xl font-black text-emerald-400">{overview?.cumulativeGpa10 || '0.00'}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-bold">Điểm GPA Hệ 4</div>
            <div className="text-xl font-black text-blue-400">{overview?.cumulativeGpa4 || '0.00'}</div>
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
      </div>
    </div>
  );
}
