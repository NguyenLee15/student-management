// cSpell:disable
import { useState, useEffect, useCallback } from 'react';
import { studentPortalApi } from '../../../api';

export function useStudentPortal({ user, onNotify } = {}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentPortalApi.getMyOverview();
      setProfile(res.data);
    } catch (err) {
      console.warn('Không thể tải profile sinh viên:', err);
      const msg = err.response?.data?.message || err.message || 'Không thể tải thông tin hồ sơ sinh viên.';
      setError(msg);
      onNotify?.('error', msg);
    } finally {
      setLoading(false);
    }
  }, [onNotify]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const studentDisplayName = profile?.fullName || user?.fullName || user?.username || 'Sinh Viên';
  const studentDisplayId = profile?.studentId || user?.studentId || user?.username || 'SV001';

  return {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    profile,
    loading,
    error,
    studentDisplayName,
    studentDisplayId,
    refreshProfile: fetchProfile,
  };
}

