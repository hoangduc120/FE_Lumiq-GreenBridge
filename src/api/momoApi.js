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
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo thanh toán MoMo:', error);
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
        console.error('Lỗi khi xác thực thanh toán MoMo:', error);
        throw error;
    }
};
