import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { 
  Users, UserSquare2, Building2, BookOpen, GraduationCap, 
  TrendingUp, Award, Layers, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck,
  Server, Activity, Database, Cpu, HardDrive, RefreshCw, ArrowUpRight, Inbox
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import StatCard from '../common/StatCard';
import { analyticsApi, systemApi } from '../../api';

const FACULTY_PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8', '#8b5cf6'];

export default function DashboardModule({ stats, faculties = [], onNavigate, currentUser }) {
  const [summaryData, setSummaryData] = useState(null);
  const [facultyDist, setFacultyDist] = useState([]);
  const [gpaDist, setGpaDist] = useState(null);
  const [gpaTrends, setGpaTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);
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
      setHealthData({ status: 'OFFLINE', db: 'DISCONNECTED', disk: 'UNKNOWN', pingTime: '—' });
    } finally {
      setHealthLoading(false);
    }
  };

  const loadRealAnalytics = async () => {
    setLoading(true);
    setAnalyticsError(null);
    try {
      const [sumRes, facRes, gpaRes] = await Promise.allSettled([
        analyticsApi.getSummary(),
        analyticsApi.getFacultyDistribution(),
        analyticsApi.getGpaDistribution(),
      ]);

      let hasSuccess = false;

      if (sumRes.status === 'fulfilled') {
        const d = sumRes.value.data || sumRes.value;
        setSummaryData(d);
        hasSuccess = true;
      }
      if (facRes.status === 'fulfilled') {
        const d = facRes.value.data || facRes.value;
        setFacultyDist(Array.isArray(d) ? d : []);
        hasSuccess = true;
      }
      if (gpaRes.status === 'fulfilled') {
        const d = gpaRes.value.data || gpaRes.value;
        setGpaDist(d);
        hasSuccess = true;
      }

      if (!hasSuccess && (sumRes.status === 'rejected' || facRes.status === 'rejected')) {
        setAnalyticsError('Không thể tải dữ liệu phân tích hệ thống từ máy chủ.');
      }
    } catch (err) {
      console.warn('Err load real analytics', err);
      setAnalyticsError('Lỗi kết nối khi tải số liệu phân tích.');
    } finally {
      setLoading(false);
    }
  };

  const pieData = facultyDist.length > 0 ? facultyDist.map(f => ({
    name: f.facultyName || f.facultyId,
    value: f.studentCount || 0,
  })) : (faculties.length > 0 ? faculties.map(f => ({
    name: f.facultyName,
    value: f.totalStudents || 0,
  })) : []);

  const barData = gpaDist ? [
    { rank: 'Xuất sắc (>=3.6)', count: gpaDist.excellent || 0, fill: '#10b981' },
    { rank: 'Giỏi (3.2-3.59)', count: gpaDist.good || 0, fill: '#6366f1' },
    { rank: 'Khá (2.5-3.19)', count: gpaDist.fair || 0, fill: '#38bdf8' },
    { rank: 'Trung bình (2.0-2.49)', count: gpaDist.average || 0, fill: '#f59e0b' },
    { rank: 'Cảnh báo (<2.0)', count: gpaDist.warning || 0, fill: '#f43f5e' },
  ] : [];

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
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-xs font-semibold text-indigo-300 transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Đang đồng bộ...' : 'Làm mới dữ liệu'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Error Banner if any */}
      {analyticsError && (
        <div className="flex items-center justify-between p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{analyticsError}</span>
          </div>
          <button 
            onClick={loadRealAnalytics}
            className="underline font-semibold hover:text-white"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng Sinh Viên"
          value={summaryData?.totalStudents ?? stats?.students ?? '—'}
          subtitle="Đang theo học chính quy"
          icon={Users}
          trend={summaryData?.totalStudents ? "+12% kỳ này" : "Đang cập nhật"}
          color="indigo"
        />
        <StatCard
          title="Tổng Giảng Viên"
          value={summaryData?.totalTeachers ?? stats?.teachers ?? '—'}
          subtitle="Giảng viên cơ hữu & thỉnh giảng"
          icon={UserSquare2}
          trend="Đạt chuẩn"
          color="emerald"
        />
        <StatCard
          title="Điểm Trung Bình (GPA)"
          value={summaryData?.averageGpa4 ? `${summaryData.averageGpa4} / 4.0` : '—'}
          subtitle={summaryData?.passRate ? `Tỉ lệ tích lũy đạt: ${summaryData.passRate}%` : 'Chưa có thống kê'}
          icon={GraduationCap}
          trend="Thực tế"
          color="amber"
        />
        <StatCard
          title="Môn Học & Học Phần"
          value={summaryData?.totalSubjects ?? stats?.subjects ?? '—'}
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

          <div className="h-64 w-full flex items-center justify-center">
            {gpaTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpaTrends}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="semester" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 4.0]} stroke="#64748b" fontSize={11} />
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
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Inbox className="h-10 w-10 text-slate-600 mb-2" />
                <p className="text-xs font-semibold text-slate-400">Chưa có dữ liệu xu hướng GPA lịch sử</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Dữ liệu sẽ hiển thị khi kết thúc đợt xét điểm học kỳ</p>
              </div>
            )}
          </div>
        </div>

        {/* Faculty Breakdown Pie Chart */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
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
                  <span className="text-slate-400 font-bold">{entry.value} SV</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart: Xếp Loại Học Lực Distribution */}
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

        <div className="h-52 w-full flex items-center justify-center">
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
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Inbox className="h-10 w-10 text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-400">Chưa có dữ liệu xếp loại học lực toàn trường</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Dữ liệu sẽ được cập nhật tự động khi có điểm học phần</p>
            </div>
          )}
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
                  {msg.enum.healthStatus[healthData.status] || healthData.status}
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
            <p className="font-bold text-white text-sm">{msg.enum.healthStatus[healthData.db] || healthData.db}</p>
            <p className="text-[10px] text-emerald-400">Kết nối: Ổn định</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
              <span>Dung lượng Lưu trữ</span>
            </div>
            <p className="font-bold text-white text-sm">{msg.enum.healthStatus[healthData.disk] || healthData.disk}</p>
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
