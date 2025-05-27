import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Upload, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axios";
import imageCompression from "browser-image-compression";

const { TextArea } = Input;

const EditPlant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [initialPhotos, setInitialPhotos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({}); // Store initial form values

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const res = await axiosInstance.get(`/product/${id}`);
        const plant = res.data;

        // Prepare initial form values
        const formValues = {
          name: plant.name,
          description: plant.description,
          price: plant.price,
          categories: plant.categories || [],
        };

        const photoList =
          plant.photos?.map((img, index) => ({
            uid: `existing-${index}`,
            name: `Photo-${index}`,
            status: "done",
            url: img.url,
            public_id: img.public_id,
          })) || [];

        // Add photos to form values
        formValues.photos = photoList;

        // Set initial values in form and state
        form.setFieldsValue(formValues);
        setInitialFormValues(formValues); // Store for reset
        setFileList(photoList);
        setInitialPhotos(photoList);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        message.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [id, form]);

  const handleUpload = async (file) => {
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
      if (!url || !public_id) throw new Error("Invalid response from server");

      const newFile = {
        uid: file.uid,
        name: file.name,
        status: "done",
        url,
        public_id,
      };
      setFileList((prev) => [...prev, newFile]);
      // Update form photos field
      form.setFieldsValue({ photos: [...fileList, newFile] });
      return newFile;
    } catch (err) {
      console.error("Upload failed:", err);
      message.error("Image upload failed");
      throw err;
    }
  };

  const handleRemove = async (file) => {
    try {
      await axiosInstance.delete("/upload", {
        data: { public_id: file.public_id },
      });
      const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(updatedFileList);
      form.setFieldsValue({ photos: updatedFileList }); // Update form photos field
      message.success("Image deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      message.error("Failed to delete image");
    }
  };

  const handleSubmit = async (values) => {
    if (!isEditing) return;
    try {
      const photoData = values.photos.map(({ url, public_id }) => ({
        url,
        public_id,
      }));
      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        categories: values.categories,
        photos: photoData,
      };
      await axiosInstance.put(`/product/${id}`, payload);
      message.success("Product updated successfully");
      navigate("/gardener/manage-plant");
    } catch (err) {
      console.error("Update failed:", err);
      message.error("Failed to update product");
    }
  };

  const handleCancel = () => {
    form.setFieldsValue(initialFormValues); // Reset to initial values
    setFileList(initialPhotos);
    setIsEditing(false);
  };

  if (loading)
    return <Spin className="w-full flex justify-center mt-10" size="large" />;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Product</h2>
        {!isEditing ? (
          <Button type="primary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Save
            </Button>
          </div>
        )}
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: "Please input the product name!" }]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <TextArea rows={4} disabled={!isEditing} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please input the price!" }]}
        >
          <Input type="number" disabled={!isEditing} />
        </Form.Item>

        <Form.Item name="categories" label="Categories">
          <Checkbox.Group disabled={!isEditing}>
            <Checkbox value="Indoor">Indoor</Checkbox>
            <Checkbox value="Outdoor">Outdoor</Checkbox>
            <Checkbox value="Herbs">Herbs</Checkbox>
            <Checkbox value="Air-Purifying Plants">Air-Purifying Plants</Checkbox>
            <Checkbox value="Outdoor Garden Plants">Outdoor Garden Plants</Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          name="photos"
          label="Photos"
          rules={[{ required: true, message: "Please upload at least one photo!" }]}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            customRequest={({ file, onSuccess, onError }) =>
              handleUpload(file)
                .then(() => onSuccess())
                .catch(onError)
            }
            onRemove={handleRemove}
            maxCount={10}
            accept="image/*"
            disabled={!isEditing}
          >
            {fileList.length < 10 && isEditing && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* Hidden submit button since we're using a custom Save button */}
        <Form.Item hidden>
          <Button type="primary" htmlType="submit">
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPlant;