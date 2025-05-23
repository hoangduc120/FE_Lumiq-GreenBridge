import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { verifyMomoPaymentThunk, resetPaymentState as resetMomoState } from '../redux/slices/momoSlice';
import { verifyVnPayPaymentThunk, resetPaymentState as resetVnpayState } from '../redux/slices/vnpaySlice';
import { clearCart } from '../redux/slices/cartSlice';

const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy state từ Redux
    const { loading: momoLoading, error: momoError, verificationResult: momoResult, success: momoSuccess } = useSelector(
        (state) => state.momo
    );
    const { loading: vnpayLoading, error: vnpayError, verificationResult: vnpayResult, success: vnpaySuccess } = useSelector(
        (state) => state.vnpay
    );
    const { currentOrder } = useSelector((state) => state.order);

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Reset state khi unmount
        return () => {
            dispatch(resetMomoState());
            dispatch(resetVnpayState());
        };
    }, [dispatch]);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Lấy loại thanh toán và dữ liệu từ query params
                const queryParams = new URLSearchParams(location.search);
                const path = location.pathname;

                // Xác định phương thức thanh toán từ pathname
                if (path.includes('momo-return')) {
                    setPaymentMethod('momo');

                    // Tạo dữ liệu để xác thực thanh toán MoMo
                    const verifyData = {
                        orderId: queryParams.get('orderId'),
                        requestId: queryParams.get('requestId'),
                    };

                    if (!verifyData.orderId || !verifyData.requestId) {
                        throw new Error('Thiếu thông tin xác thực thanh toán MoMo');
                    }

                    // Gọi action xác thực thanh toán MoMo
                    dispatch(verifyMomoPaymentThunk(verifyData));
                } else if (path.includes('vnpay-return')) {
                    setPaymentMethod('vnpay');

                    // Đối với VNPay, chúng ta chỉ cần chuyển toàn bộ query params đến API xác thực
                    const params = {};
                    queryParams.forEach((value, key) => {
                        params[key] = value;
                    });

                    // Gọi action xác thực thanh toán VNPay
                    dispatch(verifyVnPayPaymentThunk(params));
                } else {
                    throw new Error('Không xác định được phương thức thanh toán');
                }
            } catch (err) {
                console.error('Lỗi khi xác thực thanh toán:', err);
                setError(err.message || 'Đã xảy ra lỗi khi xác thực thanh toán');
            }
        };

        verifyPayment();
    }, [location, dispatch]);

    // Xử lý lỗi từ các phương thức thanh toán
    useEffect(() => {
        if (momoError) {
            setError(`Lỗi thanh toán MoMo: ${momoError}`);
        }
        if (vnpayError) {
            setError(`Lỗi thanh toán VNPay: ${vnpayError}`);
        }
    }, [momoError, vnpayError]);

    // Xử lý khi thanh toán thành công
    useEffect(() => {
        if ((momoSuccess && momoResult) || (vnpaySuccess && vnpayResult)) {
            // Xóa giỏ hàng khi thanh toán thành công
            dispatch(clearCart());
        }
    }, [momoSuccess, momoResult, vnpaySuccess, vnpayResult, dispatch]);

    const handleBackToHome = () => {
        navigate('/');
    };

    // Xác định trạng thái loading và success
    const isLoading = momoLoading || vnpayLoading;
    const isSuccess = (paymentMethod === 'momo' && momoSuccess) || (paymentMethod === 'vnpay' && vnpaySuccess);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh] space-x-4">
                <svg
                    className="animate-spin h-8 w-8 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
                <span className="text-xl text-green-600">Đang xác thực thanh toán...</span>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto py-12">
            <div className="bg-white p-8 text-center rounded-lg shadow">
                {isSuccess ? (
                    <div>
                        <svg
                            className="w-20 h-20 text-green-600 mx-auto mb-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h2 className="text-3xl font-bold text-green-600 mb-3">Thanh Toán Thành Công</h2>
                        <p className="text-gray-600 mb-6">Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi</p>
                    </div>
                ) : (
                    <div>
                        <svg
                            className="w-20 h-20 text-red-600 mx-auto mb-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <h2 className="text-3xl font-bold text-red-600 mb-3">Thanh Toán Thất Bại</h2>
                        <p className="text-gray-600 mb-1">Đã xảy ra lỗi trong quá trình thanh toán</p>
                        {error && <p className="text-red-600 mb-6">{error}</p>}
                    </div>
                )}

                <hr className="my-6" />

                <div className="mb-4">
                    <p className="mb-2">
                        <span className="font-bold">Phương thức thanh toán:</span>{' '}
                        {paymentMethod === 'momo' ? 'MoMo' : 'VNPay'}
                    </p>
                    {currentOrder && (
                        <p className="mb-2">
                            <span className="font-bold">Mã đơn hàng:</span> {currentOrder.id}
                        </p>
                    )}
                </div>

                <button
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                    onClick={handleBackToHome}
                >
                    Tiếp Tục Mua Sắm
                </button>
            </div>
        </div>
    );
};

export default PaymentResult;