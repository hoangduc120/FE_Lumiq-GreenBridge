import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderApi from '../../api/orderApi';

// Async thunks cho các API order
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await orderApi.createOrder(orderData);
            return response.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tạo đơn hàng');
        }
    }
);

export const fetchUserOrders = createAsyncThunk(
    'order/fetchUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderApi.getUserOrders();
            return response.orders;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'order/fetchOrderById',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await orderApi.getOrderById(orderId);
            return response.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy chi tiết đơn hàng');
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'order/updateOrderStatus',
    async ({ orderId, status, paymentStatus }, { rejectWithValue }) => {
        try {
            const response = await orderApi.updateOrderStatus(orderId, status, paymentStatus);
            return response.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
        }
    }
);

const initialState = {
    orders: [],
    currentOrder: null,
    orderDetail: null,
    loading: false,
    createLoading: false,
    detailLoading: false,
    updateLoading: false,
    error: null,
    createError: null,
    detailError: null,
    updateError: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.createError = null;
            state.detailError = null;
            state.updateError = null;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearOrderDetail: (state) => {
            state.orderDetail = null;
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.createLoading = false;
                state.currentOrder = action.payload;
                // Thêm đơn hàng mới vào đầu danh sách
                state.orders.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })

            // Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload || [];
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.detailLoading = true;
                state.detailError = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.orderDetail = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.detailLoading = false;
                state.detailError = action.payload;
            })

            // Update order status
            .addCase(updateOrderStatus.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedOrder = action.payload;

                // Cập nhật trong danh sách orders
                const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
                if (orderIndex !== -1) {
                    state.orders[orderIndex] = updatedOrder;
                }

                // Cập nhật orderDetail nếu đang xem chi tiết đơn hàng này
                if (state.orderDetail && state.orderDetail._id === updatedOrder._id) {
                    state.orderDetail = updatedOrder;
                }

                // Cập nhật currentOrder nếu đây là đơn hàng hiện tại
                if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
                    state.currentOrder = updatedOrder;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            });
    },
});

export const {
    clearErrors,
    clearCurrentOrder,
    clearOrderDetail,
    setCurrentOrder
} = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.order.orders;
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderDetail = (state) => state.order.orderDetail;
export const selectOrderLoading = (state) => state.order.loading;
export const selectCreateOrderLoading = (state) => state.order.createLoading;
export const selectDetailLoading = (state) => state.order.detailLoading;
export const selectUpdateLoading = (state) => state.order.updateLoading;
export const selectOrderError = (state) => state.order.error;
export const selectCreateOrderError = (state) => state.order.createError;
export const selectDetailError = (state) => state.order.detailError;
export const selectUpdateError = (state) => state.order.updateError;

// Selector để lấy đơn hàng theo status
export const selectOrdersByStatus = (status) => (state) =>
    state.order.orders.filter(order => order.status === status);

// Selector để lấy đơn hàng theo payment status
export const selectOrdersByPaymentStatus = (paymentStatus) => (state) =>
    state.order.orders.filter(order => order.paymentStatus === paymentStatus);

export default orderSlice.reducer;
