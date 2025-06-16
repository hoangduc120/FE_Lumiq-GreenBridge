import instance from "./axios";

// API endpoints cho cart - đơn giản và hiệu quả
export const getCart = async () => {
    try {
        const response = await instance.get('/cart');
        return response.data;
    } catch (error) {
        throw new Error('Không thể lấy giỏ hàng.');
    }
};

export const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await instance.post('/cart/add', {
            productId,
            quantity
        });
        return response.data;
    } catch (error) {

        throw new Error('Không thể thêm sản phẩm vào giỏ hàng.');
    }
};

export const removeFromCart = async (productId) => {
    try {
        const response = await instance.delete('/cart/item', {
            data: { productId },
        });
        return response.data;
    } catch (error) {
        throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng.');
    }
};

// Thêm API function để xóa multiple items
export const removeMultipleFromCart = async (productIds) => {
    try {
        const response = await instance.delete('/cart/items', {
            data: { productIds },
        });
        return response.data;
    } catch (error) {
        throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng.');
    }
};

export const clearCart = async () => {
    try {
        const response = await instance.delete('/cart/clear');
        return response.data;
    } catch (error) {
        throw new Error('Không thể xóa giỏ hàng.');
    }
}; 