import instance from "./axios";

// API endpoints cho orders
export const createOrder = async (orderData) => {
    try {
        const response = await instance.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Create order API error:', error.message);
        throw error;
    }
};

export const getUserOrders = async () => {
    try {
        const response = await instance.get('/orders/my-orders');
        return response.data;
    } catch (error) {
        console.error('Get user orders API error:', error.message);
        throw error;
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await instance.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Get order by ID API error:', error.message);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status, paymentStatus) => {
    try {
        const response = await instance.patch(`/orders/${orderId}/status`, {
            status,
            paymentStatus
        });
        return response.data;
    } catch (error) {
        console.error('Update order status API error:', error.message);
        throw error;
    }
}; 