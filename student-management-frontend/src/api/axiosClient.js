import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
    const message = error?.response?.data?.message || error?.message || 'Something went wrong';
    
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
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
          .post('/api/v1/auth/refresh', {}, { withCredentials: true })
          .then(({ data }) => {
            const token = data?.data?.token;
            
            if (token) {
              localStorage.setItem('jwt_token', token);
              
              axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + token;
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              
              processQueue(null, token);
              resolve(axiosClient(originalRequest));
            } else {
              throw new Error('No token returned');
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
      console.warn('Forbidden access.');
      window.dispatchEvent(new CustomEvent('auth:forbidden', { detail: message }));
      return Promise.reject({ status, message: 'You do not have permission to perform this action.', raw: error });
    }

    if (status === 429) {
      console.warn('Rate limit exceeded.');
      window.dispatchEvent(new CustomEvent('auth:ratelimit', { 
        detail: message || 'Too many requests. Please wait a moment before trying again.' 
      }));
      return Promise.reject({ status, message: 'Too many requests (Rate limit exceeded).', raw: error });
    }
    
    return Promise.reject({ status, message, raw: error });
  }
);

const handleLogout = () => {
  console.warn('Session expired or unauthorized. Please re-login.');
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_info');
  window.dispatchEvent(new Event('auth:unauthorized'));
};

export default axiosClient;
