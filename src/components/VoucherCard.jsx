import React from "react";
import { Tag } from "antd";
import {
  GiftOutlined,
  ThunderboltOutlined,
  FireOutlined,
} from "@ant-design/icons";

function VoucherCard({ voucher }) {
  if (!voucher)
    return (
      <div className="text-red-500 p-4 text-center">Không tìm thấy voucher</div>
    );

  return (
    <div
      className="bg-gradient-to-br from-[#eaffd0] via-[#d0ffd6] to-[#b3f7e0] rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-[350px] mx-auto relative overflow-hidden"
      style={{
        border: "2.5px dashed #2B8B35",
      }}
    >
      {/* Icon nổi bật */}
      <div className="absolute -right-6 text-[#2B8B35] opacity-20 text-[6rem] pointer-events-none select-none">
        <GiftOutlined />
      </div>
      <div className="flex items-center justify-between mb-2 z-10 relative">
        <span className="text-lg font-bold text-[#2B8B35] flex items-center gap-1">
          <ThunderboltOutlined className="text-yellow-500" /> ƯU ĐÃI ĐẶC BIỆT
        </span>
        <span className="bg-white text-[#2B8B35] px-3 py-1 rounded-full font-semibold shadow border border-[#2B8B35]">
          {voucher.code}
        </span>
      </div>
      <div className="text-2xl font-extrabold text-[#2B8B35] mb-2 flex items-center gap-2">
        <FireOutlined className="text-orange-500" />
        {voucher.discountType === "percent"
          ? `Giảm ${voucher.discountValue}%`
          : `Giảm ${voucher.discountValue?.toLocaleString()}₫`}
      </div>
      <div className="text-gray-700 mb-1">
        <span className="font-semibold text-[#2B8B35]">Đơn tối thiểu:</span>{" "}
        {voucher.minOrderValue
          ? `${voucher.minOrderValue.toLocaleString()}₫`
          : "Không yêu cầu"}
      </div>
      <div className="text-gray-700 mb-1">
        <span className="font-semibold text-[#2B8B35]">Số lần dùng:</span>{" "}
        {voucher.usageLimit ? voucher.usageLimit : "Không giới hạn"}
      </div>
      <div className="text-gray-700 mb-1">
        <span className="font-semibold text-[#2B8B35]">Thời gian:</span>{" "}
        <span className="font-semibold">
          {voucher.startDate
            ? new Date(voucher.startDate).toLocaleDateString()
            : "-"}{" "}
          -{" "}
          {voucher.endDate
            ? new Date(voucher.endDate).toLocaleDateString()
            : "-"}
        </span>
      </div>
      <div className="text-gray-700 mb-1">
        <span className="font-semibold text-[#2B8B35]">Trạng thái:</span>{" "}
        <span
          className={`font-semibold ${
            voucher.isActive ? "text-green-600" : "text-red-600"
          }`}
        >
          {voucher.isActive ? "Áp dụng" : "Ngừng áp dụng"}
        </span>
      </div>
      <div className="mt-4 text-center">
        <Tag color="success" className="text-base px-4 py-1 rounded-full">
          {voucher.discountType === "percent"
            ? "Tiết kiệm tối đa cho đơn hàng của bạn!"
            : "Giá trị giảm trực tiếp vào hóa đơn!"}
        </Tag>
        <div className="text-xs text-gray-500 mt-2 italic">
          * Áp dụng cho các sản phẩm, dịch vụ thuộc chương trình GreenBridge.
        </div>
      </div>
    </div>
  );
}

export default VoucherCard;
