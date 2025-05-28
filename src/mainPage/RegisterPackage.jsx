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
    setRegistering(true);
    setTimeout(() => {
      message.success(
        "Đăng ký gói thành công! Chúc bạn trải nghiệm tuyệt vời cùng GreenBridge."
      );
      navigate("/membership");
    }, 1200);
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
    <div className="min-h-[90vh] bg-gradient-to-br from-[#eaffd0] via-[#d0ffd6] to-[#b3f7e0] flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border-2 border-[#D0FF41]">
        {/* Left: Package Info */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <GiftOutlined className="text-[#2B8B35] text-3xl" />
              <h2 className="text-3xl font-extrabold text-[#2B8B35]">
                {pkg.name}
              </h2>
            </div>
            <div className="text-gray-700 text-base mb-4">
              {pkg.description || "Gói dịch vụ ưu đãi từ GreenBridge"}
            </div>
            <div className="bg-gray-200 w-full h-[2px] mb-4 rounded" />
            <ul className="mb-4">
              <li className="flex items-center gap-2 mb-2">
                <FaRegCheckCircle className="text-green-500" />
                <span>
                  <b>{pkg.aiFreeUsage ?? 0}</b> lượt AI miễn phí
                </span>
              </li>
              <li className="flex items-center gap-2 mb-2">
                <FaRegCheckCircle className="text-green-500" />
                <span>
                  Thời hạn:{" "}
                  <b>
                    {pkg.duration ? `${pkg.duration} ngày` : "Không giới hạn"}
                  </b>
                </span>
              </li>
              {pkg.voucherCode && (
                <li className="flex items-center gap-2 mb-2">
                  <FaRegCheckCircle className="text-green-500" />
                  <span
                    className="text-[#2B8B35] font-semibold underline cursor-pointer hover:text-[#D0FF41] transition"
                    onClick={() => setVoucherModal(true)}
                  >
                    🎁 Voucher: {pkg.voucherCode}
                  </span>
                  {voucher && (
                    <Tag color="green" className="ml-2">
                      {voucher.discountType === "percent"
                        ? `Giảm ${voucher.discountValue}%`
                        : `Giảm ${voucher.discountValue?.toLocaleString()}₫`}
                    </Tag>
                  )}
                </li>
              )}
            </ul>
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center gap-4">
              <div className="text-[#2B8B35] font-bold text-2xl">
                {pkg.price?.toLocaleString()} VND
                <span className="text-gray-500 font-normal text-base">
                  {" "}
                  /{pkg.duration} ngày
                </span>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<CreditCardOutlined />}
                loading={registering}
                className="bg-[#D0FF41] text-black font-bold px-8 py-2 rounded-full border-none shadow hover:bg-[#b6f5c2] transition"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? "Đang thanh toán..." : "Thanh toán & Đăng ký"}
              </Button>
            </div>
            <Link
              to="/membership"
              className="text-gray-400 underline hover:text-[#2B8B35] text-sm"
            >
              ← Quay lại trang gói dịch vụ
            </Link>
          </div>
        </div>
        {/* Right: Voucher Card (if any) */}
        {voucher && (
          <div className="flex-1 flex justify-center items-center bg-[#f6fff0] p-6">
            <VoucherCard voucher={voucher} />
          </div>
        )}
      </div>
      <Modal
        open={voucherModal}
        onCancel={() => setVoucherModal(false)}
        footer={null}
        centered
        width={420}
      >
        <VoucherCard voucher={voucher} />
      </Modal>
      <div className="mt-10 text-center text-[#2B8B35] text-lg font-semibold">
        <span role="img" aria-label="leaf">
          🍃
        </span>{" "}
        Đăng ký gói để trải nghiệm AI, nhận ưu đãi và nhiều quyền lợi xanh chỉ có tại GreenBridge!
      </div>
    </div>
  );
};

export default RegisterPackage;
