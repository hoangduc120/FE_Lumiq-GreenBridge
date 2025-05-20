import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { GrLinkNext } from "react-icons/gr";
import { Link } from "react-router-dom";
function Membership() {
  return (
    <>
      <div className="text-2xl text-center mt-15 font-semibold">
        Upgrade your plant to explore more privilege{" "}
      </div>
      <div className="flex gap-5 justify-center mt-10">
        <div className="bg-black w-1/3 rounded-2xl p-10">
          <span className="text-white border-2 border-white rounded-2xl p-2 bg-gradient-to-r from-[#6d7e41] to-[#01c722]">
            MOST POPULAR
          </span>
          <div className="text-4xl text-white mt-5">Premium AI Services</div>
          <div className="bg-gray-800 w-100 h-[2px]"> </div>
          <div className="flex gap-2 mt-5">
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 w-100 h-[0.1px] mt-5"> </div>
          <div className="mt-8 flex justify-between">
            <div className="text-gray-500">
              <span className="text-white">200.000VND</span> /month
            </div>
            <Link to="/package" className="bg-[#D0FF41] p-2 rounded-full px-4">
              Start Now
              <GrLinkNext className="inline-block ml-2" />
            </Link>
          </div>
        </div>
        <div className="bg-black w-1/3 rounded-2xl p-10">
          <div className="text-4xl text-white mt-10">Supscription Plans</div>
          <div className="bg-gray-800 w-100 h-[2px]"> </div>
          <div className="flex gap-2 mt-5">
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
              <div className="flex gap-2 mt-5">
                <FaRegCheckCircle className="text-green-500 inline-block mr-2" />
                <p className="text-white">Access to all premium features</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 w-100 h-[0.1px] mt-5"> </div>
          <div className="mt-8 flex justify-between">
            <div className="text-gray-500">
              <span className="text-white">120.000VND</span> /month
            </div>
            <Link to="/package" className="bg-[#D0FF41] p-2 rounded-full px-4">
              Start Now
              <GrLinkNext className="inline-block ml-2" />
            </Link>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default Membership;
