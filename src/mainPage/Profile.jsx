import { Avatar, Button, DatePicker, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { IoMdReturnLeft, IoMdMail } from "react-icons/io";
import {
  FaUser,
  FaTransgender,
  FaPhoneAlt,
  FaUserTag,
  FaBirthdayCake,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import dayjs from "dayjs";
import { toast } from "react-toastify";

// Yup schema cho profile
const profileSchema = yup.object().shape({
  fullName: yup.string().required("Họ tên không được để trống"),
  nickName: yup.string().required("Biệt danh không được để trống"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"], "Giới tính không hợp lệ"),

  phone: yup
    .string()
    .matches(/^[0-9\-+() ]*$/, "Số điện thoại không hợp lệ")
    .min(6, "Số điện thoại tối thiểu 6 ký tự")
    .max(20, "Số điện thoại tối đa 20 ký tự"),
  yob: yup
    .date()
    .typeError("Năm sinh không được để trống")
    .max(new Date(), "Năm sinh phải nhỏ hơn hiện tại"),
  address: yup.string(),
});

function Profile() {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [editUser, setEditUser] = useState(user);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [avatarUploading, setAvatarUploading] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/profile", {
        withCredentials: true,
      });
      const userData = res.data.data.user;
      userData.yob =
        userData.yob && dayjs(userData.yob).isValid()
          ? dayjs(userData.yob).toDate()
          : "";
      setUser(userData);
      setEditUser(userData);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserProfile = async () => {
    setError("");
    setFieldErrors({});
    try {
      await profileSchema.validate(editUser, { abortEarly: false });
    } catch (validationError) {
      const errors = {};
      validationError.inner.forEach((err) => {
        if (err.path) errors[err.path] = err.message;
      });
      setFieldErrors(errors);
      setError("Please correct the highlighted fields.");
      return;
    }
    try {
      await axios.put("http://localhost:5000/user/profile", editUser, {
        withCredentials: true,
      });
      toast.success("Profile updated successfully!");
      setUser(editUser);
      setEditing(false);
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSave = () => updateUserProfile();

  const handleCancel = () => setEditing(false);

  const handleInputChange = (field) => (e) => {
    setEditUser({ ...editUser, [field]: e.target.value });
  };

  // Upload avatar
  const handleAvatarUpload = async ({ file, onSuccess, onError }) => {
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await axios.put(
        "http://localhost:5000/user/avatar",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const newAvatar = res.data?.data?.user?.avatar;
      if (newAvatar) {
        setEditUser((prev) => ({ ...prev, avatar: newAvatar }));
        setUser((prev) => ({ ...prev, avatar: newAvatar }));
        message.success("Avatar updated!");
        onSuccess && onSuccess(res.data, file);
        fetchUserProfile();
      } else {
        message.error("Upload failed. Please try again.");
        onError && onError(new Error("No avatar returned"));
      }
    } catch (err) {
      message.error("Upload failed. Please try again.");
      onError && onError(err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const inputProps = (field) => ({
    className:
      "w-full bg-transparent outline-none text-xl text-[#3E435D] placeholder:text-gray-400",
    value: editUser[field] || "",
    onChange: handleInputChange(field),
  });

  return (
    <>
      <Link to="/">
        <span className="border-2 flex gap-1 text-[#2B8B35] p-2 rounded-full w-25 ml-40 mt-5">
          <IoMdReturnLeft />
          <p>Quay lại</p>
        </span>
      </Link>

      <div className="container mx-auto mt-10 max-w-6xl">
        <h2 className="text-[#3E435D] text-3xl font-semibold">
          Xin chào, {user.nickName || user.fullName}
        </h2>

        <div className="flex justify-between items-end">
          <div className="flex gap-4 items-center">
            <Upload
              name="avatar"
              showUploadList={false}
              customRequest={handleAvatarUpload}
              withCredentials={true}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage)
                  message.error("Bạn chỉ có thể tải lên tệp hình ảnh!");
                return isImage;
              }}
              disabled={avatarUploading}
            >
              <div className="flex flex-col items-center">
                <Avatar
                  src={editUser.avatar || user.avatar}
                  size={70}
                  className={`cursor-pointer border ${
                    avatarUploading ? "opacity-60" : ""
                  }`}
                />
                <div className="text-xs text-gray-500 text-center cursor-pointer">
                  {avatarUploading ? "Đang tải lên..." : "Đổi ảnh"}
                </div>
              </div>
            </Upload>
            <div className="flex flex-col justify-center gap-2">
              <p className="text-[#3E435D] font-semibold">{user.fullName}</p>
              <p className="text-[#3E435D]">{user.email}</p>
            </div>
          </div>

          {editing ? (
            <div className="flex gap-2">
              <Button type="primary" onClick={handleSave}>
                Lưu
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </div>
          ) : (
            <Button type="primary" onClick={() => setEditing(true)}>
              Chỉnh sửa
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-lg mb-1 flex items-center gap-2">
                <FaUser className="text-[#2B8B35]" /> Họ tên
              </label>
              <div className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-xl text-[#3E435D] shadow-sm w-full min-h-[56px] flex items-center">
                {editing ? (
                  <input {...inputProps("fullName")} />
                ) : (
                  user.fullName
                )}
              </div>
              {editing && fieldErrors.fullName && (
                <div className="text-red-600 text-sm mt-1">
                  {fieldErrors.fullName}
                </div>
              )}
            </div>
            <div>
              <label className="block text-lg mb-1 flex items-center gap-2">
                <FaTransgender className="text-[#2B8B35]" /> Giới tính
              </label>
              <div className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-xl text-[#3E435D] shadow-sm w-full min-h-[56px] flex items-center">
                {editing ? (
                  <select
                    className="w-full bg-transparent outline-none text-xl text-[#3E435D]"
                    value={editUser.gender || ""}
                    onChange={handleInputChange("gender")}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                ) : (
                  user.gender
                )}
              </div>
              {editing && fieldErrors.gender && (
                <div className="text-red-600 text-sm mt-1">
                  {fieldErrors.gender}
                </div>
              )}
            </div>
            <div>
              <label className="block text-lg mb-1 flex items-center gap-2">
                <FaPhoneAlt className="text-[#2B8B35]" /> Số điện thoại
              </label>
              <div className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-xl text-[#3E435D] shadow-sm w-full min-h-[56px] flex items-center">
                {editing ? <input {...inputProps("phone")} /> : user.phone}
              </div>
              {editing && fieldErrors.phone && (
                <div className="text-red-600 text-sm mt-1">
                  {fieldErrors.phone}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-lg mb-1 flex items-center gap-2">
                <FaUserTag className="text-[#2B8B35]" /> Tên sử dụng
              </label>
              <div className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-xl text-[#3E435D] shadow-sm w-full min-h-[56px] flex items-center">
                {editing ? (
                  <input {...inputProps("nickName")} />
                ) : (
                  user.nickName
                )}
              </div>
              {editing && fieldErrors.nickName && (
                <div className="text-red-600 text-sm mt-1">
                  {fieldErrors.nickName}
                </div>
              )}
            </div>
            <div>
              <label className="block text-lg mb-1 flex items-center gap-2">
                <FaBirthdayCake className="text-[#2B8B35]" /> Năm sinh
              </label>
              <div className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-xl text-[#3E435D] shadow-sm w-full min-h-[56px] flex items-center">
                {editing ? (
                  <DatePicker
                    className="w-full bg-transparent outline-none text-xl text-[#3E435D]"
                    value={editUser.yob ? dayjs(editUser.yob) : null}
                    onChange={(date) =>
                      setEditUser({
                        ...editUser,
                        yob: date ? date.toDate() : "",
                      })
                    }
                    format="DD/MM/YYYY"
                    allowClear={false}
                    disabledDate={(current) => current && current > dayjs()}
                    placeholder="Chọn ngày"
                  />
                ) : user.yob ? (
                  dayjs(user.yob).format("DD/MM/YYYY")
                ) : (
                  ""
                )}
              </div>
              {editing && fieldErrors.yob && (
                <div className="text-red-600 text-sm mt-1">
                  {fieldErrors.yob}
                </div>
              )}
            </div>
            <div>
              <label className="block text-lg mb-1 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#2B8B35]" /> Địa chỉ
              </label>
              <div className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-xl text-[#3E435D] shadow-sm w-full min-h-[56px] flex items-center">
                {editing ? <input {...inputProps("address")} /> : user.address}
              </div>
              {editing && fieldErrors.address && (
                <div className="text-red-600 text-sm mt-1">
                  {fieldErrors.address}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          <p className="text-xl flex items-center gap-2">
            <IoMdMail className="text-[#2B8B35]" /> Email của tôi
          </p>
          <div className="flex gap-2 items-center">
            <span className="border-1 bg-blue-100 text-[#4182F9] p-2 rounded-full">
              <IoMdMail className="text-[#4182F9] size-6" />
            </span>
            <div className="px-4 py-3 bg-white text-xl text-[#3E435D] flex items-center w-full max-w-lg">
              {editing ? (
                <input
                  type="email"
                  {...inputProps("email")}
                  className="border rounded-lg px-4 shadow-sm min-h-[56px] border-gray-300 w-full bg-transparent outline-none text-xl text-[#3E435D] placeholder:text-gray-400"
                  placeholder="Nhập email của bạn"
                />
              ) : (
                <div className="bg-white px-4 py-3 rounded-md border shadow-sm text-[#3E435D]">
                  {editUser.email || "Chưa có email"}
                </div>
              )}
            </div>
            {editing && fieldErrors.email && (
              <div className="text-red-600 text-sm mt-1">
                {fieldErrors.email}
              </div>
            )}
          </div>
        </div>
        {error && (
          <div className="mt-4 text-red-600 text-base font-medium">{error}</div>
        )}
      </div>
    </>
  );
}

export default Profile;
