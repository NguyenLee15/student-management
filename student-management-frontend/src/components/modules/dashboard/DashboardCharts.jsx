// cSpell:disable
import React from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { Inbox } from 'lucide-react';

const FACULTY_PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8', '#8b5cf6'];

export default function DashboardCharts({
  barData = [],
  pieData = [],
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* GPA Rank Distribution Bar Chart */}
      <div className="lg:col-span-2 panel-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Phân Bố Kết Quả Học Tập & Xếp Loại Học Lực</h3>
            <p className="text-xs text-slate-400">Thống kê số lượng sinh viên theo từng phân khúc GPA</p>
          </div>
          <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            Chất lượng đào tạo
          </span>
        </div>

        <div className="h-56 w-full flex items-center justify-center">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="rank" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Số lượng sinh viên" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Inbox className="h-8 w-8 text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-400">Chưa có dữ liệu xếp loại học lực toàn trường</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Dữ liệu sẽ được cập nhật tự động khi có điểm học phần</p>
            </div>
          )}
        </div>
      </div>

      {/* Faculty Breakdown Pie Chart */}
      <div className="panel-card p-5 space-y-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Cơ Cấu Sinh Viên Theo Khoa</h3>
          <p className="text-xs text-slate-400">Tỉ lệ phân bổ chuyên ngành</p>
        </div>

        <div className="h-44 w-full flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FACULTY_PIE_COLORS[index % FACULTY_PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-slate-500">
              <Inbox className="h-8 w-8 text-slate-600 mb-1.5" />
              <p className="text-xs font-medium text-slate-400">Chưa có dữ liệu phân bố khoa</p>
            </div>
          )}
        </div>

        {/* Legend */}
        {pieData.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {pieData.slice(0, 4).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: FACULTY_PIE_COLORS[idx % FACULTY_PIE_COLORS.length] }}></span>
                  <span className="text-slate-300 font-medium truncate">{entry.name}</span>
                </div>
                <span className="text-slate-400 font-semibold">{entry.value} SV</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
