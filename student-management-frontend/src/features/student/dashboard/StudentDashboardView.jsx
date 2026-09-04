// cSpell:disable
import React, { useState, useEffect } from 'react';
import { studentPortalApi } from '../../../api';
import Skeleton from '../../../components/common/Skeleton';
import StudentWelcomeBanner from './StudentWelcomeBanner';
import StudentKpiGrid from './StudentKpiGrid';
import StudentTodaySchedule from './StudentTodaySchedule';
import StudentQuickActions from './StudentQuickActions';

export default function StudentDashboardView({ onNavigateTab, onNotify }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const loadOverview = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await studentPortalApi.getMyOverview();
      setOverview(res.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu tổng quan', err);
      const msg = err.response?.data?.message || err.message || 'Không thể tải dữ liệu tổng quan sinh viên.';
      setErrorMsg(msg);
      onNotify?.('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Banner Skeleton */}
        <Skeleton className="h-40 w-full rounded-2xl" />
        
        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>

        {/* Bottom Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (errorMsg && !overview) {
    return (
      <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center space-y-3">
        <p className="text-sm font-bold text-rose-700">{errorMsg}</p>
        <button
          onClick={loadOverview}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
        >
          Thử Lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <StudentWelcomeBanner
        overview={overview}
        onNavigateTab={onNavigateTab}
      />

      {/* KPI Cards Grid */}
      <StudentKpiGrid overview={overview} />

      {/* Today Schedule Timeline & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StudentTodaySchedule
          todaySchedule={overview?.todaySchedule}
          onNavigateTab={onNavigateTab}
        />
        <StudentQuickActions onNavigateTab={onNavigateTab} />
      </div>
    </div>
  );
}
