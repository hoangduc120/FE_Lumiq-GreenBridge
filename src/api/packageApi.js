import instance from "./axios";

const packageApi = {
  create: async (packageData) => {
    try {
      const response = await instance.post("/subscription-plan", packageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAll: async () => {
    try {
      const response = await instance.get("/subscription-plan");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (id) => {
    try {
      const response = await instance.get(`${"/subscription-plan"}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, packageData) => {
    try {
      const response = await instance.put(
        `${"/subscription-plan"}/${id}`,
        packageData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await instance.delete(`${"/subscription-plan"}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  register: async (id, userId) => {
    try {
      const response = await instance.post(
        `${"/subscription-plan"}/${id}/register`,
        { userId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default packageApi;
