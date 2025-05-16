import React from "react";
import { FooterLogo } from "../../assets";
import { CiMail } from "react-icons/ci";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-white px-6 py-10 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center mb-6">
            <img
              src={FooterLogo}
              alt="GreenBridge Logo"
              className="h-10 mr-3"
            />
            <p className="text-[#2D8952] text-2xl font-semibold">GREENBRIDGE</p>
          </div>
          <p className="text-gray-600 mb-4">
            Join our newsletter to stay up to date on features and releases.
          </p>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <CiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="border-2 border-[#2D8952] rounded-full py-2 pl-10 pr-4 w-full md:max-w-xs"
              />
            </div>
            <button className="bg-white text-[#2D8952] rounded-full py-2 px-4 w-full md:max-w-xs border-2 border-gray-500 hover:bg-[#2D8952] hover:text-white transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#2D8952]">Company</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/about"
                className="text-gray-600 hover:text-[#2D8952] transition-colors duration-200"
              >
                About
              </a>
            </li>
          </ul>
        </div>

        {/* Help Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#2D8952]">Help</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/privacy-policy"
                className="text-gray-600 hover:text-[#2D8952] transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/support"
                className="text-gray-600 hover:text-[#2D8952] transition-colors duration-200"
              >
                Customer Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section with Social Icons */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 GreenBridge. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-500 hover:text-[#2D8952] transition-colors duration-200"
            >
              <FaTwitter className="text-xl" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-[#2D8952] transition-colors duration-200"
            >
              <FaFacebook className="text-xl" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-[#2D8952] transition-colors duration-200"
            >
              <FaInstagram className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
