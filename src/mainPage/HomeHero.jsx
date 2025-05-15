import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bonsai, Leaf, MiniBonsai } from '../assets';

const HomeHero = () => {

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #E6F2DF, #8FDA61)',
      }}
    >

      <img src={Leaf} alt="leaf" className="absolute top-16 left-6 w-48 opacity-70" />
      <img src={Leaf} alt="leaf" className="absolute top-[180px] right-16 w-48 opacity-70" />
      <img src={Leaf} alt="leaf" className="absolute bottom-[320px] left-[360px] w-48 opacity-70" />
      <img src={Leaf} alt="leaf" className="absolute bottom-[60px] right-[80px] w-48 opacity-70" />
      <img src={Leaf} alt="leaf" className="absolute bottom-[160px] left-[720px] w-48 opacity-70" />

      <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-20 z-10 relative h-full gap-10 md:gap-20">
        <div className="flex flex-col items-start justify-center text-left mt-12 px-6 py-28 z-10 relative">
        <h1 className="text-[40px] md:text-5xl font-bold text-green-900 leading-snug">
          Your home <br /> for help
        </h1>
        <Link
          to="/services"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-full shadow-md hover:bg-green-100 transition"
        >
          🌳 <span className="ml-2">EXPLORE OUR <div className="mt-2"> SERVICES NOW </div></span>
        </Link>
      </div>
        <div className="absolute -bottom-20 right-80 flex items-end gap-4">
          
          <img
            src={Bonsai}
            alt="bonsai"
            className="relative z-10 w-72 h-72 rounded-full object-cover border-4 border-white shadow-lg"
          />

          <img
            src={MiniBonsai}
            alt="small bonsai"
            className="absolute bottom-[-20px] left-[-30px] w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg z-10"
          />
        </div>
      </div>

      <div className="absolute bottom-32 left-20">
        <Link
          to="/membership"
          className="bg-gradient-to-r from-[#338255] to-[#A6DD3A] text-white font-semibold py-3 px-8 rounded-full shadow-md hover:scale-105 transition"
        >
          Membership
        </Link>
      </div>
    </div>
  );
};

export default HomeHero;