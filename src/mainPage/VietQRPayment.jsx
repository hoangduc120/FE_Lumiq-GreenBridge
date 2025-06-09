import React, { useEffect, useState } from "react";
import StepProgressBar from "../utils/ProgressBar";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import sus from "../animations/sus.json";
import axiosInstance from "../api/axios";

const bgGreen = "#34c759";

const VietQRPaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    axiosInstance
      .get(`/orders/${orderId}`)
      .then((res) => {
        const order = res.data?.order;
        if (order) {
          setOrderInfo({
            vietqrUrl: order.vietqrUrl,
            totalCartPrice: order.totalAmount,
            timeExpired: order.paymentExpiredAt
              ? new Date(order.paymentExpiredAt).toLocaleString("vi-VN")
              : "--/--/---- --:--",
            orderId: order.orderId,
          });
        } else {
          setError("Không tìm thấy đơn hàng.");
        }
      })
      .catch(() => setError("Không tìm thấy đơn hàng."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <span className="text-green-500 font-semibold text-lg animate-pulse">
          Đang tải dữ liệu đơn hàng...
        </span>
      </div>
    );

  if (error || !orderInfo)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <p className="text-red-500 text-lg">{error || "Không tìm thấy đơn hàng"}</p>
        <button
          className="mt-8 px-6 py-2 bg-green-500 text-white rounded-lg"
          onClick={() => navigate("/cart")}
        >
          Quay về giỏ hàng
        </button>
      </div>
    );

  const { vietqrUrl, totalCartPrice, timeExpired } = orderInfo;

  return (
    <div className="pt-28 pb-12 h-full min-h-screen" style={{ background: "#f5fff7" }}>
      <div className="px-6 md:px-24">
        <StepProgressBar color={bgGreen} />
      </div>
      <div className="py-6 p-4 max-w-4xl mx-auto">
        <button
          className="cursor-pointer flex items-center gap-2"
          style={{
            background: bgGreen,
            color: "#fff",
            padding: "10px 24px",
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 18,
            transition: "background 0.2s",
          }}
          onClick={() => navigate('/cart')}
        >
          <IoIosArrowRoundBack size={26} />
          <span>Quay lại</span>
        </button>
      </div>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl flex flex-col md:flex-row overflow-hidden border border-green-200">
        {/* Left panel: Order Info */}
        <div
          className="flex-shrink-0 flex flex-col items-start w-full md:w-1/3 p-10"
          style={{ background: bgGreen, color: "#fff", minHeight: "420px" }}
        >
          <h2 className="font-dancing text-3xl mb-5" style={{ fontWeight: 700, letterSpacing: 8 }}>
            GreenBridge!
          </h2>
          <div className="mb-1">
            <span className="font-semibold">Đơn hàng hết hạn:</span>
            <div className="ml-2">{timeExpired || "--/--/---- --:--"}</div>
          </div>
          <div className="mb-1">
            <span className="font-semibold">Nhà cung cấp:</span>
            <div className="ml-2">SePay</div>
          </div>
          <div className="mb-1">
            <span className="font-semibold">Hình thức thanh toán:</span>
            <div className="ml-2">Scan QR</div>
          </div>
          <div className="mb-1">
            <span className="font-semibold">Tổng thanh toán:</span>
            <div className="ml-2 text-lg font-bold">
              {totalCartPrice
                ? totalCartPrice.toLocaleString("vi-VN") + "₫"
                : "--"}
            </div>
          </div>
          <div className="mb-1">
            <span className="font-semibold">Mã đơn hàng:</span>
            <div className="ml-2 text-base font-bold tracking-wide">{orderId}</div>
          </div>
          <div className="mt-3">
            <span className="font-semibold">Trạng thái:</span>
            <span className="ml-2 text-base font-semibold text-white/90">Pending...</span>
          </div>
        </div>

        {/* Right panel: QR + hướng dẫn */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
          <h2 className="text-xl font-bold text-center text-green-700 mb-4">
            Quét mã để thanh toán
          </h2>
          <div className="border-4 border-green-100 rounded-xl p-4 mt-2 shadow-lg bg-green-50 mb-8">
            <img
              src={
                vietqrUrl
                  ? vietqrUrl
                  : `https://qr.sepay.vn/img?acc=0911146605&bank=MBBANK&amount=${totalCartPrice}&des=${orderId}&template=compact&download=true`
              }
              alt="QR Code"
              className="w-64 h-64 object-contain"
              style={{ background: "#fff", borderRadius: "12px" }}
            />
          </div>
          <p className="mt-6 text-green-800">
            Sử dụng <b>App ngân hàng</b> hoặc Camera hỗ trợ QR Code để quét mã
          </p>
          <div className="flex flex-col items-center justify-center mt-4">
            <Lottie className="w-16 h-16 mb-1" animationData={sus} autoPlay loop />
            <p className="text-green-700 font-semibold">
              Đang chờ bạn quét mã...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VietQRPaymentPage;
