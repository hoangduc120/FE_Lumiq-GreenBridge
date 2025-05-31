import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axios';

const AddCategory = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axiosInstance.post('http://localhost:5000/category', values);
      message.success('Thêm danh mục thành công!');
      form.resetFields();
    } catch (error) {
      message.error('Thêm danh mục thất bại. Vui lòng thử lại.');
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card
        title={
          <h2 className="text-2xl font-bold text-gray-800">
            Thêm Danh Mục Mới
          </h2>
        }
        className="shadow-lg"
        style={{
          borderRadius: '8px',
          background: '#fff',
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ name: '' }}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục!' },
              { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự!' },
            ]}
          >
            <Input
              placeholder="Nhập tên danh mục"
              size="large"
              className="rounded-md"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={loading}
              className="bg-green-600 hover:bg-green-700 border-none rounded-md"
              size="large"
            >
              Thêm danh mục
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCategory;