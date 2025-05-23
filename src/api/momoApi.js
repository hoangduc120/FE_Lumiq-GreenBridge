import axiosInstance from './axios';


export const createMomoPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post('/payment/momo', paymentData);

        // Kiểm tra cấu trúc response
        if (response.data && response.data.data && response.data.data.payUrl) {
        } else {
            console.error('PayUrl not found in response. Response structure:', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.status, error.response.data);
        }
        throw error;
    }
};


export const verifyMomoPayment = async (verifyData) => {
    try {
        const response = await axiosInstance.post('/payment/momo/verify', verifyData);
        return response.data;
    } catch (error) {
        console.error('Error verifying MoMo payment:', error);
        if (error.response) {
            console.error('Error response:', error.response.status, error.response.data);
        }
        throw error;
    }
};
