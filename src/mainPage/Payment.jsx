import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createMomoPaymentThunk } from "../redux/slices/momoSlice";
import { createVnPayPaymentThunk } from "../redux/slices/vnpaySlice";
import { setCurrentOrder } from "../redux/slices/orderSlice";
import { clearCart, fetchCart } from "../redux/slices/cartSlice";
import StepProgressBar from "../utils/ProgressBar";
import moment from "moment";
import { IoIosArrowRoundBack } from "react-icons/io";
import Lottie from "lottie-react";
import Edit from "../animations/Edit.json";
import gsap from "gsap";
import axiosInstance from "../api/axios";
import voucherApi from "../api/voucherApi";
import { Button, List, Modal, Spin } from "antd";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading: momoLoading,
    error: momoError,
    paymentUrl: momoPaymentUrl,
    success: momoSuccess,
    verificationResult: momoResult,
  } = useSelector((state) => state.momo);
  const {
    loading: vnpayLoading,
    error: vnpayError,
    redirectUrl: vnpayRedirectUrl,
    success: vnpaySuccess,
    verificationResult: vnpayResult,
  } = useSelector((state) => state.vnpay);

  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fullAddress, setFullAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const itemsRef = useRef([]);
  const paymentButtonsRef = useRef([]);
  const titleOrder = useRef(null);
  const shipping = useRef(null);
  const payment = useRef(null);
  const container = useRef(null);
  const buttonBack = useRef(null);
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const openVoucherModal = async () => {
    setVoucherModalVisible(true);
    setLoadingVouchers(true);
    try {
      const res = await voucherApi.getAvailableVouchers();
      setVouchers(Array.isArray(res.data.vouchers) ? res.data.vouchers : []);
      console.log("Available vouchers:", res.data.vouchers);
    } catch (e) {
      setVouchers([]);
      console.log("Error fetching vouchers:", e);
    }
    setLoadingVouchers(false);
  };
  const handleApplyVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setVoucherModalVisible(false);
    let discountAmount = 0;
    if (orderData && voucher) {
      if (voucher.discountType === "fixed") {
        discountAmount = voucher.discountValue;
      } else if (voucher.discountType === "percentage") {
        discountAmount = (orderData.totalAmount * voucher.discountValue) / 100;
      }
      setOrderData({
        ...orderData,
        discountAmount: discountAmount,
        finalAmount: Math.max(orderData.totalAmount - discountAmount, 0),
      });
    }
  };
  useEffect(() => {
    if (location.state && location.state.orderData) {
      setOrderData(location.state.orderData);
      dispatch(setCurrentOrder(location.state.orderData));
      setFullAddress(location.state.orderData.shippingAddress.address || "");
    } else {
      setError("Không tìm thấy thông tin đơn hàng");
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

  useEffect(() => {
    setIsLoading(momoLoading || vnpayLoading);
  }, [momoLoading, vnpayLoading]);

  // Debug useEffect để kiểm tra tất cả payment states
  useEffect(() => {}, [
    momoPaymentUrl,
    vnpayRedirectUrl,
    momoLoading,
    vnpayLoading,
    momoError,
    vnpayError,
    momoSuccess,
    vnpaySuccess,
  ]);


  const handlePayment = async (paymentMethod) => {
    if (!orderData) {
      setError("Không có thông tin đơn hàng để thanh toán");
      return;
    }

    setError(null);

    // Lấy userId từ localStorage
    const userFromStorage = localStorage.getItem("user");
    let userId = null;

    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        userId = userData.id;
      } catch (error) {
        console.error("Lỗi parse user data:", error);
      }
    }

    const paymentData = {
      amount: orderData.totalAmount,
      orderId: orderData.id,
      userId: userId, // Thêm userId
      items: orderData.items,
    };

    if (paymentMethod === "momo") {
      dispatch(createMomoPaymentThunk(paymentData));
    } else if (paymentMethod === "vnpay") {
      dispatch(createVnPayPaymentThunk(paymentData));
    }
  };



  const handleEditClick = () => {
    setIsEditing(true);
    setEditedAddress(fullAddress);
    // Mock saved addresses (replace with actual API call if needed)
    setSavedAddresses([
      { address: "123 Đường ABC, Quận 1, TP.HCM", distance: 2.5 },
      { address: "456 Đường XYZ, Quận 3, TP.HCM", distance: 4.0 },
    ]);
  };

  const handleAddressChange = (e) => {
    setEditedAddress(e.target.value);
    setShowHistory(e.target.value === "");
  };

  const handleSaveClick = () => {
    setFullAddress(editedAddress);
    setIsEditing(false);
    setShowHistory(false);
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      buttonBack.current,
      { opacity: 0, x: -200 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
    );
    tl.fromTo(
      container.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
    tl.fromTo(
      titleOrder.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
    tl.fromTo(
      itemsRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.2, ease: "power3.out" },
      "-=0.2"
    );
    tl.fromTo(
      shipping.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
    );
    tl.fromTo(
      payment.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
    );
    tl.fromTo(
      paymentButtonsRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    if ((momoSuccess && momoResult) || (vnpaySuccess && vnpayResult)) {
      dispatch(fetchCart())
        .then(() => {
          console.log("Đã cập nhật giỏ hàng sau thanh toán thành công");
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật giỏ hàng:", error);
          dispatch(clearCart());
        });
    }
  }, [momoSuccess, momoResult, vnpaySuccess, vnpayResult, dispatch]);

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

  const handleQRPay = async () => {
    if (!orderData || !fullAddress) {
      setError("Please provide complete order details and address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formattedItems = orderData.items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      const orderResponse = await axiosInstance.post(
        `/orders`,
        {
          orderId: orderData.id,
          shippingAddress: { address: fullAddress },
          paymentMethod: "vietqr",
          items: formattedItems,
          totalAmount: orderData.totalAmount,
        }
      );

      const { order } = orderResponse.data;
      if (!order) throw new Error("Order creation failed");

      navigate(`/payment/vietqr/${order.orderId}`);
    } catch (error) {
      setError(`Error: ${error.response?.data.message || error.message}`);
      console.log("Backend error response:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-12 bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-[#fafafa] p-8 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 animate-slide"></div>
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-700">
              Đang xử lý...
            </p>
          </div>
        </div>
      )}
      <div className="p-4">
        <StepProgressBar />
      </div>
      <div className="py-6 p-4 max-w-4xl mx-auto">
        <button
          ref={buttonBack}
          className="cursor-pointer flex items-center gap-2 bg-primaryColor hover:bg-red-600 px-4 py-2 text-lg text-white font-semibold rounded-full"
          onClick={() => navigate("/cart")}
        >
          <IoIosArrowRoundBack />
          <span>Back</span>
        </button>
      </div>
      <div
        ref={container}
        className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-2xl"
      >
        <h1
          ref={titleOrder}
          className="text-2xl font-bold mb-6 text-center text-primaryColor"
        >
          Thanh Toán
        </h1>
        <div className="flex justify-between py-3">
          <div className="flex items-center gap-3">
            <p className="font-bold pl-2">Mã đơn hàng</p>
            <p className="font-bold text-primaryColor">{orderData?.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-bold">Ngày đặt</p>
            <p className="font-bold text-primaryColor">
              {moment().format("MMM D, YYYY")}
            </p>
          </div>
        </div>
        {orderData?.items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-gray-300 py-4"
            ref={(el) => (itemsRef.current[index] = el)}
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-32 h-20 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
            </div>
            <p className="font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.price * item.quantity)}
            </p>
          </div>
        ))}

        <div className="flex gap-12">
          <div ref={shipping} className="mt-6 leading-8">
            <h2 className="text-lg font-bold mb-2">
              Payment & Shipping details
            </h2>
            <div className="text-gray-600">
              <div className="flex items-start">
                <p className="w-36 flex-shrink-0">Delivered to:</p>
                <span className="font-semibold">
                  {orderData?.shippingAddress.name || "User"}
                </span>
              </div>
              <div className="flex items-start mt-2">
                <p className="w-36 flex-shrink-0">Delivery address:</p>
                {isEditing ? (
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      value={editedAddress}
                      onChange={handleAddressChange}
                      onFocus={() => setShowHistory(true)}
                      className="border border-gray-300 rounded-md min-w-[432px] px-3"
                    />
                    {showHistory && savedAddresses.length > 0 && (
                      <div className="border border-gray-300 bg-white rounded-md p-2 mt-1">
                        {savedAddresses.map((item, index) => (
                          <p
                            key={index}
                            className="cursor-pointer hover:bg-gray-200 p-1 rounded-md"
                            onClick={() => {
                              setFullAddress(item.address);
                              setEditedAddress(item.address);
                              setIsEditing(false);
                              setShowHistory(false);
                            }}
                          >
                            {item.address}
                          </p>
                        ))}
                      </div>
                    )}
                    <div className="flex mt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="relative px-4 py-1.5 border-red-500 border-2 text-black rounded-lg overflow-hidden group"
                      >
                        <span className="absolute inset-0 bg-red-500 scale-x-0 origin-center group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-500 ease-in-out">
                          Cancel
                        </span>
                      </button>
                      <button
                        onClick={handleSaveClick}
                        className="ml-2 px-4 py-1.5 bg-primaryColor border-2 border-primaryColor text-white rounded-lg hover:bg-red-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold break-words min-w-[360px]">
                      {fullAddress || "Please fill your delivery address"}
                    </span>
                    <div className="relative group">
                      <Lottie
                        animationData={Edit}
                        className="text-primaryColor w-16 h-16 cursor-pointer inline-block"
                        onClick={handleEditClick}
                      />
                      <span className="absolute w-[86px] bottom-[-0.5rem] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                        Edit Address
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4 mt-4">
                <Button
                  onClick={openVoucherModal}
                  className="bg-primaryColor text-white hover:bg-red-600 flex items-center gap-2"
                >
                  {selectedVoucher ? "Voucher đã chọn" : "Chọn voucher"}
                </Button>
                {selectedVoucher && (
                  <div className="mt-2 p-3 border border-green-500 rounded-md bg-green-50">
                    <div className="flex justify-between">
                      <span className="font-semibold text-green-700">
                        Mã: {selectedVoucher.code}
                      </span>
                      <span
                        className="text-xs cursor-pointer text-red-500"
                        onClick={() => {
                          setSelectedVoucher(null);
                          if (orderData) {
                            setOrderData({
                              ...orderData,
                              discountAmount: 0,
                              finalAmount: orderData.totalAmount,
                            });
                          }
                        }}
                      >
                        Hủy
                      </span>
                    </div>
                    <div className="text-sm text-green-700">
                      Giảm:{" "}
                      {selectedVoucher.discountType === "fixed"
                        ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(selectedVoucher.discountValue)
                        : `${selectedVoucher.discountValue}%`}
                    </div>
                  </div>
                )}
              </div>
              <Modal
                title="Danh sách voucher"
                open={voucherModalVisible}
                onCancel={() => setVoucherModalVisible(false)}
                footer={null}
                width={600}
              >
                {loadingVouchers ? (
                  <div className="flex justify-center py-8">
                    <Spin />
                  </div>
                ) : (
                  <div>
                    {vouchers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Bạn không có voucher nào
                      </div>
                    ) : (
                      <List
                        dataSource={vouchers}
                        rowKey={(item) => item._id}
                        renderItem={(item) => (
                          <List.Item className="border border-dashed border-orange-300 bg-orange-50 rounded-lg mb-2 hover:shadow-md transition-all">
                            <div className="flex w-full">
                              <div className="flex-shrink-0 w-1/6 flex items-center justify-center border-r border-dashed border-orange-300">
                                <div className="text-2xl font-bold text-orange-500">
                                  #{item.code}
                                </div>
                              </div>
                              <div className="flex-grow px-4 py-2">
                                <div className="flex justify-between">
                                  <div className="text-sm text-gray-500">
                                    HSD:{" "}
                                    {new Date(item.endDate).toLocaleDateString(
                                      "vi-VN"
                                    )}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {item.discountType === "fixed"
                                    ? `Giảm ${new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      }).format(item.discountValue)}`
                                    : `Giảm ${item.discountValue}% tổng đơn hàng`}
                                </div>
                                {item.minOrderValue > 0 && (
                                  <div className="text-xs text-gray-500">
                                    Áp dụng cho đơn hàng từ{" "}
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(item.minOrderValue)}
                                  </div>
                                )}
                              </div>
                              <div className="flex-shrink-0 flex items-center pr-2">
                                <Button
                                  type="primary"
                                  className="bg-primaryColor"
                                  onClick={() => handleApplyVoucher(item)}
                                >
                                  Áp dụng
                                </Button>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    )}
                  </div>
                )}
              </Modal>
              <div className="flex items-center my-4">
                <span className="flex-grow h-[1px] bg-gray-300"></span>
                <p className="px-8 text-gray-500 text-base">
                  Choose payment method
                </p>
                <span className="flex-grow h-[1px] bg-gray-300"></span>
              </div>
              <div className="flex flex-col items-center payment-item">
                <button
                  ref={(el) => paymentButtonsRef.current.push(el)}
                  onClick={() => handlePayment("momo")}
                  className="relative w-[30%] border-red-400 border-2 text-primaryColor rounded-xl p-2 mt-4 flex items-center justify-center gap-4 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-red-400 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                  <img
                    className="w-6 h-6 relative z-10"
                    src="/momo-logo.png"
                    alt="MoMo"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <span className="relative z-10 text-primaryColor group-hover:text-white transition-colors duration-500 ease-in-out">
                    Pay with MoMo
                  </span>
                </button>
                <button
                  ref={(el) => paymentButtonsRef.current.push(el)}
                  onClick={() => handlePayment("vnpay")}
                  className="relative w-[30%] border-blue-500 border-2 text-blue-500 rounded-xl p-2 mt-4 flex items-center justify-center gap-4 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-blue-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                  <img
                    className="w-6 h-6 relative z-10"
                    src="/vnpay-logo.png"
                    alt="VNPay"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <span className="relative z-10 text-blue-500 group-hover:text-white transition-colors duration-500 ease-in-out">
                    Pay with VNPay
                  </span>
                </button>
                <button
                  ref={(el) => paymentButtonsRef.current.push(el)}
                  onClick={handleQRPay}
                  className="relative w-[30%] border-green-500 border-2 text-green-500 rounded-xl p-2 mt-4 flex items-center justify-center gap-4 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-green-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                  <img
                    className="w-6 h-6 relative z-10"
                    src="/vietqr-logo.png"
                    alt="VietQR"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500 ease-in-out">
                    Pay with VietQR
                  </span>
                </button>
                {/* Debug webhook button - remove after testing */}
                <button
                  onClick={async () => {
                    if (!orderData?.id) return;
                    try {
                      const response = await fetch('http://localhost:5000/payment/webhook', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          content: `${orderData.id} FT25169254691284 Ma giao dich Trace908499 Trace 908499`,
                          transferAmount: orderData.totalAmount
                        })
                      });
                      const result = await response.json();
                      console.log('Debug webhook result:', result);
                    } catch (error) {
                      console.error('Debug webhook error:', error);
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  🐛 Test Webhook
                </button>
              </div>
            </div>
          </div>
          <div
            ref={payment}
            className="mt-6 bg-gray-100 p-4 rounded-md min-w-60 h-fit"
          >
            <div className="flex justify-between items-center">
              <p>Subtotal</p>
              <p className="font-semibold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  orderData?.totalAmount - (orderData?.shippingFee || 0)
                )}
              </p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p>Shipping Fee</p>
              <p className="font-semibold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderData?.shippingFee || 0)}
              </p>
            </div>
            {selectedVoucher && (
              <div className="flex justify-between items-center mt-2 text-green-600">
                <p>Voucher Discount</p>
                <p className="font-semibold">
                  -{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(orderData?.discountAmount || 0)}
                </p>
              </div>
            )}
            <div className="flex justify-between items-center mt-4 border-t border-gray-300 pt-4">
              <p className="font-bold text-lg text-primaryColor">Total</p>
              <p className="font-bold text-lg text-primaryColor">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  orderData?.finalAmount || orderData?.totalAmount || 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 text-red-800 p-4 mb-6 rounded-lg shadow max-w-4xl mx-auto">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Payment;
