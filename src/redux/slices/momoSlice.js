import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createMomoPayment, verifyMomoPayment } from '../../api/momoApi';
import { toast } from 'react-toastify';

// Thunk action để tạo thanh toán MoMo
export const createMomoPaymentThunk = createAsyncThunk(
    'momo/createPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            console.log('momoSlice: Creating payment with data:', paymentData);
            const response = await createMomoPayment(paymentData);
            console.log('momoSlice: Payment response:', response);

            // Kiểm tra cấu trúc response
            if (!response || !response.success) {
                console.error('momoSlice: Invalid response structure:', response);
                return rejectWithValue('Không nhận được phản hồi thành công từ máy chủ');
            }

            return response;
        } catch (error) {
            console.error('momoSlice: Payment error:', error);
            const errorMessage = error.response?.data?.message || 'Lỗi khi tạo thanh toán';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// Thunk action để xác thực thanh toán MoMo
export const verifyMomoPaymentThunk = createAsyncThunk(
    'momo/verifyPayment',
    async (verifyData, { rejectWithValue }) => {
        try {
            console.log('momoSlice: Verifying payment with data:', verifyData);
            const response = await verifyMomoPayment(verifyData);
            console.log('momoSlice: Verify response:', response);

            if (!response || !response.success) {
                console.error('momoSlice: Invalid verify response structure:', response);
                return rejectWithValue('Không nhận được phản hồi thành công từ máy chủ');
            }

            return response;
        } catch (error) {
            console.error('momoSlice: Verify error:', error);
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
                console.log('momoSlice: Payment pending');
                state.paymentLoading = true;
                state.paymentError = null;
            })
            .addCase(createMomoPaymentThunk.fulfilled, (state, action) => {
                console.log('momoSlice: Payment fulfilled with data:', action.payload);
                state.paymentLoading = false;
                state.paymentData = action.payload;

                // Kiểm tra và gán payUrl
                if (action.payload?.data?.payUrl) {
                    state.paymentUrl = action.payload.data.payUrl;
                    console.log('momoSlice: Setting payment URL:', state.paymentUrl);
                } else {
                    console.warn('momoSlice: No payUrl found in response');
                    toast.error('Không tìm thấy URL thanh toán');
                }

                state.paymentError = null;
            })
            .addCase(createMomoPaymentThunk.rejected, (state, action) => {
                console.error('momoSlice: Payment rejected with error:', action.payload);
                state.paymentLoading = false;
                state.paymentError = action.payload || 'Lỗi không xác định';
                toast.error(state.paymentError);
            })

            // Xử lý trạng thái xác thực thanh toán
            .addCase(verifyMomoPaymentThunk.pending, (state) => {
                console.log('momoSlice: Verify pending');
                state.verifyLoading = true;
                state.verifyError = null;
            })
            .addCase(verifyMomoPaymentThunk.fulfilled, (state, action) => {
                console.log('momoSlice: Verify fulfilled with data:', action.payload);
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
            .addCase(verifyMomoPaymentThunk.rejected, (state, action) => {
                console.error('momoSlice: Verify rejected with error:', action.payload);
                state.verifyLoading = false;
                state.verifyError = action.payload || 'Lỗi không xác định';
                state.paymentStatus = 'failed';
                toast.error(state.verifyError);
            });
    }
});

export const { resetPaymentState, resetVerifyState, resetAllState } = momoSlice.actions;

export default momoSlice.reducer;
