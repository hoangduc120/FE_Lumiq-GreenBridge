import React, { useState } from "react";
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Select,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axios";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression";

const { Option } = Select;

const GardenerRegister = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [gardenPhotos, setGardenPhotos] = useState([]);
  const [cccdPhotos, setCccdPhotos] = useState([]);

  const handleUpload = async (file, setFiles) => {
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
      });

      const formData = new FormData();
      formData.append("image", compressed);

      const res = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { url, public_id } = res.data;
      const newFile = {
        uid: file.uid,
        name: file.name,
        status: "done",
        url,
        public_id,
      };

      setFiles((prev) => [...prev, newFile]);
      return newFile;
    } catch (err) {
      console.error("Image upload failed:", err);
      message.error("Failed to upload image");
      return false;
    }
  };

  const handleRemove = async (file, setFiles) => {
    try {
      await axiosInstance.delete("/upload", {
        data: { public_id: file.public_id },
      });
      setFiles((prev) => prev.filter((item) => item.uid !== file.uid));
      return true;
    } catch (err) {
      console.error("Failed to delete image:", err);
      message.error("Failed to delete image");
      return false;
    }
  };

  const handleSubmit = async (values) => {
    if (gardenPhotos.length === 0 || cccdPhotos.length === 0) {
      return message.error("Please upload both garden and CCCD photos");
    }

    const payload = {
      ...values,
      gardenPhotos,
      cccdPhotos,
    };

    try {
      setLoading(true);
      await axiosInstance.post("/user/gardener/apply", payload);
      message.success("Application submitted! Wait for admin review.");
      form.resetFields();
      setGardenPhotos([]);
      setCccdPhotos([]);
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Register as a Gardener</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="e.g. 0909090909" />
        </Form.Item>

        <Form.Item
          name="bankAccountNumber"
          label="Bank Account Number"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="e.g. 1234567890" />
        </Form.Item>

        <Form.Item
          name="bankName"
          label="Bank Name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select placeholder="Select bank">
            <Option value="Vietcombank">Vietcombank</Option>
            <Option value="TPBank">TPBank</Option>
            <Option value="MB Bank">MB Bank</Option>
            <Option value="Techcombank">Techcombank</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="nationalId"
          label="National ID / CCCD"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="e.g. 012345678901" />
        </Form.Item>

        <Form.Item
          name="placeAddress"
          label="Garden Address"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input.TextArea rows={3} placeholder="Where is your garden located?" />
        </Form.Item>

        {/* Upload Garden Photos */}
        <Form.Item label="Garden Photos" required>
          <Upload
            listType="picture-card"
            fileList={gardenPhotos}
            customRequest={({ file, onSuccess }) =>
              handleUpload(file, setGardenPhotos).then(() => onSuccess())
            }
            onRemove={(file) => handleRemove(file, setGardenPhotos)}
            maxCount={5}
            accept="image/*"
          >
            {gardenPhotos.length < 5 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* Upload CCCD */}
        <Form.Item label="CCCD Photos (Front and Back)" required>
          <Upload
            listType="picture-card"
            fileList={cccdPhotos}
            customRequest={({ file, onSuccess }) =>
              handleUpload(file, setCccdPhotos).then(() => onSuccess())
            }
            onRemove={(file) => handleRemove(file, setCccdPhotos)}
            maxCount={2}
            accept="image/*"
          >
            {cccdPhotos.length < 2 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <div className="mb-8">
          <p>
            Bằng cách gửi biểu mẫu này, tôi đồng ý với{" "}
            <Link className="mx-1" to="/term-and-policies">
              Điều khoản và chính sách
            </Link>{" "}
            của <span className="text-green-600 ml-1">GreenBridge</span>
          </p>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-green-600 mt-4"
          >
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GardenerRegister;
