// cSpell:disable
import { useState, useCallback, useEffect } from 'react';
import { creditClassApi, teacherApi, scheduleApi } from '../../api';

export function useTeacherProfile({ currentUser, onNotify }) {
  const currentTeacherId = currentUser?.teacherId || currentUser?.username || '';
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTeacherData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Teacher Info: first try dedicated /me endpoint, fallback to search
      let found = null;
      try {
        const meRes = await teacherApi.getMe();
        if (meRes?.data) {
          found = meRes.data;
        }
      } catch {
        try {
          const tRes = await teacherApi.getAll({ page: 0, size: 100 });
          const tData = tRes?.data || tRes;
          const list = Array.isArray(tData) ? tData : (tData?.content || []);
          found = list.find(t => 
            (currentTeacherId && t.teacherId?.toLowerCase() === currentTeacherId.toLowerCase()) ||
            (currentUser?.username && t.email?.toLowerCase() === currentUser?.username?.toLowerCase())
          ) || (currentUser?.role?.includes('ADMIN') ? list[0] : null);
        } catch (e) {
          console.warn('Lỗi khi tải danh sách giảng viên', e);
        }
      }

      setTeacherInfo(found || {
        teacherId: currentTeacherId || 'GV-00',
        fullName: currentUser?.fullName || 'Giảng Viên',
        email: currentUser?.email || (currentTeacherId ? `${currentTeacherId.toLowerCase()}@eduportal.edu.vn` : 'giangvien@eduportal.edu.vn'),
        facultyName: 'Chưa cập nhật khoa'
      });

      const activeTeacherId = found?.teacherId || currentTeacherId;

      // 2. Fetch Classes assigned to this teacher
      try {
        const cRes = await creditClassApi.getAll({ teacherId: activeTeacherId, size: 50 });
        const cData = cRes.data || cRes;
        let cList = Array.isArray(cData) ? cData : (cData.content || []);
        
        if (cList.length === 0) {
          const allRes = await creditClassApi.getAll({ size: 100 });
          const allData = allRes.data || allRes;
          const allList = Array.isArray(allData) ? allData : (allData.content || []);
          cList = allList.filter(c => 
            c.teacherId === activeTeacherId || 
            c.teacherName === found?.fullName ||
            (currentUser?.role?.includes('ADMIN') && allList.length > 0)
          );
          if (cList.length === 0 && allList.length > 0 && currentUser?.role?.includes('ADMIN')) {
            cList = allList.slice(0, 5);
          }
        }
        setClasses(cList);
      } catch (cErr) {
        console.warn('Lỗi khi tải danh sách lớp tín chỉ:', cErr);
      }

      // 3. Fetch Schedule
      try {
        const sRes = await scheduleApi.getAll({ teacherId: activeTeacherId, size: 100 });
        const sData = sRes.data || sRes;
        let sList = Array.isArray(sData) ? sData : (sData.content || []);
        if (sList.length === 0 && currentUser?.role?.includes('ADMIN')) {
          const allSched = await scheduleApi.getAll({ size: 100 });
          const allSData = allSched.data || allSched;
          sList = Array.isArray(allSData) ? allSData : (allSData.content || []);
        }
        setSchedules(sList);
      } catch (sErr) {
        console.warn('Lỗi khi tải thời khóa biểu:', sErr);
      }
    } catch (err) {
      console.warn('Lỗi tổng quan khi tải dữ liệu giảng viên:', err);
      if (onNotify) onNotify('error', 'Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  }, [currentTeacherId, currentUser, onNotify]);

  useEffect(() => {
    loadTeacherData();
  }, [loadTeacherData]);

  return {
    currentTeacherId,
    teacherInfo,
    classes,
    schedules,
    loading,
    loadTeacherData,
  };
}
