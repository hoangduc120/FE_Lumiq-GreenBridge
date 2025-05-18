import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../redux/slices/cartSlice';
import { createMomoPaymentThunk, resetPaymentState } from '../redux/slices/momoSlice';
import { createVnPayPaymentThunk, resetPaymentState as resetVnPayState } from '../redux/slices/vnpaySlice';
import { Empty, Modal, Spin } from 'antd';
import { IoArrowBackOutline } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import { FaTrashAlt } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { toast } from 'react-toastify';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy state từ Redux
    const cartItems = useSelector(state => state.cart.items);
    const totalAmount = useSelector(state => state.cart.totalAmount);
    const { paymentLoading, paymentError, paymentUrl, paymentData } = useSelector(state => state.momo);
    const {
        paymentLoading: vnpayLoading,
        paymentError: vnpayError,
        paymentUrl: vnpayUrl,
        paymentData: vnpayData
    } = useSelector(state => state.vnpay);

    const shippingFee = 20;
    const total = totalAmount + shippingFee;

    // Kiểm tra URL param khi trở về từ MoMo hoặc VNPay
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const resultCode = params.get('resultCode');
        const orderId = params.get('orderId');
        const vnp_ResponseCode = params.get('vnp_ResponseCode');
        const vnp_TxnRef = params.get('vnp_TxnRef');

        // Kiểm tra callback từ MoMo
        if (resultCode && orderId) {
            if (resultCode === '0') {
                toast.success('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
                // Xóa giỏ hàng sau khi thanh toán thành công
                dispatch(cartActions.clearCart());
            } else {
                toast.error('Thanh toán thất bại. Vui lòng thử lại sau.');
            }
            // Xóa query params khỏi URL
            navigate(location.pathname, { replace: true });
        }

        // Kiểm tra callback từ VNPay
        if (vnp_ResponseCode && vnp_TxnRef) {
            if (vnp_ResponseCode === '00') {
                toast.success('Thanh toán VNPay thành công! Cảm ơn bạn đã mua hàng.');
                // Xóa giỏ hàng sau khi thanh toán thành công
                dispatch(cartActions.clearCart());
            } else {
                toast.error('Thanh toán VNPay thất bại. Vui lòng thử lại sau.');
            }
            // Xóa query params khỏi URL
            navigate(location.pathname, { replace: true });
        }

        // Cleanup function
        return () => {
            dispatch(resetPaymentState());
            dispatch(resetVnPayState());
        };
    }, [location, dispatch, navigate]);

    // Effect xử lý khi có paymentUrl từ MoMo
    useEffect(() => {
        console.log('MoMo Payment URL state changed:', paymentUrl);
        if (paymentUrl) {
            console.log('Redirecting to MoMo payment URL:', paymentUrl);
            window.location.href = paymentUrl;
        }
    }, [paymentUrl]);

    // Effect xử lý khi có paymentUrl từ VNPay
    useEffect(() => {
        console.log('VNPay Payment URL state changed:', vnpayUrl);
        if (vnpayUrl) {
            console.log('Redirecting to VNPay payment URL:', vnpayUrl);
            window.location.href = vnpayUrl;
        }
    }, [vnpayUrl]);

    // Effect xử lý khi có paymentData
    useEffect(() => {
        console.log('MoMo Payment data changed:', paymentData);
    }, [paymentData]);

    // Effect xử lý khi có vnpayData
    useEffect(() => {
        console.log('VNPay Payment data changed:', vnpayData);
    }, [vnpayData]);

    // Effect xử lý khi có lỗi thanh toán MoMo
    useEffect(() => {
        if (paymentError) {
            console.error('MoMo Payment error:', paymentError);
            toast.error(paymentError);
        }
    }, [paymentError]);

    // Effect xử lý khi có lỗi thanh toán VNPay
    useEffect(() => {
        if (vnpayError) {
            console.error('VNPay Payment error:', vnpayError);
            toast.error(vnpayError);
        }
    }, [vnpayError]);

    // Handle quantity change
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) {
            dispatch(cartActions.removeItemCompletely(id));
        } else if (newQuantity < cartItems.find(item => item.id === id).quantity) {
            dispatch(cartActions.removeFromCart(id));
        } else {
            dispatch(cartActions.addToCart({
                id: id,
                price: cartItems.find(item => item.id === id).price
            }));
        }
    };

    // Handle item removal
    const removeItem = (id) => {
        dispatch(cartActions.removeItemCompletely(id));
    };

    // Xử lý thanh toán bằng MoMo
    const handleMomoPayment = () => {
        console.log('MoMo payment button clicked');

        // Kiểm tra xem có sản phẩm trong giỏ hàng không
        if (cartItems.length === 0) {
            console.log('Cart is empty, showing error toast');
            toast.error("Giỏ hàng của bạn đang trống");
            return;
        }

        // Tạo dữ liệu cho API thanh toán
        const paymentData = {
            amount: total,
            orderId: `ORDER_${Date.now()}`
        };

        console.log('Dispatching MoMo payment with data:', paymentData);

        // Gọi action Redux để tạo thanh toán MoMo
        dispatch(createMomoPaymentThunk(paymentData));
    };

    // Xử lý thanh toán bằng VNPay
    const handleVnPayPayment = () => {
        console.log('VNPay payment button clicked');

        // Kiểm tra xem có sản phẩm trong giỏ hàng không
        if (cartItems.length === 0) {
            console.log('Cart is empty, showing error toast');
            toast.error("Giỏ hàng của bạn đang trống");
            return;
        }

        // Tạo dữ liệu cho API thanh toán
        const paymentData = {
            amount: total,
            orderId: `ORDER_${Date.now()}`
        };

        console.log('Dispatching VNPay payment with data:', paymentData);

        // Gọi action Redux để tạo thanh toán VNPay
        dispatch(createVnPayPaymentThunk(paymentData));
    };

    console.log('Cart render - paymentLoading:', paymentLoading, 'paymentUrl:', paymentUrl);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-8 flex items-center text-sm text-gray-600">
                <Link to="/" className="hover:text-gray-900">
                    Home
                </Link>
                {/* ChevronRight */}
                <GrFormNext />
                <Link to="/viewall" className="hover:text-gray-900">
                    Category
                </Link>
                <GrFormNext />
                <span>Cart</span>
            </div>

            {/* Hiển thị lỗi nếu có */}
            {(paymentError || vnpayError) && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {paymentError || vnpayError}
                </div>
            )}

            <div className="lg:flex lg:gap-8">
                <div className="mb-8 lg:mb-0 lg:flex-1">
                    {/* Cart Header */}
                    <div className="mb-4 hidden border-b pb-4 lg:grid lg:grid-cols-4">
                        <div className="font-medium">PRODUCT</div>
                        <div className="text-center font-medium">PRICE</div>
                        <div className="text-center font-medium">QTY</div>
                        <div className="text-right font-medium">UNIT PRICE</div>
                    </div>

                    {/* Cart Items */}
                    {cartItems.length > 0 ? (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative grid grid-cols-1 gap-4 border-b pb-6 lg:grid-cols-4 lg:items-center"
                                >
                                    {/* Remove Button (Mobile & Desktop) */}
                                    <button
                                        className="absolute left-0 top-0 text-gray-400 hover:text-red-500 lg:relative lg:left-auto lg:top-auto"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        {/* X SVG */}
                                        <FaTrashAlt />
                                    </button>

                                    {/* Product */}
                                    <div className="ml-6 flex items-center lg:ml-0">
                                        <div className="mr-4 h-20 w-20 flex-shrink-0 overflow-hidden rounded">
                                            <img
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium">{item.name}</h3>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="ml-6 lg:ml-0 lg:text-center">
                                        <span className="text-sm font-medium lg:hidden">Price: </span>
                                        <span className="text-sm">{item.price}đ</span>
                                    </div>

                                    {/* Quantity */}
                                    <div className="ml-6 flex items-center lg:ml-0 lg:justify-center">
                                        <span className="mr-2 text-sm font-medium lg:hidden">Quantity: </span>
                                        <div className="flex items-center">
                                            <button
                                                className="flex h-8 w-8 items-center justify-center rounded-l border border-r-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                {/* Minus */}
                                                <FiMinus />
                                            </button>
                                            <div className="flex h-8 w-10 items-center justify-center border border-gray-300 bg-white text-center text-sm">
                                                {item.quantity}
                                            </div>
                                            <button
                                                className="flex h-8 w-8 items-center justify-center rounded-r border border-l-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                {/* Plus */}
                                                <FiPlus />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Unit Price */}
                                    <div className="ml-6 lg:ml-0 lg:text-right">
                                        <span className="text-sm font-medium lg:hidden">Total: </span>
                                        <span className="text-sm font-medium">{item.price * item.quantity}đ</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Empty description="Giỏ hàng của bạn đang trống" />
                            <Link to="/viewall">
                                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                    Tiếp tục mua sắm
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Continue Shopping */}
                    {cartItems.length > 0 && (
                        <div className="mt-8">
                            <Link to="/viewall">
                                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
                                    <IoArrowBackOutline />
                                    Tiếp tục mua sắm
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                {cartItems.length > 0 && (
                    <div className="lg:w-80">
                        <div className="rounded border p-6">
                            <h2 className="mb-6 text-lg font-medium">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{totalAmount}đ</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping fee</span>
                                    <span className="font-medium">{shippingFee}đ</span>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold">TOTAL</span>
                                        <span className="text-lg font-bold">{total}đ</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 flex items-center justify-center"
                                        onClick={handleMomoPayment}
                                        disabled={paymentLoading || vnpayLoading}
                                    >
                                        {paymentLoading ? <Spin size="small" /> : 'Thanh toán bằng MoMo'}
                                    </button>

                                    <button
                                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center"
                                        onClick={handleVnPayPayment}
                                        disabled={paymentLoading || vnpayLoading}
                                    >
                                        {vnpayLoading ? <Spin size="small" /> : 'Thanh toán bằng VNPay'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;