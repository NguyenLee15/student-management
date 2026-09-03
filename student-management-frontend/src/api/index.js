import axiosClient from './axiosClient';
import axios from 'axios';
import { getMemoryToken } from './axiosClient';

// 1. Authentication API
export const authApi = {
  login: (data) => axiosClient.post('/auth/login', data),
  logout: () => axiosClient.post('/auth/logout'),
  refreshToken: (data) => axiosClient.post('/auth/refresh', data),
  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
};

// 2. Students API
export const studentApi = {
  getAll: (params) => axiosClient.get('/students', { params }),
  getById: (id) => axiosClient.get(`/students/${id}`),
  create: (data) => axiosClient.post('/students', data),
  update: (id, data) => axiosClient.put(`/students/${id}`, data),
  delete: (id) => axiosClient.delete(`/students/${id}`),
  exportExcel: () => {
    return axios.get(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/students/export`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${getMemoryToken() || ''}`,
      },
    });
  },
  importExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/students/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getMemoryToken() || ''}`,
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
  getAll: (params) => axiosClient.get('/classes', { params }),
  getById: (id) => axiosClient.get(`/classes/${id}`),
  create: (data) => axiosClient.post('/classes', data),
  update: (id, data) => axiosClient.put(`/classes/${id}`, data),
  delete: (id) => axiosClient.delete(`/classes/${id}`),
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
  getStudents: (id) => axiosClient.get(`/credit-classes/${id}/students`),
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
  getTranscript: (studentId) => axiosClient.get(`/academic-grades/transcript/${studentId}`),
  create: (data) => axiosClient.post('/academic-grades', data),
  update: (id, data) => axiosClient.put(`/academic-grades/${id}`, data),
  delete: (id) => axiosClient.delete(`/academic-grades/${id}`),
};

// 12. Users (Tài khoản người dùng) API
export const userApi = {
  getAll: (params) => axiosClient.get('/users', { params }),
  create: (data) => axiosClient.post('/users', data),
  delete: (userName) => axiosClient.delete(`/users/${userName}`),
  changePassword: (data) => axiosClient.put('/users/change-password', data),
  getMe: () => axiosClient.get('/users/me'),
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
  getHealth: () => {
    const raw = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    const root = raw.replace(/\/api\/v1\/?$/, '');
    const url = (root ? root : '') + '/actuator/health';
    return axios.get(url, { withCredentials: true, timeout: 5000 });
  },
  getPrometheus: () => {
    const raw = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    const root = raw.replace(/\/api\/v1\/?$/, '');
    const url = (root ? root : '') + '/actuator/prometheus';
    return axios.get(url, { withCredentials: true, timeout: 5000 });
  },
};

// 16. Registration Periods API
export const registrationPeriodApi = {
  getAll: () => axiosClient.get('/registration-periods'),
  getActive: () => axiosClient.get('/registration-periods/active'),
  getById: (id) => axiosClient.get(`/registration-periods/${id}`),
  create: (data) => axiosClient.post('/registration-periods', data),
  update: (id, data) => axiosClient.put(`/registration-periods/${id}`, data),
  toggleActive: (id) => axiosClient.patch(`/registration-periods/${id}/toggle-active`),
  delete: (id) => axiosClient.delete(`/registration-periods/${id}`),
};

// 17. Tuition Policies API
export const tuitionPolicyApi = {
  getAll: () => axiosClient.get('/tuition-policies'),
  getBySemester: (semesterId) => axiosClient.get(`/tuition-policies/semester/${semesterId}`),
  create: (data) => axiosClient.post('/tuition-policies', data),
  update: (id, data) => axiosClient.put(`/tuition-policies/${id}`, data),
  toggleActive: (id) => axiosClient.patch(`/tuition-policies/${id}/toggle-active`),
  delete: (id) => axiosClient.delete(`/tuition-policies/${id}`),
};

// 18. Student Course Registration API
export const studentRegistrationApi = {
  getAvailableClasses: (semesterId) => axiosClient.get('/students/registration/available-classes', { params: { semesterId } }),
  validateCart: (creditClassIds) => axiosClient.post('/students/registration/cart-validate', { creditClassIds }),
  registerBatch: (creditClassIds, idempotencyKey) => axiosClient.post('/students/registration/register-batch', { creditClassIds, idempotencyKey }),
  dropCourse: (enrollmentId) => axiosClient.post(`/students/registration/drop-class/${enrollmentId}`),
  getMyEnrollments: (semesterId) => axiosClient.get('/students/registration/my-enrollments', { params: { semesterId } }),
};

// 19. Student Personal Portal API
export const studentPortalApi = {
  getMyOverview: () => axiosClient.get('/students/portal/me/overview'),
  getMyTimetable: (semesterId) => axiosClient.get('/students/portal/me/timetable', { params: { semesterId } }),
  getMyTuition: (semesterId) => axiosClient.get('/students/portal/me/tuition', { params: { semesterId } }),
  getAllMyTuition: () => axiosClient.get('/students/portal/me/tuition/all'),
  payTuition: (data) => axiosClient.post('/students/portal/me/tuition/pay', data),
};

// 20. Payment API (PayOS VietQR)
export const paymentApi = {
  createCheckout: (data) => axiosClient.post('/payments/create-checkout', data),
  syncStatus: (orderCode) => axiosClient.post(`/payments/sync-status/${orderCode}`),
  getMyTransactions: () => axiosClient.get('/payments/my-transactions'),
};



