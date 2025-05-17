import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Lưu tất cả các request đang chờ xử lý khi refresh token
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

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
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
        // Lấy refreshToken từ cookie hoặc localStorage nếu cần
        await instance.post('/auth/refresh-token');

        // Đặt lại flag
        isRefreshing = false;

        // Xử lý các request đang chờ
        processQueue(null);

        // Thực hiện lại request ban đầu
        return instance(originalRequest);
      } catch (refreshError) {
        // Xử lý khi refresh token thất bại
        console.error('Refresh token failed:', refreshError);

        // Thông báo lỗi
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');

        // Xóa thông tin user trong localStorage
        localStorage.removeItem('user');

        // Đặt lại flag
        isRefreshing = false;

        // Xử lý các request đang chờ với lỗi
        processQueue(refreshError);

        // Chuyển hướng đến trang đăng nhập
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;