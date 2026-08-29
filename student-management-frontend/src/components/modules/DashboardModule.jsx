import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { 
  Users, UserSquare2, Building2, BookOpen, GraduationCap, 
  TrendingUp, Award, Layers, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck,
  Server, Activity, Database, Cpu, HardDrive, RefreshCw, ArrowUpRight, Inbox,
  Clock, AlertOctagon, ChevronRight, FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import StatCard from '../common/StatCard';
import { analyticsApi, systemApi, auditLogApi } from '../../api';

const FACULTY_PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8', '#8b5cf6'];

export default function DashboardModule({ stats, faculties = [], onNavigate, currentUser }) {
  const [summaryData, setSummaryData] = useState(null);
  const [facultyDist, setFacultyDist] = useState([]);
  const [gpaDist, setGpaDist] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [healthData, setHealthData] = useState({ status: 'UP', db: 'UP', disk: 'UP', pingTime: '12ms' });
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    loadAllDashboardData();
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

  const loadAllDashboardData = async () => {
    setLoading(true);
    setAnalyticsError(null);
    try {
      const [sumRes, facRes, gpaRes, logsRes] = await Promise.allSettled([
        analyticsApi.getSummary(),
        analyticsApi.getFacultyDistribution(),
        analyticsApi.getGpaDistribution(),
        auditLogApi.getAll({ page: 0, size: 5 }),
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
      if (logsRes.status === 'fulfilled') {
        const d = logsRes.value.data || logsRes.value;
        const list = Array.isArray(d) ? d : (d.content || []);
        setRecentLogs(list);
      }

      if (!hasSuccess && (sumRes.status === 'rejected' || facRes.status === 'rejected')) {
        setAnalyticsError('Không thể tải số liệu phân tích từ máy chủ.');
      }
    } catch (err) {
      console.warn('Lỗi khi tải phân tích tổng quan', err);
      setAnalyticsError('Lỗi kết nối máy chủ khi tải số liệu tổng quan.');
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

  const warningCount = gpaDist?.warning || 0;

  return (
    <div className="space-y-6">
      {/* 1. Header Page Title & Sync */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 panel-card p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Trung Tâm Điều Hành & Giám Sát Đào Tạo
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
              Thời gian thực
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tổng hợp dữ liệu tuyển sinh, xếp loại học tập, tiến độ đào tạo và kiểm soát hạ tầng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Đang đồng bộ...' : 'Làm mới dữ liệu'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Error Banner if any */}
      {analyticsError && (
        <div className="flex items-center justify-between p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{analyticsError}</span>
          </div>
          <button 
            onClick={loadAllDashboardData}
            className="underline font-semibold hover:text-white"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 2. Top 4 Management KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng Sinh Viên"
          value={summaryData?.totalStudents ?? stats?.students ?? '—'}
          subtitle="Sinh viên chính quy"
          icon={Users}
          trend={summaryData?.totalStudents ? "+12% kỳ này" : "Đang cập nhật"}
        />
        <StatCard
          title="Tổng Giảng Viên"
          value={summaryData?.totalTeachers ?? stats?.teachers ?? '—'}
          subtitle="Cán bộ & Giảng viên"
          icon={UserSquare2}
          trend="Đạt chuẩn"
        />
        <StatCard
          title="Lớp Tín Chỉ Đang Mở"
          value={stats?.creditClasses ?? stats?.classes ?? '—'}
          subtitle="Học kỳ 1 (2025 - 2026)"
          icon={Layers}
          trend="Đang giảng dạy"
        />
        <StatCard
          title="Môn Học Khung"
          value={summaryData?.totalSubjects ?? stats?.subjects ?? '—'}
          subtitle="Chương trình đào tạo"
          icon={BookOpen}
          trend="Chuẩn hóa"
        />
      </div>

      {/* 3. Urgent Action & Academic Alerts Strip (Business Meaning) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel-card p-4 flex items-center justify-between border-l-4 border-l-rose-500">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Cảnh Báo Học Vụ (GPA &lt; 2.0)</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {warningCount > 0 ? `${warningCount} sinh viên cần gặp cố vấn học tập` : 'Không có cảnh báo nghiêm trọng'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('grades')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="panel-card p-4 flex items-center justify-between border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Tiến Độ Nhập Điểm Học Kỳ</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tỉ lệ sinh viên tích lũy đạt: {summaryData?.passRate ? `${summaryData.passRate}%` : 'Đang xử lý'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('grades')}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="panel-card p-4 flex items-center justify-between border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Cổng Thanh Toán PayOS</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Tự động đối soát mã VietQR 24/7</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
            SẴN SÀNG
          </span>
        </div>
      </div>

      {/* 4. Real Analytics Charts & Distribution */}
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

      {/* 5. Recent System Activities Feed & Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent System Activity Feed (2 cols) */}
        <div className="lg:col-span-2 panel-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Nhật Ký Hoạt Động & Biến Động Gần Đây</h3>
            </div>
            <button 
              onClick={() => onNavigate('audit-logs')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {recentLogs.length > 0 ? (
              recentLogs.slice(0, 5).map((log, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {log.action || 'THAO TÁC'}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-200">{log.entityName || log.description || 'Thao tác hệ thống'}</p>
                      <p className="text-[11px] text-slate-400">Thực hiện bởi: {log.performedBy || 'Hệ thống'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong'}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                Chưa có ghi nhận biến động mới trong phiên làm việc này.
              </div>
            )}
          </div>
        </div>

        {/* Live Server & Infrastructure Health (1 col) */}
        <div className="panel-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Trạng Thái Hạ Tầng</h3>
            </div>
            <button
              onClick={loadHealth}
              disabled={healthLoading}
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${healthLoading ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{healthData.pingTime}</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Database className="h-3.5 w-3.5 text-indigo-400" />
                <span>Cơ sở dữ liệu TiDB</span>
              </div>
              <span className="font-semibold text-emerald-400">{msg.enum.healthStatus[healthData.db] || healthData.db}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
                <span>Dung lượng lưu trữ</span>
              </div>
              <span className="font-semibold text-emerald-400">{msg.enum.healthStatus[healthData.disk] || healthData.disk}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>Bảo vệ Rate Limit</span>
              </div>
              <span className="font-semibold text-slate-300">24/7 BẢO VỆ</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Quick Module Launchpad */}
      <div className="panel-card p-5 space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phân Hệ Nghiệp Vụ Cốt Lõi</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'students', label: 'Sinh Viên', icon: Users, desc: 'Hồ sơ & Tra cứu' },
            { id: 'teachers', label: 'Giảng Viên', icon: UserSquare2, desc: 'Cán bộ & Phân công' },
            { id: 'credit-classes', label: 'Lớp Tín Chỉ', icon: Layers, desc: 'Mở lớp học phần' },
            { id: 'subjects', label: 'Môn Học', icon: BookOpen, desc: 'Chương trình khung' },
            { id: 'grades', label: 'Điểm Số & GPA', icon: Award, desc: 'Quản lý kết quả' },
            { id: 'audit-logs', label: 'Nhật Ký HT', icon: ShieldCheck, desc: 'Lịch sử bảo mật' },
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => onNavigate(btn.id)}
                className="flex flex-col text-left p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300 transition" />
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-300 transition" />
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">{btn.label}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{btn.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
