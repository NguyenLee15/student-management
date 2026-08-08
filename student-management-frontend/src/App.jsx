import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Toast from './components/common/Toast';
import LoginModal from './components/auth/LoginModal';

import DashboardModule from './components/modules/DashboardModule';
import StudentModule from './components/modules/StudentModule';
import TeacherModule from './components/modules/TeacherModule';
import FacultyModule from './components/modules/FacultyModule';
import AcademicYearModule from './components/modules/AcademicYearModule';
import StudentClassModule from './components/modules/StudentClassModule';
import SubjectModule from './components/modules/SubjectModule';
import ClassroomModule from './components/modules/ClassroomModule';
import CreditClassModule from './components/modules/CreditClassModule';
import ScheduleModule from './components/modules/ScheduleModule';
import GradeModule from './components/modules/GradeModule';
import UserModule from './components/modules/UserModule';

import { studentApi, teacherApi, facultyApi, subjectApi } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [apiChecking, setApiChecking] = useState(false);

  // Authentication State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user_info');
      return stored ? JSON.parse(stored) : { username: 'admin', role: 'ROLE_ADMIN' };
    } catch {
      return { username: 'admin', role: 'ROLE_ADMIN' };
    }
  });

  // Global Counts / Badges
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    faculties: 0,
    subjects: 0,
  });
  const [facultiesList, setFacultiesList] = useState([]);

  // Global Toast
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    checkHealthAndLoadStats();

    // Listen for unauthorized 401 events from axiosClient
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setShowLoginModal(true);
      showToast('error', 'Session expired. Please log in again.');
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const checkHealthAndLoadStats = async () => {
    setApiChecking(true);
    try {
      const [stRes, tRes, fRes, subRes] = await Promise.allSettled([
        studentApi.getAll({ page: 0, size: 1 }),
        teacherApi.getAll({ page: 0, size: 1 }),
        facultyApi.getAll({ unpaged: true }),
        subjectApi.getAll({ page: 0, size: 1 }),
      ]);

      const isLive = stRes.status === 'fulfilled' || fRes.status === 'fulfilled';
      setIsBackendConnected(isLive);

      let studentCount = 0;
      let teacherCount = 0;
      let facultyCount = 0;
      let subjectCount = 0;

      if (stRes.status === 'fulfilled') {
        const d = stRes.value.data || stRes.value;
        studentCount = d.totalElements || d.length || 0;
      }
      if (tRes.status === 'fulfilled') {
        const d = tRes.value.data || tRes.value;
        teacherCount = d.totalElements || d.length || 0;
      }
      if (fRes.status === 'fulfilled') {
        const d = fRes.value.data || fRes.value;
        const arr = Array.isArray(d) ? d : d.content || [];
        facultyCount = arr.length;
        setFacultiesList(arr);
      }
      if (subRes.status === 'fulfilled') {
        const d = subRes.value.data || subRes.value;
        subjectCount = d.totalElements || d.length || 0;
      }

      setCounts({
        students: studentCount,
        teachers: teacherCount,
        faculties: facultyCount,
        subjects: subjectCount,
      });

      if (isLive) {
        showToast('success', 'Connected to Spring Boot REST API (Port 8080)');
      }
    } catch (err) {
      setIsBackendConnected(false);
    } finally {
      setApiChecking(false);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast('success', `Welcome back, ${user.username}! Logged in as ${user.role}`);
    checkHealthAndLoadStats();
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    setCurrentUser(null);
    showToast('info', 'Logged out successfully.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 🟢 TOP HEADER */}
      <Header
        isBackendConnected={isBackendConnected}
        apiChecking={apiChecking}
        onRefreshHealth={checkHealthAndLoadStats}
        currentUser={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      {/* 🚀 MAIN CONTENT BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* 📱 SIDEBAR NAVIGATION */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          counts={counts}
        />

        {/* 📊 ACTIVE MODULE ROUTER */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {activeTab === 'overview' && (
            <DashboardModule
              stats={counts}
              faculties={facultiesList}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'students' && (
            <StudentModule onNotify={showToast} />
          )}

          {activeTab === 'teachers' && (
            <TeacherModule onNotify={showToast} />
          )}

          {activeTab === 'faculties' && (
            <FacultyModule onNotify={showToast} />
          )}

          {activeTab === 'academic-years' && (
            <AcademicYearModule onNotify={showToast} />
          )}

          {activeTab === 'student-classes' && (
            <StudentClassModule onNotify={showToast} />
          )}

          {activeTab === 'subjects' && (
            <SubjectModule onNotify={showToast} />
          )}

          {activeTab === 'classrooms' && (
            <ClassroomModule onNotify={showToast} />
          )}

          {activeTab === 'credit-classes' && (
            <CreditClassModule onNotify={showToast} />
          )}

          {activeTab === 'schedules' && (
            <ScheduleModule onNotify={showToast} />
          )}

          {activeTab === 'grades' && (
            <GradeModule onNotify={showToast} />
          )}

          {activeTab === 'users' && (
            <UserModule onNotify={showToast} />
          )}
        </main>
      </div>

      {/* 🔔 GLOBAL TOAST NOTIFICATION */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* 🔐 AUTH LOGIN MODAL */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
