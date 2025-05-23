import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Space, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const BlogAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/blog');
      setBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      message.error('Lỗi khi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showDeleteConfirm = (id) => {
    setDeletingId(id);
    Modal.confirm({
      title: 'Xác nhận xoá bài viết',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc muốn xoá bài viết này không?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        setDeletingId(null);
      },
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/blog/${id}`);
      message.success('Đã xoá bài viết');
      setBlogs(blogs.filter((blog) => blog._id !== id)); // Optimistic update
      fetchBlogs(); // Ensure data consistency
    } catch (err) {
      console.error('Error deleting blog:', err);
      message.error('Xoá thất bại');
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <strong>{text}</strong>,
      sorter: (a, b) => a.title.localeCompare(b.title), // Add sorting
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // Sort by date
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => navigate(`/blog/edit/${record._id}`)}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => showDeleteConfirm(record._id)}
            loading={deletingId === record._id} // Show loading on delete button
          >
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Quản lý bài viết</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/blogs/new')}
        >
          Thêm bài viết
        </Button>
      </div>

      <Spin spinning={loading} size="large">
        <Table
          dataSource={blogs}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={{ pageSize: 6 }}
          locale={{ emptyText: 'Không có bài viết nào' }} // Custom empty text
        />
      </Spin>
    </div>
  );
};

export default BlogAdmin;