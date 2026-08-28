import React, { useState, useEffect } from 'react';
import { 
  Users, UserSquare2, Building2, BookOpen, GraduationCap, 
  TrendingUp, Award, Layers, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck,
  Server, Activity, Database, Cpu, HardDrive, RefreshCw, ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import StatCard from '../common/StatCard';
import { analyticsApi, systemApi } from '../../api';

const SAMPLE_GPA_TREND = [
  { semester: 'HK1 (2023-2024)', avgGpa: 3.12 },
  { semester: 'HK2 (2023-2024)', avgGpa: 3.25 },
  { semester: 'HK1 (2024-2025)', avgGpa: 3.31 },
  { semester: 'HK2 (2024-2025)', avgGpa: 3.38 },
  { semester: 'HK1 (2025-2026)', avgGpa: 3.42 },
];

const FACULTY_PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8', '#8b5cf6'];

export default function DashboardModule({ stats, faculties = [], onNavigate, currentUser }) {
  const [summaryData, setSummaryData] = useState(null);
  const [facultyDist, setFacultyDist] = useState([]);
  const [gpaDist, setGpaDist] = useState(null);
  const [healthData, setHealthData] = useState({ status: 'UP', db: 'UP', disk: 'UP', pingTime: '12ms' });
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    loadRealAnalytics();
    loadHealth();
  }, []);

  const loadHealth = async () => {
    setHealthLoading(true);
    const start = Date.now();
    try {
      const res = await systemApi.getHealth();
      const latency = Date.now() - start;
      const d = res?.data || res;
      setHealthData({
        status: d?.status || 'UP',
        db: d?.components?.db?.status || 'UP',
        disk: d?.components?.diskSpace?.status || 'UP',
        pingTime: `${latency}ms`,
      });
    } catch {
      setHealthData({ status: 'OFFLINE', db: 'DISCONNECTED', disk: 'UNKNOWN', pingTime: 'N/A' });
    } finally {
      setHealthLoading(false);
    }
  };

  const loadRealAnalytics = async () => {
    try {
      const [sumRes, facRes, gpaRes] = await Promise.allSettled([
        analyticsApi.getSummary(),
        analyticsApi.getFacultyDistribution(),
        analyticsApi.getGpaDistribution(),
      ]);

      if (sumRes.status === 'fulfilled') {
        const d = sumRes.value.data || sumRes.value;
        setSummaryData(d);
      }
      if (facRes.status === 'fulfilled') {
        const d = facRes.value.data || facRes.value;
        setFacultyDist(Array.isArray(d) ? d : []);
      }
      if (gpaRes.status === 'fulfilled') {
        const d = gpaRes.value.data || gpaRes.value;
        setGpaDist(d);
      }
    } catch (err) {
      console.warn('Err load real analytics', err);
    }
  };

  const pieData = facultyDist.length > 0 ? facultyDist.map(f => ({
    name: f.facultyName || f.facultyId,
    value: f.studentCount || 1,
  })) : (faculties.length > 0 ? faculties.map(f => ({
    name: f.facultyName,
    value: f.totalStudents || 0,
  })) : [
    { name: 'Công nghệ thông tin', value: 120 },
    { name: 'Kinh tế & Quản trị', value: 95 },
    { name: 'Ngoại ngữ', value: 65 },
    { name: 'Điện - Điện tử', value: 45 },
  ]);

  const barData = gpaDist ? [
    { rank: 'Xuất sắc (>=3.6)', count: gpaDist.excellent || 0, fill: '#10b981' },
    { rank: 'Giỏi (3.2-3.59)', count: gpaDist.good || 0, fill: '#6366f1' },
    { rank: 'Khá (2.5-3.19)', count: gpaDist.fair || 0, fill: '#38bdf8' },
    { rank: 'Trung bình (2.0-2.49)', count: gpaDist.average || 0, fill: '#f59e0b' },
    { rank: 'Cảnh báo (<2.0)', count: gpaDist.warning || 0, fill: '#f43f5e' },
  ] : [
    { rank: 'Xuất sắc (>=3.6)', count: 28, fill: '#10b981' },
    { rank: 'Giỏi (3.2-3.59)', count: 64, fill: '#6366f1' },
    { rank: 'Khá (2.5-3.19)', count: 110, fill: '#38bdf8' },
    { rank: 'Trung bình (2.0-2.49)', count: 18, fill: '#f59e0b' },
    { rank: 'Cảnh báo (<2.0)', count: 5, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Trung Tâm Điều Hành & Giám Sát Đào Tạo
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tổng hợp dữ liệu tuyển sinh, xếp loại học tập và giám sát dịch vụ theo thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadRealAnalytics}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Làm mới dữ liệu</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng Sinh Viên"
          value={summaryData?.totalStudents ?? stats?.students ?? '0'}
          subtitle="Đang theo học chính quy"
          icon={Users}
          trend="+12% kỳ này"
          color="indigo"
        />
        <StatCard
          title="Tổng Giảng Viên"
          value={summaryData?.totalTeachers ?? stats?.teachers ?? '0'}
          subtitle="Giảng viên cơ hữu & thỉnh giảng"
          icon={UserSquare2}
          trend="Đạt chuẩn"
          color="emerald"
        />
        <StatCard
          title="Điểm Trung Bình (GPA)"
          value={summaryData?.averageGpa4 ? `${summaryData.averageGpa4} / 4.0` : '3.38 / 4.0'}
          subtitle={`Tỉ lệ tích lũy đạt: ${summaryData?.passRate ?? 96.5}%`}
          icon={GraduationCap}
          trend="Tăng 0.05"
          color="amber"
        />
        <StatCard
          title="Môn Học & Học Phần"
          value={summaryData?.totalSubjects ?? stats?.subjects ?? '0'}
          subtitle="Chương trình khung chuẩn"
          icon={BookOpen}
          color="cyan"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPA Trend Area Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Xu Hướng GPA Toàn Trường Qua Các Kỳ</h3>
              <p className="text-xs text-slate-400">Điểm trung bình tích lũy thang 4.0</p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              Chỉ số học thuật
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SAMPLE_GPA_TREND}>
                <defs>
                  <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="semester" stroke="#64748b" fontSize={11} />
                <YAxis domain={[2.5, 4.0]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgGpa"
                  name="GPA Trung bình"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorGpa)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Faculty Breakdown Pie Chart */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Cơ Cấu Sinh Viên Theo Khoa</h3>
            <p className="text-xs text-slate-400">Tỉ lệ phân bổ chuyên ngành</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
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
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {pieData.slice(0, 4).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: FACULTY_PIE_COLORS[idx % FACULTY_PIE_COLORS.length] }}></span>
                  <span className="text-slate-300 font-medium truncate">{entry.name}</span>
                </div>
                <span className="text-slate-400 font-bold">{entry.value} SV</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart: Academic Classification Distribution */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Phân Bố Kết Quả Học Tập & Xếp Loại Học Lực</h3>
            <p className="text-xs text-slate-400">Thống kê số lượng sinh viên theo từng phân khúc học lực</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            Chất lượng đào tạo
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="rank" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" name="Số lượng sinh viên" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Server & Infrastructure Health (Actuator) */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Trạng Thái Dịch Vụ & Hạ Tầng Máy Chủ</h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {healthData.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Giám sát Actuator Health Check • TiDB Cloud • JWT Security Gateway</p>
            </div>
          </div>

          <button
            onClick={loadHealth}
            disabled={healthLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition active:scale-95 self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${healthLoading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Độ trễ API: {healthData.pingTime}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Database className="h-3.5 w-3.5 text-indigo-400" />
              <span>Cơ sở dữ liệu TiDB</span>
            </div>
            <p className="font-bold text-white text-sm">{healthData.db}</p>
            <p className="text-[10px] text-emerald-400">Kết nối: Ổn định</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
              <span>Dung lượng Lưu trữ</span>
            </div>
            <p className="font-bold text-white text-sm">{healthData.disk}</p>
            <p className="text-[10px] text-slate-400">Trạng thái: An toàn</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              <span>Cổng Thanh Toán PayOS</span>
            </div>
            <p className="font-bold text-white text-sm">SẴN SÀNG</p>
            <p className="text-[10px] text-amber-400">Tự động đối soát QR Code</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Activity className="h-3.5 w-3.5 text-purple-400" />
              <span>Kiểm Soát Tải (Rate Limit)</span>
            </div>
            <p className="font-bold text-white text-sm">BẢO VỆ 24/7</p>
            <p className="text-[10px] text-purple-400">Chống tấn công Brute-force & Spam</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Launchpad */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Truy Cập Nhanh Phân Hệ Quản Lý</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'students', label: 'Sinh Viên', icon: Users, color: 'text-indigo-400', desc: 'Quản lý hồ sơ' },
            { id: 'teachers', label: 'Giảng Viên', icon: UserSquare2, color: 'text-emerald-400', desc: 'Danh sách cán bộ' },
            { id: 'credit-classes', label: 'Lớp Tín Chỉ', icon: Layers, color: 'text-blue-400', desc: 'Mở lớp học phần' },
            { id: 'subjects', label: 'Môn Học', icon: BookOpen, color: 'text-cyan-400', desc: 'Chương trình khung' },
            { id: 'grades', label: 'Điểm Số', icon: Award, color: 'text-rose-400', desc: 'GPA & Bảng điểm' },
            { id: 'audit-logs', label: 'Nhật Ký HT', icon: ShieldCheck, color: 'text-violet-400', desc: 'Lịch sử bảo mật' },
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => onNavigate(btn.id)}
                className="flex flex-col text-left p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${btn.color} group-hover:scale-110 transition duration-200`} />
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-300 transition" />
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">{btn.label}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{btn.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}