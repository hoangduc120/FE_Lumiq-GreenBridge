import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createMomoPayment, verifyMomoPayment } from '../../api/momoApi';

// Thunk để tạo giao dịch thanh toán Momo
export const createMomoPaymentThunk = createAsyncThunk(
    'momo/createPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await createMomoPayment(paymentData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk để xác thực thanh toán Momo
export const verifyMomoPaymentThunk = createAsyncThunk(
    'momo/verifyPayment',
    async (verifyData, { rejectWithValue }) => {
        try {
            const response = await verifyMomoPayment(verifyData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    paymentUrl: null,
    paymentData: null,
    verificationResult: null,
    loading: false,
    error: null,
    success: false
};

const momoSlice = createSlice({
    name: 'momo',
    initialState,
    reducers: {
        resetPaymentState: (state) => {
            state.paymentUrl = null;
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
            .addCase(createMomoPaymentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMomoPaymentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.paymentData = action.payload.data;
                state.paymentUrl = action.payload.data?.payUrl;
            })
            .addCase(createMomoPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Có lỗi xảy ra khi tạo thanh toán MoMo';
            })

            // Xử lý trạng thái khi xác thực thanh toán
            .addCase(verifyMomoPaymentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyMomoPaymentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.verificationResult = action.payload.data;
            })
            .addCase(verifyMomoPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Có lỗi xảy ra khi xác thực thanh toán MoMo';
            });
    }
});

export const { resetPaymentState, setVerificationResult } = momoSlice.actions;
export default momoSlice.reducer;
