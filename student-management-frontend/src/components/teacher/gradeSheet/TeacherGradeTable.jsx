// cSpell:disable
import React from 'react';
import { calculateFinalScore } from '../../../utils/gradeCalculations';
import Skeleton from '../../common/Skeleton';
import TeacherGradeRow from './TeacherGradeRow';

export default function TeacherGradeTable({
  students = [],
  filteredStudents = [],
  gradeSheet = {},
  currentWeights = { att: 0.1, mid: 0.3, fin: 0.6 },
  studentSearch = '',
  loading = false,
  handleGradeChange,
  handleGradeBlur,
  handleGradeKeyDown,
  handleSaveSingleGrade,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
          <tr>
            <th className="px-5 py-3">Mã SV</th>
            <th className="px-5 py-3">Họ và Tên</th>
            <th className="px-5 py-3 text-center">Chuyên cần ({Math.round(currentWeights.att * 100)}%)</th>
            <th className="px-5 py-3 text-center">Giữa kỳ ({Math.round(currentWeights.mid * 100)}%)</th>
            <th className="px-5 py-3 text-center">Thi cuối kỳ ({Math.round(currentWeights.fin * 100)}%)</th>
            <th className="px-5 py-3 text-center font-bold">Tổng kết</th>
            <th className="px-5 py-3 text-center font-bold">Điểm chữ</th>
            <th className="px-5 py-3 text-center">Trạng thái</th>
            <th className="px-5 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="border-b border-slate-800/40">
                <td className="px-5 py-3"><Skeleton className="h-4 w-16" /></td>
                <td className="px-5 py-3"><Skeleton className="h-4 w-32" /></td>
                <td className="px-5 py-3 text-center"><Skeleton className="h-6 w-14 mx-auto" /></td>
                <td className="px-5 py-3 text-center"><Skeleton className="h-6 w-14 mx-auto" /></td>
                <td className="px-5 py-3 text-center"><Skeleton className="h-6 w-14 mx-auto" /></td>
                <td className="px-5 py-3 text-center"><Skeleton className="h-4 w-10 mx-auto" /></td>
                <td className="px-5 py-3 text-center"><Skeleton className="h-5 w-8 mx-auto rounded" /></td>
                <td className="px-5 py-3 text-center"><Skeleton className="h-5 w-14 mx-auto rounded" /></td>
                <td className="px-5 py-3 text-center"><Skeleton className="h-6 w-12 mx-auto rounded" /></td>
              </tr>
            ))
          ) : filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="9" className="px-5 py-6 text-center text-xs text-slate-500 italic">
                Không tìm thấy sinh viên nào phù hợp với từ khóa "{studentSearch}"
              </td>
            </tr>
          ) : (
            filteredStudents.map((st, idx) => {
              const entry = gradeSheet[st.studentId] || {};
              const calc = calculateFinalScore(entry, currentWeights);

              return (
                <TeacherGradeRow
                  key={st.studentId}
                  st={st}
                  idx={idx}
                  entry={entry}
                  calc={calc}
                  handleGradeChange={handleGradeChange}
                  handleGradeBlur={handleGradeBlur}
                  handleGradeKeyDown={handleGradeKeyDown}
                  handleSaveSingleGrade={handleSaveSingleGrade}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

