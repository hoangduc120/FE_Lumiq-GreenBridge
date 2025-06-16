import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Tag,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import voucherApi from "../../api/voucherApi";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeVi from "antd/es/date-picker/locale/vi_VN";
dayjs.extend(customParseFormat);

const { Option } = Select;
const { RangePicker } = DatePicker;

function ManageVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await voucherApi.getAll();
      setVouchers(
        Array.isArray(res.data) ? res.data : res.data?.vouchers || []
      );
    } catch (err) {
      message.error("Lấy danh sách voucher thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleSubmit = async (values) => {
    try {
      let startDate, endDate;
      if (values.dateRange && values.dateRange.length === 2) {
        startDate = values.dateRange[0].toISOString();
        endDate = values.dateRange[1].toISOString();
      }
      const data = {
        ...values,
        startDate,
        endDate,
      };
      delete data.dateRange;
      if (editingId) {
        await voucherApi.update(editingId, data);
        message.success("Cập nhật voucher thành công");
      } else {
        await voucherApi.create(data);
        message.success("Tạo voucher mới thành công");
      }
      setModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchVouchers();
    } catch (err) {
      console.log(err.message);

      message.error(err.message || "Thao tác thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await voucherApi.delete(id);
      message.success("Xóa voucher thành công");
      fetchVouchers();
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      code: record.code,
      discountType: record.discountType,
      discountValue: record.discountValue,
      minOrderValue: record.minOrderValue,
      usageLimit: record.usageLimit,
      dateRange: [
        record.startDate ? dayjs(record.startDate) : null,
        record.endDate ? dayjs(record.endDate) : null,
      ],
      isActive: record.isActive,
    });
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Mã voucher",
      dataIndex: "code",
      key: "code",
      render: (code) => (
        <Tag color="green" icon={<GiftOutlined />}>
          {code}
        </Tag>
      ),
    },
    {
      title: "Loại giảm",
      dataIndex: "discountType",
      key: "discountType",
      render: (type) =>
        type === "percent" ? (
          <Tag color="blue">%</Tag>
        ) : (
          <Tag color="orange">VNĐ</Tag>
        ),
    },
    {
      title: "Giá trị",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (val, record) =>
        record.discountType === "percent"
          ? `${val}%`
          : `${val.toLocaleString()}₫`,
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "minOrderValue",
      key: "minOrderValue",
      render: (val) => (val ? `${val.toLocaleString()}₫` : "-"),
    },
    {
      title: "Giới hạn lượt",
      dataIndex: "usageLimit",
      key: "usageLimit",
      render: (val) => (val ? val : "Không giới hạn"),
    },
    {
      title: "Đã dùng",
      dataIndex: "usedCount",
      key: "usedCount",
      render: (val) => val || 0,
    },
    {
      title: "Hiệu lực",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) =>
        active ? (
          <Tag color="green">Đang áp dụng</Tag>
        ) : (
          <Tag color="red">Ngừng áp dụng</Tag>
        ),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, record) => (
        <Tooltip
          title={
            <>
              <div>
                Bắt đầu:{" "}
                {record.startDate
                  ? dayjs(record.startDate).format("DD/MM/YYYY")
                  : "-"}
              </div>
              <div>
                Kết thúc:{" "}
                {record.endDate
                  ? dayjs(record.endDate).format("DD/MM/YYYY")
                  : "-"}
              </div>
            </>
          }
        >
          <span>
            {record.startDate ? dayjs(record.startDate).format("DD/MM") : "-"} -{" "}
            {record.endDate ? dayjs(record.endDate).format("DD/MM") : "-"}
          </span>
        </Tooltip>
      ),
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
            title="Bạn chắc chắn muốn xóa voucher này?"
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
        <h1 className="text-2xl font-bold text-[#2B8B35] flex items-center gap-2">
          <GiftOutlined /> Quản lý voucher
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm voucher
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
        className="shadow rounded-lg"
      />

      <Modal
        title={editingId ? "Chỉnh sửa voucher" : "Thêm voucher"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discountType"
            label="Loại giảm"
            rules={[{ required: true, message: "Chọn loại giảm" }]}
          >
            <Select>
              <Option value="percent">Phần trăm (%)</Option>
              <Option value="fixed">Số tiền (VNĐ)</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="discountValue"
            label="Giá trị giảm"
            rules={[{ required: true, message: "Nhập giá trị giảm" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="minOrderValue" label="Đơn tối thiểu">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="usageLimit" label="Giới hạn lượt sử dụng">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Thời gian áp dụng"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày bắt đầu và kết thúc",
              },
              {
                validator: (_, value) =>
                  value && value.length === 2 && value[0] && value[1]
                    ? Promise.resolve()
                    : Promise.reject(
                      "Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc"
                    ),
              },
            ]}
          >
            <RangePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              locale={localeVi}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
            <Select>
              <Option value={true}>Áp dụng</Option>
              <Option value={false}>Ngừng áp dụng</Option>
            </Select>
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
}

export default ManageVoucher;
