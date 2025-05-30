import React, { useEffect, useState } from 'react';
import { Button, Spin, Steps, Form, message, Empty } from 'antd';
import { PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import StepDescription from './StepDescription';
import StepCategories from './StepCategories';
import StepPhotos from './StepPhotos';
import axiosInstance from '../api/axios';

const { Step } = Steps;

const AddPlant = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form] = Form.useForm();
  const [resetSignal, setResetSignal] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  const steps = [
    { title: 'Description', content: <StepDescription form={form} />, fields: ['productName', 'description', 'unitsAvailable', 'price', "plantedAt"] },
    { title: 'Categories', content: <StepCategories form={form} />, fields: ['categories'] },
    { title: 'Photos', content: <StepPhotos form={form} resetSignal={resetSignal} />, fields: ['photos'] },
  ];

  const handleNext = () => {
    const currentFields = steps[currentStep - 1].fields;
    form
      .validateFields(currentFields) // Validate only the current step's fields
      .then((values) => {
        console.log('Validation passed with values:', values);
        if (currentStep < steps.length) {
          setCurrentStep(currentStep + 1);
        }
      })
      .catch((err) => {
        console.error('Validation failed:', err);
        message.error('Please fill all required fields for this step!');
      });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      const values = await form.validateFields(); // Validate all fields on finish
      console.log('Form values before submission:', values);

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === 'photos') {
          const photoUrls = values.photos.map((file) => file.url);
          formData.append('photos', JSON.stringify(photoUrls));
        } else if (key === 'categories') {
          formData.append('categories', JSON.stringify(values.categories));
        } else {
          formData.append(key, values[key]);
        }
      });

      // Debug: Log formData entries
      for (let [key, value] of formData.entries()) {
        console.log(`formData entry: ${key}: ${value}`);
      }

      await axiosInstance.post('/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Product added successfully!');
      setResetSignal(prev => prev + 1);
      setCurrentStep(1);
      form.setFieldsValue({ gardener: user.id });
      form.resetFields();
    } catch (err) {
      console.error('Failed to add product:', err);
      message.error(err.response.data.error);
    }
  };

  return (
    <div className="bg-[#fafafa] backdrop-blur-sm rounded-lg p-6 shadow-md min-h-[70vh]">
      <div className="mt-6">
        <Steps current={currentStep - 1} className="mb-6">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Form form={form} layout="vertical"  initialValues={{
    gardener: user?.id,
  }} onFinish={currentStep === steps.length ? handleFinish : handleNext}>
          <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            {steps[0].content}
          </div>
          <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
            {steps[1].content}
          </div>
          <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
            {steps[2].content}
          </div>
          <div className="flex justify-between mt-6">
            <Button icon={<LeftOutlined />} onClick={handleBack} disabled={currentStep === 1}>
              Back
            </Button>
            <Button
              type="primary"
              icon={currentStep === steps.length ? null : <RightOutlined />}
              onClick={currentStep === steps.length ? handleFinish : handleNext}
            >
              {currentStep === steps.length ? 'Post' : 'Next'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddPlant;