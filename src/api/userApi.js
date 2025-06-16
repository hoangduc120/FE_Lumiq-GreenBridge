import instance from './axios';

const BASE_URL = 'https://be-lumiq-greenbrige-a0kh.onrender.com/user';

export const getUserById = async (id) => {
  try {
    const response = await instance.get(`${BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data.data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUserById = async (id, data) => {
  try {
    const response = await instance.put(`${BASE_URL}/${id}`, data, {
      withCredentials: true,
    });
    return response.data.data.user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
