import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createVnPayPayment, verifyVnPayPayment } from '../../api/vnpayApi';

// Thunk để tạo giao dịch thanh toán VNPay
export const createVnPayPaymentThunk = createAsyncThunk(
    'vnpay/createPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await createVnPayPayment(paymentData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk để xác thực thanh toán VNPay
export const verifyVnPayPaymentThunk = createAsyncThunk(
    'vnpay/verifyPayment',
    async (verifyData, { rejectWithValue }) => {
        try {
            const response = await verifyVnPayPayment(verifyData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    redirectUrl: null,
    paymentData: null,
    verificationResult: null,
    loading: false,
    error: null,
    success: false
};

const vnpaySlice = createSlice({
    name: 'vnpay',
    initialState,
    reducers: {
        resetPaymentState: (state) => {
            state.redirectUrl = null;
            state.paymentData = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        setVerificationResult: (state, action) => {
            state.verificationResult = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý trạng thái khi tạo giao dịch thanh toán
            .addCase(createVnPayPaymentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVnPayPaymentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.paymentData = action.payload.data;
                state.redirectUrl = action.payload.data?.redirectUrl;
            })
            .addCase(createVnPayPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Có lỗi xảy ra khi tạo thanh toán VNPay';
            })

            // Xử lý trạng thái khi xác thực thanh toán
            .addCase(verifyVnPayPaymentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyVnPayPaymentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.verificationResult = action.payload.data;
            })
            .addCase(verifyVnPayPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Có lỗi xảy ra khi xác thực thanh toán VNPay';
            });
    }
});

export const { resetPaymentState, setVerificationResult } = vnpaySlice.actions;
export default vnpaySlice.reducer;
