import React, { useState, useEffect } from 'react';
import Toast from './components/common/Toast';
import LoginModal from './components/auth/LoginModal';
import CommandPalette from './components/common/CommandPalette';

import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import AdminLayout from './layouts/AdminLayout';

import { authApi, studentApi, teacherApi, facultyApi, subjectApi } from './api';

export default function App() {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [apiChecking, setApiChecking] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Authentication State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user_info');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Admin Simulator Perspective (cho phép Admin xem thử giao diện Sinh viên / Giảng viên)
  const [simulatedRole, setSimulatedRole] = useState(null);

  // Normalize Role Helper
  const normalizeRole = (role) => {
    if (!role) return null;
    const r = String(role).toUpperCase();
    if (r === 'ADMIN' || r === 'ROLE_ADMIN') return 'ROLE_ADMIN';
    if (r === 'TEACHER' || r === 'ROLE_TEACHER') return 'ROLE_TEACHER';
    if (r === 'STUDENT' || r === 'ROLE_STUDENT') return 'ROLE_STUDENT';
    return null;
  };

  // Effective Role currently being rendered
  const effectiveRole = normalizeRole(simulatedRole || currentUser?.role);

  // Global Counts / Badges for Admin
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
      setSimulatedRole(null);
      setShowLoginModal(true);
      showToast('error', 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    };
    
    // Listen for forbidden 403 events from axiosClient
    const handleForbidden = (e) => {
      showToast('error', e.detail || 'Truy cập bị từ chối: Bạn không có quyền thực hiện thao tác này.');
    };

    // Listen for rate limit 429 events from axiosClient
    const handleRateLimit = (e) => {
      showToast('warning', e.detail || 'Quá nhiều yêu cầu! Vui lòng thao tác chậm lại (Rate limit).');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:forbidden', handleForbidden);
    window.addEventListener('auth:ratelimit', handleRateLimit);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:forbidden', handleForbidden);
      window.removeEventListener('auth:ratelimit', handleRateLimit);
    };
  }, []);

    const checkHealthAndLoadStats = async () => {
    setApiChecking(true);
    try {
      if (!currentUser) {
        setIsBackendConnected(false);
        setApiChecking(false);
        return;
      }
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
        showToast('success', 'Đã kết nối máy chủ Spring Boot REST API (Port 8080)');
      }
    } catch {
      setIsBackendConnected(false);
    } finally {
      setApiChecking(false);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setSimulatedRole(null);
    showToast('success', `Đăng nhập thành công: ${user.username} (${user.role})`);
    checkHealthAndLoadStats();
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    setCurrentUser(null);
    setSimulatedRole(null);
    showToast('info', 'Đã đăng xuất thành công.');
  };

  const handleRoleSwitch = (role) => {
    setSimulatedRole(role);
    showToast('info', `Đã chuyển sang không gian làm việc: ${role}`);
  };

  return (
    <>
      {/* 🎓 RENDER STUDENT PORTAL WORKSPACE */}
      {effectiveRole === 'ROLE_STUDENT' && (
        <StudentLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          onNotify={showToast}
          onRoleSwitch={currentUser?.role === 'ROLE_ADMIN' ? handleRoleSwitch : null}
        />
      )}

      {/* 👨‍🏫 RENDER TEACHER PORTAL WORKSPACE */}
      {effectiveRole === 'ROLE_TEACHER' && (
        <TeacherLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          onNotify={showToast}
          onRoleSwitch={currentUser?.role === 'ROLE_ADMIN' ? handleRoleSwitch : null}
        />
      )}

      {/* 👑 RENDER ADMIN CONTROL CENTER WORKSPACE */}
      {effectiveRole === 'ROLE_ADMIN' && (
        <AdminLayout
          currentUser={currentUser}
          isBackendConnected={isBackendConnected}
          apiChecking={apiChecking}
          onRefreshHealth={checkHealthAndLoadStats}
          onOpenLogin={() => setShowLoginModal(true)}
          onOpenCommand={() => setShowCommandPalette(true)}
          onLogout={handleLogout}
          showToast={showToast}
          counts={counts}
          facultiesList={facultiesList}
          onRoleSwitch={handleRoleSwitch}
        />
      )}

      {/* 🔔 GLOBAL TOAST NOTIFICATION */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* 🔍 UNIVERSAL COMMAND PALETTE (CTRL+K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={() => {}}
      />

      {/* 🔐 AUTH LOGIN MODAL */}
      <LoginModal
        isOpen={showLoginModal || !currentUser}
        onClose={() => { if (currentUser) setShowLoginModal(false); }}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
