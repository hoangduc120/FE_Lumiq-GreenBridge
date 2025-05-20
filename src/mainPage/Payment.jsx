import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createMomoPaymentThunk } from '../redux/slices/momoSlice';
import { createVnPayPaymentThunk } from '../redux/slices/vnpaySlice';
import { setCurrentOrder } from '../redux/slices/orderSlice';
import { cartActions } from '../redux/slices/cartSlice';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy state từ Redux
    const { loading: momoLoading, error: momoError, paymentUrl: momoPaymentUrl } = useSelector(
        (state) => state.momo
    );
    const { loading: vnpayLoading, error: vnpayError, redirectUrl: vnpayRedirectUrl } = useSelector(
        (state) => state.vnpay
    );

    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (location.state && location.state.orderData) {
            setOrderData(location.state.orderData);
            dispatch(setCurrentOrder(location.state.orderData));
        } else {
            setError('Không tìm thấy thông tin đơn hàng');
        }
    }, [location, dispatch]);

    useEffect(() => {
        if (momoPaymentUrl) {
            window.location.href = momoPaymentUrl;
        }
    }, [momoPaymentUrl]);

    useEffect(() => {
        if (vnpayRedirectUrl) {
            window.location.href = vnpayRedirectUrl;
        }
    }, [vnpayRedirectUrl]);

    useEffect(() => {
        if (momoError) {
            setError(`Lỗi thanh toán MoMo: ${momoError}`);
        }
        if (vnpayError) {
            setError(`Lỗi thanh toán VNPay: ${vnpayError}`);
        }
    }, [momoError, vnpayError]);

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handlePayment = async () => {
        if (!orderData) {
            setError('Không có thông tin đơn hàng để thanh toán');
            return;
        }

        setError(null);

        const paymentData = {
            amount: orderData.totalAmount,
            orderId: orderData.id,
            items: orderData.items,
        };

        if (paymentMethod === 'momo') {
            dispatch(createMomoPaymentThunk(paymentData));
        } else if (paymentMethod === 'vnpay') {
            dispatch(createVnPayPaymentThunk(paymentData));
        }
    };

    const handleCancel = () => {
        navigate('/cart');
    };

    const isLoading = momoLoading || vnpayLoading;

    if (!orderData && !error) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
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
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-4xl font-bold text-center text-green-800 mb-8">Thanh Toán</h1>

            {error && (
                <div className="bg-red-100 text-red-800 p-4 mb-6 rounded-lg shadow">
                    <p>{error}</p>
                </div>
            )}

            {orderData && (
                <>
                    <div className="bg-white p-6 mb-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Thông Tin Đơn Hàng</h2>
                        <hr className="mb-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <p className="text-base">
                                <span className="font-bold">Mã đơn hàng:</span> {orderData.id}
                            </p>
                            <p className="text-base">
                                <span className="font-bold">Tổng tiền:</span>{' '}
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(orderData.totalAmount)}
                            </p>
                            <p className="text-sm text-gray-600 col-span-1 sm:col-span-2">
                                {orderData.items?.length || 0} sản phẩm
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 mb-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Phương Thức Thanh Toán</h2>
                        <hr className="mb-4" />
                        <div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment-method"
                                        value="momo"
                                        checked={paymentMethod === 'momo'}
                                        onChange={handlePaymentMethodChange}
                                        className="text-green-600 focus:ring-green-600"
                                    />
                                    <div className="flex items-center ml-2">
                                        <img
                                            src="/momo-logo.png"
                                            alt="MoMo"
                                            className="h-8 mr-2"
                                            onError={(e) => (e.target.style.display = 'none')}
                                        />
                                        <span>MoMo</span>
                                    </div>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment-method"
                                        value="vnpay"
                                        checked={paymentMethod === 'vnpay'}
                                        onChange={handlePaymentMethodChange}
                                        className="text-green-600 focus:ring-green-600"
                                    />
                                    <div className="flex items-center ml-2">
                                        <img
                                            src="/vnpay-logo.png"
                                            alt="VNPay"
                                            className="h-8 mr-2"
                                            onError={(e) => (e.target.style.display = 'none')}
                                        />
                                        <span>VNPay</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            className="bg-transparent border-2 border-red-600 text-red-600 px-6 py-2 rounded hover:bg-red-600 hover:text-white disabled:opacity-50"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
                            onClick={handlePayment}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg
                                    className="animate-spin h-6 w-6 mr-2 text-white"
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
                            ) : null}
                            {isLoading ? 'Đang xử lý...' : 'Thanh Toán'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Payment;