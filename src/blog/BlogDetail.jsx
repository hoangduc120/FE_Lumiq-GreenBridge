import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await axiosInstance.get(`/blog/${id}`);
      setBlog(res.data);
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        By {blog.author?.name || blog.author?.email} • {new Date(blog.createdAt).toLocaleString()}
      </p>
      <div
        className="prose max-w-none mt-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogDetail;
