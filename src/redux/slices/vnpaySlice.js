import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createVnPayPayment, verifyVnPayPayment } from '../../api/vnpayApi';
import { toast } from 'react-toastify';

// Thunk action để tạo thanh toán VNPay
export const createVnPayPaymentThunk = createAsyncThunk(
    'vnpay/createPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            console.log('vnpaySlice: Creating payment with data:', paymentData);
            const response = await createVnPayPayment(paymentData);
            console.log('vnpaySlice: Payment response:', response);

            // Kiểm tra cấu trúc response
            if (!response || !response.success) {
                console.error('vnpaySlice: Invalid response structure:', response);
                return rejectWithValue('Không nhận được phản hồi thành công từ máy chủ');
            }

            return response;
        } catch (error) {
            console.error('vnpaySlice: Payment error:', error);
            const errorMessage = error.response?.data?.message || 'Lỗi khi tạo thanh toán';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// Thunk action để xác thực thanh toán VNPay
export const verifyVnPayPaymentThunk = createAsyncThunk(
    'vnpay/verifyPayment',
    async (verifyData, { rejectWithValue }) => {
        try {
            console.log('vnpaySlice: Verifying payment with data:', verifyData);
            const response = await verifyVnPayPayment(verifyData);
            console.log('vnpaySlice: Verify response:', response);

            if (!response || !response.success) {
                console.error('vnpaySlice: Invalid verify response structure:', response);
                return rejectWithValue('Không nhận được phản hồi thành công từ máy chủ');
            }

            return response;
        } catch (error) {
            console.error('vnpaySlice: Verify error:', error);
            const errorMessage = error.response?.data?.message || 'Lỗi khi xác thực thanh toán';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
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

const vnpaySlice = createSlice({
    name: 'vnpay',
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
            .addCase(createVnPayPaymentThunk.pending, (state) => {
                console.log('vnpaySlice: Payment pending');
                state.paymentLoading = true;
                state.paymentError = null;
            })
            .addCase(createVnPayPaymentThunk.fulfilled, (state, action) => {
                console.log('vnpaySlice: Payment fulfilled with data:', action.payload);
                state.paymentLoading = false;
                state.paymentData = action.payload;

                // Kiểm tra và gán paymentUrl
                if (action.payload?.data?.paymentUrl) {
                    state.paymentUrl = action.payload.data.paymentUrl;
                    console.log('vnpaySlice: Setting payment URL:', state.paymentUrl);
                } else {
                    console.warn('vnpaySlice: No paymentUrl found in response');
                    toast.error('Không tìm thấy URL thanh toán');
                }

                state.paymentError = null;
            })
            .addCase(createVnPayPaymentThunk.rejected, (state, action) => {
                console.error('vnpaySlice: Payment rejected with error:', action.payload);
                state.paymentLoading = false;
                state.paymentError = action.payload || 'Lỗi không xác định';
                toast.error(state.paymentError);
            })

            // Xử lý trạng thái xác thực thanh toán
            .addCase(verifyVnPayPaymentThunk.pending, (state) => {
                console.log('vnpaySlice: Verify pending');
                state.verifyLoading = true;
                state.verifyError = null;
            })
            .addCase(verifyVnPayPaymentThunk.fulfilled, (state, action) => {
                console.log('vnpaySlice: Verify fulfilled with data:', action.payload);
                state.verifyLoading = false;
                state.verifyData = action.payload;
                state.paymentStatus = action.payload.success ? 'success' : 'failed';
                state.verifyError = null;

                if (state.paymentStatus === 'success') {
                    toast.success('Thanh toán đã được xác thực thành công!');
                } else {
                    toast.error('Xác thực thanh toán thất bại');
                }
            })
            .addCase(verifyVnPayPaymentThunk.rejected, (state, action) => {
                console.error('vnpaySlice: Verify rejected with error:', action.payload);
                state.verifyLoading = false;
                state.verifyError = action.payload || 'Lỗi không xác định';
                state.paymentStatus = 'failed';
                toast.error(state.verifyError);
            });
    }
});

export const { resetPaymentState, resetVerifyState, resetAllState } = vnpaySlice.actions;

export default vnpaySlice.reducer; 