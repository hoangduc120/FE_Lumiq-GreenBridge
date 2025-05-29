import React, { useEffect } from 'react';
import { DatePicker, Form, Input } from 'antd';

const { TextArea } = Input;

const StepDescription = ({ form }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.id) {
      form.setFieldsValue({ gardener: user.id });
    }
  }, [user?.id, form]);

  return (
    <>
      <Form.Item
        name="productName"
        label="Product name"
        rules={[{ required: true, message: 'Please input the product name!' }]}
      >
        <Input placeholder="e.g., Phalaenopsis Orchids" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input the description!' }]}
      >
        <TextArea rows={4} placeholder="e.g., Phalaenopsis orchids, also known as moth orchids..." />
      </Form.Item>

      <Form.Item
        name="unitsAvailable"
        label="Number of units available"
        rules={[{ required: true, message: 'Please input the number of units!' }]}
      >
        <Input type="number" placeholder="e.g., 38" />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: 'Please input the price!' }]}
      >
        <Input placeholder="e.g., 1200" />
      </Form.Item>

      <Form.Item
        name="plantedAt"
        label="Planted at"
        rules={[{ required: true, message: 'Please input the planted date!' }]}
      >
        <DatePicker
          format="DD-MM-YYYY"
          disabledDate={(current) => current && current > new Date()}
        />
      </Form.Item>

      {/* Hidden Field: gardener UID */}
      <Form.Item name="gardener" hidden>
        <Input />
      </Form.Item>
    </>
  );
};

export default StepDescription;
