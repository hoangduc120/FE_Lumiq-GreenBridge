// pages/EditBlog.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import BlogEditor from '../blog/BlogEditor';
import { message, Spin } from 'antd';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(`/blog/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
        message.error('Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async ({ title, content, thumbnail }) => {
    try {
      await axiosInstance.put(`/blog/${id}`, {
        title,
        content,
        thumbnail,
      });
      message.success("Đã cập nhật bài viết");
      navigate("/manage-blog");
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa bài viết</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <BlogEditor
          initialContent={blog.content}
          initialTitle={blog.title}
          isEditMode
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default EditBlog;
