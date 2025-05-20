import React from "react";
import { FiFacebook, FiInstagram, FiLinkedin, FiMail, FiTwitter, FiYoutube } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 py-10 px-6 md:px-20 text-green-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-10">
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-green-800 font-bold text-lg flex items-center gap-2">
            <span role="img" aria-label="tree">
              🌳
            </span>{" "}
            GREENBRIDGE
          </h3>

          <div className="w-full max-w-xs">
            <div className="flex items-center border border-green-500 rounded-full overflow-hidden mb-2">
              <div className="flex items-center justify-center px-3 text-green-500">
                <FiMail />
              </div>
              <div className="h-6 w-[1px] bg-gray-300" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-3 py-2 outline-none text-sm text-gray-700"
              />
            </div>

            <button className="relative inline-flex items-center justify-center px-10 py-3 text-sm font-medium text-[#338255] rounded-full group overflow-hidden z-10 bg-transparent border-none w-full">
              <span
                className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-[#338255] to-[#A6DD3A] z-0"
                aria-hidden="true"
              ></span>

              <span
                className="absolute inset-0 rounded-full bg-[#fafafa] z-[1]"
                aria-hidden="true"
              ></span>
              <span
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#338255] to-[#A6DD3A] z-[2] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-in-out"
                aria-hidden="true"
              ></span>
              <span className="relative z-[3] transition-colors duration-300 ease-in-out group-hover:text-white">
                Subscribe to Newsletter
              </span>
            </button>
          </div>
          <div className="flex items-center gap-4 pt-2 text-green-800">
            <FiTwitter className="hover:text-green-600 cursor-pointer" />
            <FiFacebook className="hover:text-green-600 cursor-pointer" />
            <FiInstagram className="hover:text-green-600 cursor-pointer" />
            <FiYoutube className="hover:text-green-600 cursor-pointer" />
            <FiLinkedin className="hover:text-green-600 cursor-pointer" />
          </div>
        </div>

        <div className="md:col-span-1">
          <h4 className="text-lg font-semibold mb-4">COMPANY</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Career
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Help */}
        <div className="md:col-span-1">
          <h4 className="text-lg font-semibold mb-4">HELP</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Customer Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Delivery Details
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: FAQ */}
        <div className="md:col-span-1">
          <h4 className="text-lg font-semibold mb-4">FAQ</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Account
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Manage Deliveries
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Orders
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Payments
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;