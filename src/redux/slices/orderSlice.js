import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Thunk để tạo đơn hàng mới
export const createOrderThunk = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/orders', orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk để lấy danh sách đơn hàng của người dùng
export const getUserOrdersThunk = createAsyncThunk(
    'order/getUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/orders/me');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk để lấy thông tin chi tiết đơn hàng
export const getOrderDetailsThunk = createAsyncThunk(
    'order/getOrderDetails',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    currentOrder: null,
    orders: [],
    orderDetails: null,
    loading: false,
    error: null,
    success: false
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.currentOrder = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý tạo đơn hàng
            .addCase(createOrderThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrderThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentOrder = action.payload.data;
            })
            .addCase(createOrderThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Có lỗi xảy ra khi tạo đơn hàng';
            })

            // Xử lý lấy danh sách đơn hàng
            .addCase(getUserOrdersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data;
            })
            .addCase(getUserOrdersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Có lỗi xảy ra khi lấy danh sách đơn hàng';
            })

            // Xử lý lấy chi tiết đơn hàng
            .addCase(getOrderDetailsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderDetailsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload.data;
            })
            .addCase(getOrderDetailsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Có lỗi xảy ra khi lấy chi tiết đơn hàng';
            });
    }
});

export const { resetOrderState, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
