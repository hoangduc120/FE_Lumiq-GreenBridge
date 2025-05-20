import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
    totalAmount: localStorage.getItem('totalAmount')
        ? JSON.parse(localStorage.getItem('totalAmount'))
        : 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItemIndex = state.cartItems.findIndex(
                (item) => item.id === newItem.id
            );

            if (existingItemIndex >= 0) {
                state.cartItems[existingItemIndex].quantity += newItem.quantity || 1;
            } else {
                state.cartItems.push({ ...newItem, quantity: newItem.quantity || 1 });
            }

            // Cập nhật tổng số tiền
            state.totalAmount = state.cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            // Lưu vào localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            localStorage.setItem('totalAmount', JSON.stringify(state.totalAmount));
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.cartItems = state.cartItems.filter((item) => item.id !== id);

            // Cập nhật tổng số tiền
            state.totalAmount = state.cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            // Lưu vào localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            localStorage.setItem('totalAmount', JSON.stringify(state.totalAmount));
        },
        updateCartItemQuantity: (state, action) => {
            const { itemId, quantity } = action.payload;
            const itemIndex = state.cartItems.findIndex((item) => item.id === itemId);

            if (itemIndex >= 0 && quantity > 0) {
                state.cartItems[itemIndex].quantity = quantity;

                // Cập nhật tổng số tiền
                state.totalAmount = state.cartItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );

                // Lưu vào localStorage
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
                localStorage.setItem('totalAmount', JSON.stringify(state.totalAmount));
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalAmount = 0;

            // Xóa khỏi localStorage
            localStorage.removeItem('cartItems');
            localStorage.removeItem('totalAmount');
        }
    },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
