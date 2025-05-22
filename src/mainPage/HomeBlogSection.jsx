import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const HomeBlogSection = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosInstance.get('/blog?limit=4');
        setBlogs(res.data);
      } catch (error) {
        console.error('Failed to load blogs', error);
      }
    };

    fetchBlogs();
  }, []);

  if (!blogs.length) return null;

  const featured = blogs[0];
  const others = blogs.slice(1);

  return (
    <section className="w-full py-12 px-4 md:px-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">News & Updates</h2>
        <Link to="/blogs" className="text-sm text-gray-700 hover:underline font-medium">
          VIEW ALL POSTS →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to={`/blog/${featured._id}`} className="group block border-b pb-4">
          <img
            src={featured.thumbnail || 'https://via.placeholder.com/500'}
            alt={featured.title}
            className="w-full h-64 object-cover rounded-md mb-3 transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <h3 className="text-lg font-semibold text-gray-800">{featured.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mt-1">
            {stripHTML(featured.content).slice(0, 120)}...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {new Date(featured.createdAt).toLocaleDateString()}
          </p>
        </Link>

        <div className="flex flex-col gap-5">
          {others.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog/${blog._id}`}
              className="flex gap-4 group items-start"
            >
              <img
                src={blog.thumbnail || 'https://via.placeholder.com/100'}
                alt={blog.title}
                className="w-24 h-16 object-cover rounded-md transition-transform duration-300 group-hover:scale-[1.05]"
              />
              <div>
                <h4 className="font-semibold text-gray-800 text-sm md:text-base">
                  {blog.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {stripHTML(blog.content).slice(0, 80)}...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

function stripHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export default HomeBlogSection;
