import React from "react";
import { Link } from "react-router-dom";
import { Bonsai, Leaf, MiniBonsai } from "../assets";

const HomeHero = () => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #E6F2DF, #8FDA61)",
        minHeight: "calc(100vh - 64px)", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={Leaf}
        alt="leaf"
        className="absolute top-16 left-6 w-28 opacity-70"
      />
      <img
        src={Leaf}
        alt="leaf"
        className="absolute top-28 right-16 w-28 opacity-70"
      />
      <img
        src={Leaf}
        alt="leaf"
        className="absolute bottom-60 left-20 w-28 opacity-70"
      />
      <img
        src={Leaf}
        alt="leaf"
        className="absolute bottom-28 right-24 w-28 opacity-70"
      />
      <img
        src={Leaf}
        alt="leaf"
        className="absolute bottom-40 left-[50%] w-28 opacity-70 -translate-x-1/2"
      />

      <div className="flex flex-col items-center text-center space-y-6 z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 leading-snug">
          Your home <br /> for help
        </h1>
        <Link
          to="/services"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-full shadow-md hover:bg-green-100 transition"
        >
          🌳{" "}
          <span className="ml-2">
            EXPLORE OUR <div className="mt-2"> SERVICES NOW </div>
          </span>
        </Link>
      </div>

      {/* Bonsai Images - fixed to bottom right */}
      <div className="absolute bottom-10 right-10 z-10">
        <div className="relative w-[320px] h-[320px] flex items-center justify-center">
          {/* Vòng tròn overlay */}
          <div className="absolute w-[320px] h-[320px] rounded-full bg-green-200 opacity-30 -z-10" />

          {/* Ảnh lớn */}
          <img
            src={Bonsai}
            alt="Main bonsai"
            className="w-52 h-52 md:w-64 md:h-64 rounded-full border-4 border-white object-cover shadow-xl relative z-10"
          />

          {/* Ảnh nhỏ chồng lên ảnh lớn (bottom-left) */}
          <img
            src={MiniBonsai}
            alt="Mini bonsai"
            className="absolute bottom-4 left-6 w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white object-cover shadow-lg z-20"
          />
        </div>
      </div>

      <div className="absolute bottom-32 left-32 z-10">
        <Link
          to="/membership"
          className="relative inline-flex items-center justify-center px-10 py-4 rounded-full border-2 text-lg font-semibold 
               text-[#338255] border-transparent group overflow-hidden z-10"
        >
          <span
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#338255] to-[#A6DD3A] 
                 scale-x-0 origin-left transition-transform duration-500 ease-in-out group-hover:scale-x-100 z-0"
          ></span>
          <span className="relative z-10 transition-colors duration-500 ease-in-out group-hover:text-white">
            Membership
          </span>
          <span
            className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-[#338255] to-[#A6DD3A] z-[-1]"
            aria-hidden="true"
          ></span>
        </Link>
      </div>
    </section>
  );
};

export default HomeHero;
