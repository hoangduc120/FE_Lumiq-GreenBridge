import React, { useEffect, useState } from 'react';
import { Checkbox, Form, message, Spin } from 'antd';
import axiosInstance from '../api/axios';

const StepCategories = ({ form }) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = Form.useWatch('categories', form);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/category');
        setCategoryOptions(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        message.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <p>Select the category your goods belong to (max 3):</p>
      <Form.Item
        name="categories"
        rules={[
          { required: true, message: 'Please select at least one category!' },
          {
            validator: (_, value) =>
              value && value.length <= 3
                ? Promise.resolve()
                : Promise.reject(new Error('You can select a maximum of 3 categories!')),
          },
        ]}
      >
        {loading ? (
          <Spin />
        ) : (
          <Checkbox.Group style={{ width: '100%' }}>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((cat) => (
                <Checkbox key={cat._id} value={cat._id}>
                  {cat.name}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        )}
      </Form.Item>

      <div className="mt-4 text-sm text-gray-600">
        Selected: {categories?.length ? categories.length : 0}
      </div>
    </div>
  );
};

export default StepCategories;
