import instance from "./axios";

// API endpoints cho cart - đơn giản và hiệu quả
export const getCart = async () => {
    try {
        const response = await instance.get('/cart', {
            timeout: 10000, // Tăng timeout lên 10s cho get cart
        });
        return response.data;
    } catch (error) {

        if (error.code === 'ECONNABORTED') {
            throw new Error('Kết nối tới server quá chậm. Vui lòng kiểm tra kết nối.');
        }

        if (error.message === 'Network Error') {
            throw new Error('Không thể kết nối tới server. Vui lòng kiểm tra backend.');
        }

        if (error.response?.status === 401) {
            throw new Error('Vui lòng đăng nhập để xem giỏ hàng.');
        }

        if (error.response?.status === 404) {
            return {
                success: true,
                data: {
                    cart: {
                        items: [],
                        totalQuantity: 0,
                        totalAmount: 0
                    }
                }
            };
        }

        throw error;
    }
};

export const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await instance.post('/cart/add', {
            productId,
            quantity
        }, {
            timeout: 10000, // Tăng timeout
        });
        return response.data;
    } catch (error) {

        if (error.code === 'ECONNABORTED') {
            throw new Error('Kết nối quá chậm. Vui lòng thử lại.');
        }

        if (error.message === 'Network Error') {
            throw new Error('Không thể kết nối tới server.');
        }

        if (error.response?.status === 401) {
            throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
        }

        throw error;
    }
};

export const removeFromCart = async (productId) => {
    try {
        const response = await instance.delete('/cart/item', {
            data: { productId },
            timeout: 10000,
        });
        return response.data;
    } catch (error) {

        if (error.code === 'ECONNABORTED') {
            throw new Error('Kết nối quá chậm. Vui lòng thử lại.');
        }

        if (error.message === 'Network Error') {
            throw new Error('Không thể kết nối tới server.');
        }

        throw error;
    }
};

// Thêm API function để xóa multiple items
export const removeMultipleFromCart = async (productIds) => {
    try {
        const response = await instance.delete('/cart/items', {
            data: { productIds },
            timeout: 10000,
        });
        return response.data;
    } catch (error) {

        if (error.code === 'ECONNABORTED') {
            throw new Error('Kết nối quá chậm. Vui lòng thử lại.');
        }

        if (error.message === 'Network Error') {
            throw new Error('Không thể kết nối tới server.');
        }

        if (error.response?.status === 401) {
            throw new Error('Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng.');
        }

        throw error;
    }
};

export const clearCart = async () => {
    try {
        const response = await instance.delete('/cart/clear', {
            timeout: 10000,
        });
        return response.data;
    } catch (error) {

        if (error.code === 'ECONNABORTED') {
            throw new Error('Kết nối quá chậm. Vui lòng thử lại.');
        }

        if (error.message === 'Network Error') {
            throw new Error('Không thể kết nối tới server.');
        }

        throw error;
    }
}; 