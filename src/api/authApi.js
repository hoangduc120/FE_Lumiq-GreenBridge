import axiosInstance from './axios';
import axios from 'axios';

const BASE_URL = "http://localhost:5000/auth";

export const loginEmail = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post('/auth/logout');
    // Xóa thông tin user trong localStorage
    localStorage.removeItem('user');
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginGoogle = () => {
  window.location.href = `${BASE_URL}/google`;
};

export const register = async (email, password, confirmPassword) => {
  try {
    const response = await axiosInstance.post('/auth/register', {
      email,
      password,
      confirmPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/auth/refresh-token');
    return response;
  } catch (error) {
    throw error;
  }
};
