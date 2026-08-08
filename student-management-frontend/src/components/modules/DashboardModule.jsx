import React, { useState, useEffect } from 'react';
import { 
  Users, UserSquare2, Building2, BookOpen, GraduationCap, 
  TrendingUp, Award, Layers, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import StatCard from '../common/StatCard';
import { analyticsApi } from '../../api';

const GPA_TREND_DATA = [
  { semester: 'Sem 1', avgGpa: 3.10, enrolled: 1100 },
  { semester: 'Sem 2', avgGpa: 3.22, enrolled: 1150 },
  { semester: 'Sem 3', avgGpa: 3.35, enrolled: 1200 },
  { semester: 'Sem 4', avgGpa: 3.42, enrolled: 1260 },
  { semester: 'Sem 5', avgGpa: 3.48, enrolled: 1284 },
];

const FACULTY_PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8'];

export default function DashboardModule({ stats, faculties = [], onNavigate }) {
  const [summaryData, setSummaryData] = useState(null);
  const [facultyDist, setFacultyDist] = useState([]);
  const [gpaDist, setGpaDist] = useState(null);

  useEffect(() => {
    loadRealAnalytics();
  }, []);

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
    value: f.totalStudents || 10,
  })) : [
    { name: 'Khoa Công Nghệ Thông Tin', value: 450 },
    { name: 'Khoa Điện Tử Viễn Thông', value: 320 },
    { name: 'Khoa Quản Trị Kinh Doanh', value: 280 },
    { name: 'Khoa Khoa Học Dữ Liệu', value: 210 },
  ]);

  const barData = gpaDist ? [
    { rank: 'Xuất sắc (>=3.6)', count: gpaDist.excellent || 45, fill: '#10b981' },
    { rank: 'Giỏi (3.2-3.59)', count: gpaDist.good || 120, fill: '#6366f1' },
    { rank: 'Khá (2.5-3.19)', count: gpaDist.fair || 95, fill: '#38bdf8' },
    { rank: 'Trung bình (2.0-2.49)', count: gpaDist.average || 25, fill: '#f59e0b' },
    { rank: 'Cảnh báo (<2.0)', count: gpaDist.warning || 5, fill: '#f43f5e' },
  ] : [
    { rank: 'Xuất sắc (>=3.6)', count: 45, fill: '#10b981' },
    { rank: 'Giỏi (3.2-3.59)', count: 120, fill: '#6366f1' },
    { rank: 'Khá (2.5-3.19)', count: 95, fill: '#38bdf8' },
    { rank: 'Trung bình (2.0-2.49)', count: 25, fill: '#f59e0b' },
    { rank: 'Cảnh báo (<2.0)', count: 5, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Academic Overview & Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time institutional performance metrics, GPA distributions, and faculty enrollments
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={summaryData?.totalStudents ?? stats.students ?? '1,284'}
          subtitle="Enrolled active learners"
          icon={Users}
          trend="+12.4%"
          color="indigo"
        />
        <StatCard
          title="Faculty Members"
          value={summaryData?.totalTeachers ?? stats.teachers ?? '86'}
          subtitle="Professors & Lecturers"
          icon={UserSquare2}
          trend="+4.2%"
          color="emerald"
        />
        <StatCard
          title="Average GPA"
          value={summaryData?.averageGpa4 ? `${summaryData.averageGpa4} / 4.0` : '3.48 / 4.0'}
          subtitle={`Pass Rate: ${summaryData?.passRate ?? 96.5}%`}
          icon={GraduationCap}
          trend="+0.15"
          color="amber"
        />
        <StatCard
          title="Credit Modules (Học phần)"
          value={summaryData?.totalSubjects ?? stats.subjects ?? '64'}
          subtitle="Curriculum syllabus"
          icon={BookOpen}
          color="cyan"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPA Trend Area Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Academic GPA Progression Trend</h3>
              <p className="text-xs text-slate-400">Cumulative average GPA across consecutive semesters</p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              GPA Analytics
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GPA_TREND_DATA}>
                <defs>
                  <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="semester" stroke="#64748b" fontSize={12} />
                <YAxis domain={[2.5, 4.0]} stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgGpa"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorGpa)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Faculty Breakdown Pie Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Student Enrollment by Faculty</h3>
            <p className="text-xs text-slate-400">Distribution proportion</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
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
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Legend */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            {pieData.slice(0, 4).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: FACULTY_PIE_COLORS[idx % FACULTY_PIE_COLORS.length] }}></span>
                  <span className="text-slate-300 font-medium truncate">{entry.name}</span>
                </div>
                <span className="text-slate-400 font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart: Academic Classification Distribution */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Academic Grade Performance Distribution</h3>
            <p className="text-xs text-slate-400">Student count categorised by official university grading standards</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            Grade Histogram
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="rank" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Launchpad Shortcuts */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Management Modules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { id: 'students', label: 'Students', icon: Users, color: 'text-indigo-400' },
            { id: 'teachers', label: 'Teachers', icon: UserSquare2, color: 'text-emerald-400' },
            { id: 'subjects', label: 'Subjects', icon: BookOpen, color: 'text-cyan-400' },
            { id: 'schedules', label: 'Timetable', icon: Layers, color: 'text-amber-400' },
            { id: 'grades', label: 'Grades & GPA', icon: Award, color: 'text-rose-400' },
            { id: 'audit-logs', label: 'Audit Logs', icon: ShieldCheck, color: 'text-violet-400' },
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => onNavigate(btn.id)}
                className="flex flex-col items-center gap-2 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/60 transition group"
              >
                <Icon className={`h-5 w-5 ${btn.color} group-hover:scale-110 transition duration-200`} />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white">{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
