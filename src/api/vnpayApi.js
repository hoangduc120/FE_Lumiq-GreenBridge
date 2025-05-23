import axiosInstance from './axios';


export const createVnPayPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post('/payment/vnpay', paymentData);

        // Kiểm tra cấu trúc response
        if (response.data && response.data.data && response.data.data.paymentUrl) {
        } else {
            console.error('Payment URL not found in response. Response structure:', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.status, error.response.data);
        }
        throw error;
    }
};


export const verifyVnPayPayment = async (verifyData) => {
    try {
        const response = await axiosInstance.post('/payment/vnpay/verify', verifyData);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.status, error.response.data);
        }
        throw error;
    }
}; 