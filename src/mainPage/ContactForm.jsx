import React from "react";
import { FiUser, FiMail, FiPhone, FiSend } from "react-icons/fi";

const ContactForm = () => {
  return (
    <section className="w-full bg-white py-12 px-6 md:px-20 relative overflow-hidden">
      <h2
        className="text-3xl md:text-4xl font-bold mb-10"
        style={{
          background: "linear-gradient(to right, #3A7F0D, #4BAE4F)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Contact form
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          {[
            { label: "Your name", icon: <FiUser />, placeholder: "Your name" },
            {
              label: "Mail",
              icon: <FiMail />,
              placeholder: "example@email.com",
            },
            {
              label: "Phone",
              icon: <FiPhone />,
              placeholder: "Your phone number",
            },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-400 transition">
                <div className="flex items-center justify-center w-12 h-12 text-gray-500">
                  {field.icon}
                </div>
                <div className="h-6 w-[1px] bg-gray-300" />
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 focus:outline-none rounded-r-md"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col h-full border border-gray-200 rounded-md p-4 bg-[#fafafa]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows="10"
              placeholder="Your message..."
              className="flex-grow resize-none p-3 bg-transparent border border-transparent focus:outline-none rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="relative w-[10%] md:w-[15%] border-2 border-transparent text-[#338255] rounded-full px-6 py-3 font-semibold flex items-center justify-center gap-3 overflow-hidden group"
        >
          {/* Hover background slide-in effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-[#338255] to-[#A6DD3A] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out z-0 rounded-full"></span>

          {/* Icon and text */}
          <FiSend className="w-5 h-5 relative z-10" />
          <span className="relative z-10 group-hover:text-white transition-colors duration-500 ease-in-out cursor-pointer">
            Send Message
          </span>
        </button>
      </div>

      {/* Decorative Bubbles */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full opacity-20 -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-50 rounded-full opacity-30 -z-10 -translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default ContactForm;
