import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000, // Timeout 10s
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

instance.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);

    const token = Cookies.get('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  async (error) => {
    console.error('API Response Error:',
      error.response ? {
        status: error.response.status,
        data: error.response.data
      } : error.message
    );

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return instance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await instance.post('/auth/refresh-token');
        isRefreshing = false;
        processQueue(null);
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('user');
        Cookies.remove('accessToken');
        Cookies.removeItem('refreshToken');
        isRefreshing = false;
        processQueue(refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      const errorMessage = error.response.data?.message || 'Đã xảy ra lỗi khi gọi API';
      toast.error(errorMessage);
    } else if (error.request) {
      toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } else {
      toast.error('Đã xảy ra lỗi khi thiết lập yêu cầu.');
    }

    return Promise.reject(error);
  }
);

export default instance;