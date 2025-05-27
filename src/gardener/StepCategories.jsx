import React from 'react';
import { Checkbox, Form } from 'antd';

const StepCategories = ({ form }) => {
  const categories = Form.useWatch('categories', form);

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
        <Checkbox.Group style={{ width: '100%' }}>
          <div className="grid grid-cols-2 gap-2">
            <Checkbox value="Indoor Plants">Indoor Plants</Checkbox>
            <Checkbox value="Office Plants">Office Plants</Checkbox>
            <Checkbox value="Ornamental Plants">Ornamental Plants</Checkbox>
            <Checkbox value="Outdoor Garden Plants">Outdoor Garden Plants</Checkbox>
            <Checkbox value="Exotic & Rare Plants">Exotic & Rare Plants</Checkbox>
            <Checkbox value="Air-Purifying Plants">Air-Purifying Plants</Checkbox>
            <Checkbox value="Medicinal & Herbal Plants">Medicinal & Herbal Plants</Checkbox>
            <Checkbox value="Fruiting & Edible Plants">Fruiting & Edible Plants</Checkbox>
            <Checkbox value="Properties">Properties</Checkbox>
          </div>
        </Checkbox.Group>
      </Form.Item>
      <div className="mt-4">
        <p>Selected categories: {categories?.join(', ') || 'None'}</p>
      </div>
    </div>
  );
};

export default StepCategories;