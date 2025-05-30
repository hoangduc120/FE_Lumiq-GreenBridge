import React, { useEffect, useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { GrLinkNext } from "react-icons/gr";
import { Link } from "react-router-dom";
import packageApi from "../api/packageApi";
import voucherApi from "../api/voucherApi";
import { Modal, Spin } from "antd";
import VoucherCard from "../components/VoucherCard";

function Membership() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voucherModal, setVoucherModal] = useState({
    open: false,
    loading: false,
    data: null,
  });

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await packageApi.getAll();
        setPackages(
          Array.isArray(res.data) ? res.data : res.data?.packages || []
        );
      } catch (err) {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleVoucherClick = async (code) => {
    setVoucherModal({ open: true, loading: true, data: null });
    try {
      const res = await voucherApi.getByCode(code);
      console.log("Voucher data:", res.data.voucher);

      setVoucherModal({ open: true, loading: false, data: res.data.voucher });
    } catch (err) {
      setVoucherModal({ open: true, loading: false, data: null });
    }
  };

  return (
    <>
      <div className="text-3xl text-center mt-12 font-extrabold text-[#2B8B35] tracking-wide drop-shadow">
        🌱 Đặc quyền thành viên GreenBridge
      </div>
      <div className="text-center text-gray-400 mt-2 mb-8 text-lg">
        Đăng ký gói dịch vụ để tận hưởng AI miễn phí, nhận voucher hấp dẫn, ưu
        đãi độc quyền và nhiều quyền lợi xanh dành riêng cho bạn!
      </div>
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {loading && (
            <div className="col-span-full text-center">
              Đang tải gói dịch vụ...
            </div>
          )}
          {!loading && packages.length === 0 && (
            <div className="col-span-full text-center">
              Không có gói dịch vụ nào.
            </div>
          )}
          {packages.map((pkg, idx) => (
            <div
              key={pkg._id}
              className={`relative bg-black flex flex-col justify-between shadow-xl border-2 rounded-2xl p-8 min-h-[420px] transition-transform duration-200            
              `}
              style={{
                boxSizing: "border-box",
                minWidth: 0,
                width: "100%",
                maxWidth: 350,
                margin: "0 auto",
              }}
            >
              {idx === 0 && (
                 <span className="text-white border-2 border-white rounded-2xl p-2 bg-gradient-to-r from-[#6d7e41] to-[#01c722] px-4 py-1  absolute top-4 right-4 text-md font-bold">
                Phổ biến
                </span>
              )}
              <div>
                <div className="text-3xl text-white mt-2 mb-2 flex items-center gap-2 ">
                  {pkg.name}
                  {pkg.voucherCode && (
                    <span className="ml-2 animate-bounce text-[#D0FF41] font-extrabold">
                      🎁
                    </span>
                  )}
                </div>
                <div className="bg-gray-800 w-full h-[2px] mb-4 rounded" />
                <ul className="mb-4 pb">
                  <li className="flex items-center gap-2 mb-2">
                    <FaRegCheckCircle className="text-green-400" />
                    <span className="text-white">
                      Số lượt AI miễn phí: <b>{pkg.aiFreeUsage ?? 0}</b>
                    </span>
                  </li>
                  <li className="flex items-center gap-2 mb-2">
                    <FaRegCheckCircle className="text-green-400" />
                    <span className="text-white">
                      Thời hạn:{" "}
                      <b>
                        {pkg.duration
                          ? `${pkg.duration} ngày`
                          : "Không giới hạn"}
                      </b>
                    </span>
                  </li>

                  {pkg.voucherCode && (
                    <li className="flex items-center gap-2 mb-2">
                      <FaRegCheckCircle className="text-green-400" />
                      <span
                        className="text-white cursor-pointer font-semibold hover:text-[#a5e32e] transition"
                        onClick={() => handleVoucherClick(pkg.voucherCode)}
                      >
                        🎁 Nhận voucher: {pkg.voucherCode}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="flex-grow" />
              <div className="text-sm text-[#D0FF41] mt-2 text-center">
                {idx === 0
                  ? "Gói được nhiều thành viên lựa chọn nhất!"
                  : "Ưu đãi hấp dẫn, phù hợp mọi nhu cầu"}
              </div>
              <div className="bg-gray-700 w-full h-[0.1px] my-3 rounded" />
              <div className="flex justify-between items-center mt-auto">
                <div className="text-white  text-lg drop-shadow">
                  {pkg.price?.toLocaleString()} VND
                  <span className="text-gray-400 font-normal text-base">
                    {" "}
                    /{pkg.duration} ngày
                  </span>
                </div>
                <Link
                  to={`/package/${pkg._id}`}
                  className="bg-[#D0FF41] text-black p-2 rounded-full font-bold flex items-center shadow hover:bg-[#b6f5c2] transition"
                >
                  Đăng ký ngay
                  <GrLinkNext className="inline-block ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center text-[#2B8B35] mt-8 text-lg font-semibold">
        <span role="img" aria-label="leaf">
          🍃
        </span>{" "}
        Đặc quyền thành viên: Ưu đãi độc quyền, hỗ trợ AI, nhận voucher, và
        nhiều hơn nữa!
      </div>
      <Modal
        open={voucherModal.open}
        onCancel={() =>
          setVoucherModal({ open: false, loading: false, data: null })
        }
        footer={null}
        centered
        width={420}
      >
        {voucherModal.loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <VoucherCard voucher={voucherModal.data} />
        )}
      </Modal>
    </>
  );
}

export default Membership;
