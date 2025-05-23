import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axiosInstance.get('/blog').then((res) => setBlogs(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 pt-8">
      <h1 className="text-3xl font-bold mb-6">All Blog Posts</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link key={blog._id} to={`/blogs/${blog._id}`} className="group">
            <img
              src={blog.thumbnail || 'https://via.placeholder.com/400'}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-md group-hover:opacity-90"
            />
            <h2 className="text-xl font-semibold mt-3">{blog.title}</h2>
            <p className="text-gray-500 text-sm pt-1 pb-2">
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mt-2 line-clamp-3">
              {stripHTML(blog.content).slice(0, 100)}...
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

function stripHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export default BlogList;
