import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Spin, message, Button, Tag, Modal } from "antd";
import packageApi from "../api/packageApi";
import { FaRegCheckCircle } from "react-icons/fa";
import { CreditCardOutlined, GiftOutlined } from "@ant-design/icons";
import VoucherCard from "../components/VoucherCard";
import voucherApi from "../api/voucherApi";

const RegisterPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [voucher, setVoucher] = useState(null);
  const [voucherModal, setVoucherModal] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      try {
        const res = await packageApi.getById(id);
        setPkg(res.data || res);
        if (res.data?.voucherCode) {
          try {
            const vRes = await voucherApi.getByCode(res.data.voucherCode);
            setVoucher(vRes.data?.voucher || null);
          } catch {
            setVoucher(null);
          }
        }
      } catch (err) {
        message.error("Không tìm thấy thông tin gói");
        navigate("/membership");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPackage();
  }, [id, navigate]);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      const response = await packageApi.register(id);
      console.log("Register response:", response);

      setTimeout(() => {
        message.success(
          "Đăng ký gói thành công! Chúc bạn trải nghiệm tuyệt vời cùng GreenBridge."
        );
        navigate("/membership");
      }, 1200);
    } catch (error) {
      message.error(error?.message || "Đăng ký gói thất bại");
      setRegistering(false);
      return;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gradient-to-br from-[#eaffd0] via-[#d0ffd6] to-[#b3f7e0]">
        <Spin size="large" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="text-center text-red-500 py-16">
        Không tìm thấy thông tin gói.
        <div className="mt-4">
          <Link to="/membership" className="text-green-600 underline">
            Quay lại trang gói dịch vụ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-[#eaffd0] via-[#d0ffd6] to-[#b3f7e0] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 border-2 border-[#D0FF41]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GiftOutlined className="text-[#2B8B35] text-4xl" />
            <h2 className="text-4xl font-extrabold text-[#2B8B35]">
              {pkg.name}
            </h2>
          </div>
          <div className="text-gray-600 text-lg">
            {pkg.description || "Gói dịch vụ ưu đãi từ GreenBridge"}
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <FaRegCheckCircle className="text-green-500 text-xl" />
              <span className="text-lg">
                <b>{pkg.aiFreeUsage ?? 0}</b> lượt AI miễn phí
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FaRegCheckCircle className="text-green-500 text-xl" />
              <span className="text-lg">
                Thời hạn:{" "}
                <b>
                  {pkg.duration ? `${pkg.duration} ngày` : "Không giới hạn"}
                </b>
              </span>
            </li>
            {pkg.voucherCode && (
              <li className="flex items-center gap-3">
                <FaRegCheckCircle className="text-green-500 text-xl" />
                <span
                  className="text-[#2B8B35] font-semibold underline cursor-pointer hover:text-[#D0FF41] transition text-lg"
                  onClick={() => setVoucherModal(true)}
                >
                  🎁 Voucher đặc biệt: {pkg.voucherCode}
                </span>
                {voucher && (
                  <Tag color="green" className="ml-2 text-base px-3 py-1">
                    {voucher.discountType === "percent"
                      ? `Giảm ${voucher.discountValue}%`
                      : `Giảm ${voucher.discountValue?.toLocaleString()}₫`}
                  </Tag>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* Price & Payment */}
        <div className="text-center space-y-6">
          <div className="text-[#2B8B35] font-bold text-3xl">
            {pkg.price?.toLocaleString()} VND
            <span className="text-gray-500 font-normal text-lg block mt-1">
              Thời hạn {pkg.duration} ngày
            </span>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<CreditCardOutlined />}
            loading={registering}
            className="w-full bg-[#D0FF41] text-black font-bold py-4 h-auto rounded-2xl border-none shadow-lg hover:bg-[#b6f5c2] transition text-xl"
            onClick={handleRegister}
            disabled={registering}
          >
            {registering
              ? "Đang xử lý thanh toán..."
              : "Thanh toán & Đăng ký ngay"}
          </Button>

          <Link
            to="/membership"
            className="text-gray-400 underline hover:text-[#2B8B35] text-sm block"
          >
            ← Quay lại trang gói dịch vụ
          </Link>
        </div>
      </div>

      {/* Voucher Modal */}
      <Modal
        open={voucherModal}
        onCancel={() => setVoucherModal(false)}
        footer={null}
        centered
        width={420}
      >
        <VoucherCard voucher={voucher} />
      </Modal>

      {/* Bottom Message */}
      <div className="mt-8 text-center text-[#2B8B35] text-lg font-semibold max-w-2xl">
        <span role="img" aria-label="leaf">
          🍃
        </span>{" "}
        Đăng ký gói để trải nghiệm AI, nhận ưu đãi và nhiều quyền lợi xanh chỉ
        có tại GreenBridge!
      </div>
    </div>
  );
};

export default RegisterPackage;
