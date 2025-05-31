import instance from "./axios";

const chatbotApi = {
  ask: async (data) => {
    try {
      const response = await instance.post("/bot/ask", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default chatbotApi;
