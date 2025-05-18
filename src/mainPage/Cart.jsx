import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../redux/slices/cartSlice';
import { Empty } from 'antd';
import { IoArrowBackOutline } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import { FaTrashAlt } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const totalAmount = useSelector(state => state.cart.totalAmount);
    const shippingFee = 20;
    const total = totalAmount + shippingFee;

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

                                <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                                    Check out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;