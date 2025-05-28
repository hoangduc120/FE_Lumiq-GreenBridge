import instance from "./axios";

const voucherApi = {
  create: async (voucherData) => {
    try {
      const response = await instance.post("/voucher", voucherData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAll: async () => {
    try {
      const response = await instance.get("/voucher");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (id) => {
    try {
      const response = await instance.get(`/voucher/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getByCode: async (voucherCode) => {
    try {
      const response = await instance.get(`/voucher/code/${voucherCode}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, voucherData) => {
    try {
      const response = await instance.put(`/voucher/${id}`, voucherData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await instance.delete(`/voucher/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default voucherApi;
