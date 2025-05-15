import axios from "axios";

const BASE_URL = "http://localhost:5000/auth";

export const loginEmail = async (email, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginGoogle = () => {
  window.location.href = `${BASE_URL}/google`;
};

export const register = async (email, password, confirmPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
