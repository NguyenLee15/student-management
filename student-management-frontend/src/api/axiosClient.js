import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to automatically add Authorization: Bearer <token>
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common response formatting & 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => {
    // If backend returns ApiResponse structure { status, message, data }
    if (response.data && response.data.data !== undefined) {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message || 'Something went wrong';
    
    if (status === 401) {
      // Auto handle token expiration
      console.warn('Session expired or unauthorized. Please re-login.');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    
    return Promise.reject({ status, message, raw: error });
  }
);

export default axiosClient;
