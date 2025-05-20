import axiosInstance from './axios';

/**
 * Tạo giao dịch thanh toán VNPay
 * @param {Object} paymentData - Dữ liệu thanh toán
 * @param {number} paymentData.amount - Số tiền thanh toán
 * @param {string} paymentData.orderId - Mã đơn hàng (không bắt buộc)
 * @param {Array} paymentData.items - Danh sách sản phẩm (không bắt buộc)
 * @returns {Promise<Object>} - Kết quả từ API VNPay
 */
export const createVnPayPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post('/payment/vnpay', paymentData);

        // Kiểm tra cấu trúc response
        if (response.data && response.data.data && response.data.data.paymentUrl) {
        } else {
            console.warn('Payment URL not found in response. Response structure:', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        console.error('Error creating VNPay payment:', error);
        if (error.response) {
            console.error('Error response:', error.response.status, error.response.data);
        }
        throw error;
    }
};

/**
 * Xác thực kết quả thanh toán từ VNPay
 * @param {Object} verifyData - Dữ liệu xác thực
 * @returns {Promise<Object>} - Kết quả xác thực
 */
export const verifyVnPayPayment = async (verifyData) => {
    try {
        const response = await axiosInstance.post('/payment/vnpay/verify', verifyData);
        return response.data;
    } catch (error) {
        console.error('Error verifying VNPay payment:', error);
        if (error.response) {
            console.error('Error response:', error.response.status, error.response.data);
        }
        throw error;
    }
}; 