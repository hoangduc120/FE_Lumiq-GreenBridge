import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createMomoPayment, verifyMomoPayment } from '../../api/momoApi';

// Thunk action để tạo thanh toán MoMo
export const createMomoPaymentThunk = createAsyncThunk(
    'momo/createPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await createMomoPayment(paymentData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo thanh toán');
        }
    }
);

// Thunk action để xác thực thanh toán MoMo
export const verifyMomoPaymentThunk = createAsyncThunk(
    'momo/verifyPayment',
    async (verifyData, { rejectWithValue }) => {
        try {
            const response = await verifyMomoPayment(verifyData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi xác thực thanh toán');
        }
    }
);

const initialState = {
    paymentLoading: false,
    paymentError: null,
    paymentData: null,
    paymentUrl: null,
    verifyLoading: false,
    verifyError: null,
    verifyData: null,
    paymentStatus: null
};

const momoSlice = createSlice({
    name: 'momo',
    initialState,
    reducers: {
        resetPaymentState: (state) => {
            state.paymentLoading = false;
            state.paymentError = null;
            state.paymentData = null;
            state.paymentUrl = null;
        },
        resetVerifyState: (state) => {
            state.verifyLoading = false;
            state.verifyError = null;
            state.verifyData = null;
            state.paymentStatus = null;
        },
        resetAllState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            // Xử lý trạng thái tạo thanh toán
            .addCase(createMomoPaymentThunk.pending, (state) => {
                state.paymentLoading = true;
                state.paymentError = null;
            })
            .addCase(createMomoPaymentThunk.fulfilled, (state, action) => {
                state.paymentLoading = false;
                state.paymentData = action.payload;
                state.paymentUrl = action.payload.data?.payUrl;
                state.paymentError = null;
            })
            .addCase(createMomoPaymentThunk.rejected, (state, action) => {
                state.paymentLoading = false;
                state.paymentError = action.payload || 'Lỗi không xác định';
            })

            // Xử lý trạng thái xác thực thanh toán
            .addCase(verifyMomoPaymentThunk.pending, (state) => {
                state.verifyLoading = true;
                state.verifyError = null;
            })
            .addCase(verifyMomoPaymentThunk.fulfilled, (state, action) => {
                state.verifyLoading = false;
                state.verifyData = action.payload;
                state.paymentStatus = action.payload.success ? 'success' : 'failed';
                state.verifyError = null;
            })
            .addCase(verifyMomoPaymentThunk.rejected, (state, action) => {
                state.verifyLoading = false;
                state.verifyError = action.payload || 'Lỗi không xác định';
                state.paymentStatus = 'failed';
            });
    }
});

export const { resetPaymentState, resetVerifyState, resetAllState } = momoSlice.actions;

export default momoSlice.reducer;
