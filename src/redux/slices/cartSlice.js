import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartApi from '../../api/cartApi';

// Async thunks cho các API cart
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartApi.getCart();
            // Backend trả về: { success: true, data: { cart: {...} } }
            return response.data?.cart || response.data;
        } catch (error) {
            // Nếu là lỗi 404 (chưa có cart), return empty cart thay vì reject
            if (error.message?.includes('404') || error.message?.includes('Cart not found')) {
                return {
                    items: [],
                    totalQuantity: 0,
                    totalAmount: 0
                };
            }

            // Nếu là lỗi network/timeout, return empty cart để không block UI
            if (error.message?.includes('Network Error') ||
                error.message?.includes('timeout') ||
                error.message?.includes('ECONNABORTED')) {
                console.warn('Backend không kết nối được, sử dụng empty cart');
                return {
                    items: [],
                    totalQuantity: 0,
                    totalAmount: 0
                };
            }

            return rejectWithValue(error.message || 'Không thể lấy giỏ hàng');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity = 1 }, { rejectWithValue }) => {
        try {
            const response = await cartApi.addToCart(productId, quantity);
            // Backend trả về: { success: true, data: {...} }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng');
        }
    }
);

// Buy Now - thêm sản phẩm vào cart và return success để navigate
export const buyNow = createAsyncThunk(
    'cart/buyNow',
    async ({ productId, quantity = 1 }, { rejectWithValue }) => {
        try {
            const response = await cartApi.addToCart(productId, quantity);
            return {
                ...response.data, // Cart data từ backend
                shouldNavigateToCart: true
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể thực hiện mua ngay');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await cartApi.removeFromCart(productId);
            // Backend trả về: { success: true, data: { cart: {...} } }
            return response.data?.cart || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
        }
    }
);

// Thêm action để xóa multiple items
export const removeMultipleFromCart = createAsyncThunk(
    'cart/removeMultipleFromCart',
    async (productIds, { rejectWithValue }) => {
        try {
            const response = await cartApi.removeMultipleFromCart(productIds);
            // Backend trả về: { success: true, data: { cart: {...} } }
            return response.data?.cart || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể xóa các sản phẩm khỏi giỏ hàng');
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartApi.clearCart();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể xóa giỏ hàng');
        }
    }
);

const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    loading: false,
    error: null,
    shouldNavigateToCart: false, // Thêm flag để handle navigation
    isFetched: false, // Flag để track đã fetch cart chưa
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearNavigationFlag: (state) => {
            state.shouldNavigateToCart = false;
        },
        updateCartTotals: (state) => {
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
        },
        updateCartTotalsUnique: (state) => {
            // Cập nhật số lượng sản phẩm khác nhau (không phụ thuộc vào quantity)
            state.totalQuantity = state.items.length;
            // Chỉ tính lại totalAmount nếu không có từ backend
            if (!state.totalAmount || state.totalAmount === 0) {
                state.totalAmount = state.items.reduce((total, item) => {
                    const price = item.productId?.price || 0;
                    const quantity = item.quantity || 1;
                    return total + (price * quantity);
                }, 0);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                state.totalAmount = action.payload?.totalPrice || 0;
                state.totalQuantity = action.payload?.items?.length || 0;
                state.isFetched = true;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                // Backend trả về cart object với items và totalPrice
                if (action.payload) {
                    state.items = action.payload.items || state.items;
                    state.totalAmount = action.payload.totalPrice || state.totalAmount;
                    state.totalQuantity = action.payload.items?.length || state.items.length;
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Buy now
            .addCase(buyNow.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.shouldNavigateToCart = false;
            })
            .addCase(buyNow.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    // Backend trả về cart object với items và totalPrice
                    if (action.payload.items) {
                        state.items = action.payload.items;
                        state.totalAmount = action.payload.totalPrice || state.totalAmount;
                        state.totalQuantity = action.payload.items.length;
                    }
                    state.shouldNavigateToCart = action.payload.shouldNavigateToCart || false;
                }
            })
            .addCase(buyNow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.shouldNavigateToCart = false;
            })

            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                state.totalAmount = action.payload?.totalPrice || 0;
                state.totalQuantity = action.payload?.items?.length || 0;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove multiple from cart
            .addCase(removeMultipleFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeMultipleFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                state.totalAmount = action.payload?.totalPrice || 0;
                state.totalQuantity = action.payload?.items?.length || 0;
            })
            .addCase(removeMultipleFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Clear cart
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.totalQuantity = 0;
                state.totalAmount = 0;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearNavigationFlag, updateCartTotals, updateCartTotalsUnique } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectShouldNavigateToCart = (state) => state.cart.shouldNavigateToCart;
export const selectCartIsFetched = (state) => state.cart.isFetched;

// Selector mới để đếm số lượng sản phẩm khác nhau
export const selectCartUniqueItemsCount = (state) => state.cart.items.length;

export default cartSlice.reducer;
