import axiosClient from './axiosClient';
import axios from 'axios';

// 1. Authentication API
export const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (data) => axiosClient.post('/auth/register', data),
  refresh: (refreshToken) => axiosClient.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => axiosClient.post('/auth/logout', { refreshToken }),
};

// 2. Students API
export const studentApi = {
  getAll: (params) => axiosClient.get('/students', { params }),
  getById: (id) => axiosClient.get(`/students/${id}`),
  create: (data) => axiosClient.post('/students', data),
  update: (id, data) => axiosClient.put(`/students/${id}`, data),
  delete: (id) => axiosClient.delete(`/students/${id}`),
  exportExcel: () => {
    return axios.get('/api/v1/students/export', {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token') || ''}`,
      },
    });
  },
  importExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post('/api/v1/students/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('jwt_token') || ''}`,
      },
    });
  },
  getImportTask: (taskId) => axiosClient.get(`/students/import-tasks/${taskId}`),
};

// 3. Teachers API
export const teacherApi = {
  getAll: (params) => axiosClient.get('/teachers', { params }),
  getById: (id) => axiosClient.get(`/teachers/${id}`),
  create: (data) => axiosClient.post('/teachers', data),
  update: (id, data) => axiosClient.put(`/teachers/${id}`, data),
  delete: (id) => axiosClient.delete(`/teachers/${id}`),
};

// 4. Faculties API
export const facultyApi = {
  getAll: (params = { unpaged: true }) => axiosClient.get('/faculties', { params }),
  getById: (id) => axiosClient.get(`/faculties/${id}`),
  create: (data) => axiosClient.post('/faculties', data),
  update: (id, data) => axiosClient.put(`/faculties/${id}`, data),
  delete: (id) => axiosClient.delete(`/faculties/${id}`),
};

// 5. Academic Years (Khóa học) API
export const academicYearApi = {
  getAll: (params = { unpaged: true }) => axiosClient.get('/academic-years', { params }),
  getById: (id) => axiosClient.get(`/academic-years/${id}`),
  create: (data) => axiosClient.post('/academic-years', data),
  update: (id, data) => axiosClient.put(`/academic-years/${id}`, data),
  delete: (id) => axiosClient.delete(`/academic-years/${id}`),
};

// 6. Student Classes (Lớp sinh hoạt) API
export const studentClassApi = {
  getAll: (params) => axiosClient.get('/student-classes', { params }),
  getById: (id) => axiosClient.get(`/student-classes/${id}`),
  create: (data) => axiosClient.post('/student-classes', data),
  update: (id, data) => axiosClient.put(`/student-classes/${id}`, data),
  delete: (id) => axiosClient.delete(`/student-classes/${id}`),
};

// 7. Subjects (Học phần) API
export const subjectApi = {
  getAll: (params) => axiosClient.get('/subjects', { params }),
  getById: (id) => axiosClient.get(`/subjects/${id}`),
  create: (data) => axiosClient.post('/subjects', data),
  update: (id, data) => axiosClient.put(`/subjects/${id}`, data),
  delete: (id) => axiosClient.delete(`/subjects/${id}`),
};

// 8. Classrooms (Phòng học) API
export const classroomApi = {
  getAll: (params) => axiosClient.get('/classrooms', { params }),
  getById: (id) => axiosClient.get(`/classrooms/${id}`),
  create: (data) => axiosClient.post('/classrooms', data),
  update: (id, data) => axiosClient.put(`/classrooms/${id}`, data),
  delete: (id) => axiosClient.delete(`/classrooms/${id}`),
};

// 9. Credit Classes (Lớp tín chỉ) API
export const creditClassApi = {
  getAll: () => axiosClient.get('/credit-classes'),
  getById: (id) => axiosClient.get(`/credit-classes/${id}`),
  create: (data) => axiosClient.post('/credit-classes', data),
  update: (id, data) => axiosClient.put(`/credit-classes/${id}`, data),
  delete: (id) => axiosClient.delete(`/credit-classes/${id}`),
  addStudent: (creditClassId, studentId) => axiosClient.post(`/credit-classes/${creditClassId}/students/${studentId}`),
  removeStudent: (creditClassId, studentId) => axiosClient.delete(`/credit-classes/${creditClassId}/students/${studentId}`),
};

// 10. Semester Schedules (Lịch học / Thời khóa biểu) API
export const scheduleApi = {
  getAll: (params) => axiosClient.get('/semester-schedules', { params }),
  getById: (id) => axiosClient.get(`/semester-schedules/${id}`),
  create: (data) => axiosClient.post('/semester-schedules', data),
  update: (id, data) => axiosClient.put(`/semester-schedules/${id}`, data),
  delete: (id) => axiosClient.delete(`/semester-schedules/${id}`),
};

// 11. Academic Grades (Điểm học tập) API
export const gradeApi = {
  getAll: (params) => axiosClient.get('/academic-grades', { params }),
  getById: (id) => axiosClient.get(`/academic-grades/${id}`),
  create: (data) => axiosClient.post('/academic-grades', data),
  update: (id, data) => axiosClient.put(`/academic-grades/${id}`, data),
  delete: (id) => axiosClient.delete(`/academic-grades/${id}`),
};

// 12. Users (Tài khoản người dùng) API
export const userApi = {
  getAll: (params) => axiosClient.get('/users', { params }),
  create: (data) => axiosClient.post('/users', data),
  delete: (userName) => axiosClient.delete(`/users/${userName}`),
};

// 13. Real-time Analytics & Aggregations API
export const analyticsApi = {
  getSummary: () => axiosClient.get('/analytics/summary'),
  getFacultyDistribution: () => axiosClient.get('/analytics/faculty-distribution'),
  getGpaDistribution: () => axiosClient.get('/analytics/gpa-distribution'),
};

// 14. Audit Log API
export const auditLogApi = {
  getAll: (params) => axiosClient.get('/audit-logs', { params }),
};

// 15. System Monitoring & Actuator API
export const systemApi = {
  getHealth: () => axiosClient.get('/actuator/health'),
  getPrometheus: () => axiosClient.get('/actuator/prometheus'),
};

