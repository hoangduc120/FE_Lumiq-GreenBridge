import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import packageApi from "../../api/packageApi";

const ManagePackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await packageApi.getAll();
      setPackages(res?.data?.packages || []);
    } catch (err) {
      message.error("Lấy danh sách gói thất bại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await packageApi.update(editingId, values);
        message.success("Cập nhật gói thành công");
      } else {
        await packageApi.create(values);
        message.success("Tạo gói mới thành công");
      }
      setModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchPackages();
    } catch (err) {
      message.error("Thao tác thất bại");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await packageApi.delete(id);
      message.success("Xóa gói thành công");
      fetchPackages();
    } catch (err) {
      message.error("Xóa thất bại");
      console.error(err);
    }
  };

  // Handle edit button click
  const handleEdit = (record) => {
    setEditingId(record._id); // Sửa lại dùng _id
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      aiFreeUsage: record.aiFreeUsage,
      voucherCode: record?.voucherCode,
      duration: record.duration,
    });
    setModalVisible(true);
  };

  // Handle add button click
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price?.toFixed ? price.toFixed(2) : price}`,
    },
    {
      title: "Số lượt AI miễn phí",
      dataIndex: "aiFreeUsage",
      key: "aiFreeUsage",
      render: (val) => val ?? "-",
    },
    {
      title: "Thời hạn",
      dataIndex: "duration",
      key: "duration",
      render: (val) => (val ? `${val} ngày` : "-"),
    },
  
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa gói này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý gói</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm gói
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={packages}
        rowKey="_id" // Sửa lại dùng _id
        loading={loading}
      />

      <Modal
        title={editingId ? "Chỉnh sửa gói" : "Thêm gói"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên gói"
            rules={[{ required: true, message: "Vui lòng nhập tên gói" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: "100%" }}
              prefix="$"
            />
          </Form.Item>

          <Form.Item name="aiFreeUsage" label="Số lượt AI miễn phí">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="duration" label="Thời hạn (ngày)">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="voucherCode" label="Mã voucher">
            <Input placeholder="Nhập mã voucher (nếu có)" />
          </Form.Item>

          <Form.Item className="mb-0 mt-4 text-right">
            <Button onClick={() => setModalVisible(false)} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingId ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagePackage;
