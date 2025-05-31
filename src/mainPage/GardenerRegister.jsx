import React, { useState } from "react";
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Select,
  Spin
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
  const [accountName, setAccountName] = useState("");
  const [verifying, setVerifying] = useState(false);

  const bankBinMap = {
    Vietcombank: "970436",
    TPBank: "970423",
    "MB Bank": "970422",
    Techcombank: "970407",
  };

  const verifyBankAccount = async () => {
    const { bankAccountNumber, bankName } = form.getFieldsValue();

    if (!bankAccountNumber || !bankName) {
      message.warning("Enter both bank name and account number.");
      return;
    }

    const bin = bankBinMap[bankName];
    if (!bin) {
      message.warning("Bank not supported for auto verification.");
      return;
    }

    try {
      setVerifying(true);
      const res = await axiosInstance.post("/bank/verify", {
        accountNo: bankAccountNumber,
        bin,
      });

      const name = res.data?.data?.accountName;
      if (name) {
        setAccountName(name);
        message.success("Bank account verified!");
      } else {
        throw new Error("No account name returned");
      }
    } catch (err) {
      console.error(err);
      message.error("Verification failed.");
      setAccountName("");
    } finally {
      setVerifying(false);
    }
  };

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
      accountName,
    };

    try {
      setLoading(true);
      await axiosInstance.post("/user/gardener/apply", payload);
      message.success("Application submitted! Wait for admin review.");
      form.resetFields();
      setGardenPhotos([]);
      setCccdPhotos([]);
      setAccountName("");
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
          rules={[{ required: true }]}
        >
          <Input placeholder="e.g. 0909090909" />
        </Form.Item>

        <Form.Item
          name="bankAccountNumber"
          label="Bank Account Number"
          rules={[{ required: true }]}
        >
          <Input.Search
            enterButton={verifying ? <Spin size="small" /> : "Verify"}
            placeholder="e.g. 1234567890"
            onSearch={verifyBankAccount}
          />
        </Form.Item>

        <Form.Item
          name="bankName"
          label="Bank Name"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select bank">
            {Object.keys(bankBinMap).map((bank) => (
              <Option key={bank} value={bank}>
                {bank}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Account Holder Name">
          <Input value={accountName} disabled placeholder="Auto-filled after verify" />
        </Form.Item>

        <Form.Item
          name="nationalId"
          label="National ID / CCCD"
          rules={[{ required: true }]}
        >
          <Input placeholder="e.g. 012345678901" />
        </Form.Item>

        <Form.Item
          name="placeAddress"
          label="Garden Address"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} placeholder="Where is your garden located?" />
        </Form.Item>

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

        <div className="mb-6">
          <p>
            Bằng cách gửi biểu mẫu này, tôi đồng ý với{" "}
            <Link to="/term-and-policies" className="text-blue-500 underline">
              Điều khoản và chính sách
            </Link>{" "}
            của <span className="text-green-600">GreenBridge</span>
          </p>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-green-600"
          >
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GardenerRegister;
