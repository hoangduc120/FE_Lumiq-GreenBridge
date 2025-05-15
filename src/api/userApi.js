import instance from './axios';

const BASE_URL = 'http://localhost:5000/user';

export const getUserById = async (id) => {
  try {
    console.log('Fetching user with ID:', id); // Log request
    const response = await instance.get(`${BASE_URL}/${id}`);
    console.log('User:', response.data.user);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};