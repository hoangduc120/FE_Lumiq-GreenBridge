import instance from './axios';

const BASE_URL = 'http://localhost:5000/user';

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