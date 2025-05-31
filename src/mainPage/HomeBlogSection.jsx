import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";

const HomeBlogSection = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosInstance.get("/blog?limit=4");
        setBlogs(res.data);
      } catch (error) {
        console.error("Failed to load blogs", error);
      }
    };

    fetchBlogs();
  }, []);

  if (blogs.length === 0) return null;

  const featured = blogs[0];
  const others = blogs.slice(1, 4);

  return (
    <section className="w-full max-w-7xl mx-auto px-10 py-12">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-10">
        <h2 className="text-2xl font-semibold text-gray-700">News & Updates</h2>
        <Link
          to="/blogs"
          className="text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          VIEW ALL POSTS &rarr;
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Featured Post - ảnh chữ nhật */}
        <Link to={`/blog/${featured._id}`} className="flex-[0.55] group">
          <div
            className="overflow-hidden rounded-md mb-5"
            style={{ aspectRatio: "4 / 3" }}
          >
            <img
              src={featured.thumbnail || "https://via.placeholder.com/600x450"}
              alt={featured.title}
              className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300 mb-3">
            {featured.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-4">
            {stripHTML(featured.content).slice(0, 180)}...
          </p>
          <p className="text-xs text-gray-500">
            {new Date(featured.createdAt).toLocaleDateString()}
          </p>
        </Link>

        {/* Other Posts - ảnh và chữ rộng hơn */}
        <div className="flex flex-col flex-shrink-0 w-full md:flex-[0.45] space-y-8">
          {others.map((blog) => (
            <Link
              to={`/blog/${blog._id}`}
              key={blog._id}
              className="flex items-start gap-6 group"
            >
              <div className="w-32 h-24 overflow-hidden rounded-md flex-shrink-0">
                <img
                  src={blog.thumbnail || "https://via.placeholder.com/150x112"}
                  alt={blog.title}
                  className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {blog.title}
                </h4>
                <p className="text-base text-gray-600 line-clamp-3 mt-2">
                  {stripHTML(blog.content).slice(0, 120)}...
                </p>
                <p className="text-sm text-gray-400 mt-3">
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
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export default HomeBlogSection;
