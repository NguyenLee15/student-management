import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Memory storage for JWT token (more secure than localStorage against XSS)
let memoryToken = null;

export const setMemoryToken = (token) => {
  memoryToken = token;
};

export const getMemoryToken = () => memoryToken;

// Request interceptor to automatically add Authorization: Bearer <token>
axiosClient.interceptors.request.use(
  (config) => {
    if (memoryToken) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      return response.data;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi không xác định';
    
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest._retry = true;
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        axios
          .post(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/refresh`, {}, { withCredentials: true })
          .then(({ data }) => {
            const token = data?.data?.token;
            
            if (token) {
              setMemoryToken(token);
              
              axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + token;
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              
              processQueue(null, token);
              resolve(axiosClient(originalRequest));
            } else {
              throw new Error('Máy chủ không trả về mã xác thực');
            }
          })
          .catch((err) => {
            processQueue(err, null);
            handleLogout();
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    if (status === 403) {
      console.warn('Từ chối truy cập (403): Không đủ quyền.');
      window.dispatchEvent(new CustomEvent('auth:forbidden', { detail: message }));
      return Promise.reject({ status, message: 'Bạn không có quyền thực hiện thao tác này.', raw: error });
    }

    if (status === 429) {
      console.warn('Vượt quá giới hạn yêu cầu (429): Thao tác quá nhanh.');
      window.dispatchEvent(new CustomEvent('auth:ratelimit', { 
        detail: message || 'Quá nhiều yêu cầu! Vui lòng thao tác chậm lại.' 
      }));
      return Promise.reject({ status, message: 'Quá nhiều yêu cầu! Vui lòng thao tác chậm lại.', raw: error });
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.warn('Yêu cầu hết thời gian chờ (Timeout).');
      return Promise.reject({ status: 408, message: 'Kết nối mạng quá hạn hoặc máy chủ phản hồi chậm. Vui lòng thử lại.', raw: error });
    }

    if (!error.response) {
      console.warn('Mất kết nối mạng hoặc máy chủ không phản hồi.');
      return Promise.reject({ status: 0, message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng.', raw: error });
    }
    
    // Import msg dynamically if needed, or just safe fallback
    const hasVietnamese = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(message);
    const safeMsg = hasVietnamese ? message : 'Đã xảy ra lỗi không xác định (hệ thống)';
    return Promise.reject({ status, message: safeMsg, raw: error });
  }
);

const handleLogout = () => {
  console.warn('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
  setMemoryToken(null);
  localStorage.removeItem('user_info');
  window.dispatchEvent(new Event('auth:unauthorized'));
};

export default axiosClient;
