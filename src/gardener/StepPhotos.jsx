import React, { useEffect, useState } from 'react';
import { Form, Button, message, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import axiosInstance from '../api/axios';
import imageCompression from 'browser-image-compression';
import LoadingAnimation from '../animations/loading-animation';

const StepPhotos = ({ form }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({ photos: fileList }); // Sync fileList with form
  }, [fileList, form]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (fileList.length + files.length > 10) {
      message.error('You can upload a maximum of 10 images');
      return;
    }

    setUploading(true);
    for (let file of files) {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920 };
        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append('image', compressedFile);

        const res = await axiosInstance.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000,
        });

        const { url, public_id } = res.data;

        if (!url || !public_id) throw new Error('Invalid response');

        const newFile = {
          uid: Date.now().toString() + Math.random(), // unique ID
          name: file.name,
          url,
          public_id,
        };

        setFileList((prev) => [...prev, newFile]);
      } catch (err) {
        console.error('Upload error:', err);
        message.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
  };

  const handleRemove = async (file) => {
    try {
      await axiosInstance.delete('/upload', {
        data: { public_id: file.public_id },
      });
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
      message.success('Image deleted');
    } catch (err) {
      console.error('Delete error:', err);
      message.error('Failed to delete image');
    }
  };

  return (
    <div>
      <p>Add product photos (max 10)</p>
      <Form.Item
        name="photos"
        rules={[{ required: true, message: 'Please upload at least one photo!' }]}
      >
        <div style={{ position: 'relative', height: '50vh' }}>
          {uploading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <LoadingAnimation />
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {fileList.map((file) => (
              <div
                key={file.uid}
                style={{
                  position: 'relative',
                  width: 120,
                  height: 120,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={file.url}
                  alt={file.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Button
                  type="text"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  size="small"
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(255,255,255,0.8)',
                  }}
                  onClick={() => handleRemove(file)}
                />
              </div>
            ))}
            {fileList.length < 10 && (
              <label
                style={{
                  width: 120,
                  height: 120,
                  border: '1px dashed #ccc',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
                <div style={{ textAlign: 'center' }}>
                  <PlusOutlined />
                  <div style={{ fontSize: 12 }}>Upload</div>
                </div>
              </label>
            )}
          </div>
        </div>
      </Form.Item>
    </div>
  );
};

export default StepPhotos;