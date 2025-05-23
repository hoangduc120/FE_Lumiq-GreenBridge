import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const BlogAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBlogs = () => {
    setIsLoading(true);
    setTimeout(() => {
      axiosInstance.get('/blog')
        .then(res => {
          setBlogs(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    }, 1500); // Delay 1.5 giây
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá bài viết này?')) {
      setIsLoading(true);
      axiosInstance.delete(`/blog/${id}`)
        .then(() => {
          setTimeout(() => {
            fetchBlogs();
          }, 1500);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý bài viết</h2>
      <button
        onClick={() => navigate('/admin/blogs/new')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Thêm bài viết
      </button>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-12 h-12 border-t-4 border-b-4 border-green-600 rounded-full animate-spin"></div>
        </div>
      )}
      <table className="w-full table-auto border-collapse">
        {/* ... existing code ... */}
      </table>
    </div>
  );
};

export default BlogAdmin; 