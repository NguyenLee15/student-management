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
        let cList = [];
        try {
          const myClsRes = await creditClassApi.getMyClasses();
          const myClsData = myClsRes.data || myClsRes;
          cList = Array.isArray(myClsData) ? myClsData : (myClsData.content || []);
        } catch {
          const cRes = await creditClassApi.getAll({ teacherId: activeTeacherId, size: 50 });
          const cData = cRes.data || cRes;
          cList = Array.isArray(cData) ? cData : (cData.content || []);
          
          if (cList.length === 0 && activeTeacherId) {
            const allRes = await creditClassApi.getAll({ size: 100 });
            const allData = allRes.data || allRes;
            const allList = Array.isArray(allData) ? allData : (allData.content || []);
            cList = allList.filter(c => 
              c.teacherId === activeTeacherId || 
              (found?.fullName && c.teacherName === found.fullName)
            );
          }
        }
        setClasses(cList);
      } catch (cErr) {
        console.warn('Lỗi khi tải danh sách lớp tín chỉ:', cErr);
      }

      // 3. Fetch Schedule
      try {
        let sList = [];
        try {
          const mySchRes = await scheduleApi.getMySchedules();
          const mySchData = mySchRes.data || mySchRes;
          sList = Array.isArray(mySchData) ? mySchData : (mySchData.content || []);
        } catch {
          const sRes = await scheduleApi.getAll({ teacherId: activeTeacherId, size: 100 });
          const sData = sRes.data || sRes;
          sList = Array.isArray(sData) ? sData : (sData.content || []);
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

