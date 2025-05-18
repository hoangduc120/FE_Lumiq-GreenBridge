import axiosInstance from './axios';

/**
 * Tạo giao dịch thanh toán MoMo
 * @param {Object} paymentData - Dữ liệu thanh toán
 * @param {number} paymentData.amount - Số tiền thanh toán
 * @param {string} paymentData.orderId - Mã đơn hàng (không bắt buộc)
 * @returns {Promise<Object>} - Kết quả từ API MoMo
 */
export const createMomoPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post('/payment/momo', paymentData);

        // Kiểm tra cấu trúc response
        if (response.data && response.data.data && response.data.data.payUrl) {
        } else {
            console.warn('PayUrl not found in response. Response structure:', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        console.error('Error creating MoMo payment:', error);
        if (error.response) {
            console.error('Error response:', error.response.status, error.response.data);
        }
        throw error;
    }
};

/**
 * Xác thực kết quả thanh toán từ MoMo
 * @param {Object} verifyData - Dữ liệu xác thực
 * @returns {Promise<Object>} - Kết quả xác thực
 */
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
