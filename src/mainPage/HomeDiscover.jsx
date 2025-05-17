import React from 'react';
import { Link } from 'react-router-dom';
import { Discover, DiscoverSmall } from '../assets';

const HomeDiscover = () => {
  return (
    <section className="w-full bg-[#343D33] px-6 md:px-20">
      <div className="flex flex-col justify-center items-center min-h-screen py-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-12">
          <img
            src={DiscoverSmall}
            alt="bonsai"
            className="w-full md:w-[400px] object-cover rounded-md"
          />

          <div className="text-white max-w-md space-y-4 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Discover Yourself <br /> With Nature
            </h2>
            <p className="text-sm md:text-base leading-relaxed">
              A trend that was long in the making is quickly becoming mainstream – AI generated texts and images.
              We tried generating Bonsai designs and were amazed with some of the outcomes!
            </p>
            <Link
              to="/viewall"
              className="inline-block border border-white text-white px-6 py-2 text-sm hover:bg-white hover:text-[#384539] transition"
            >
              EXPLORE
            </Link>
          </div>
        </div>
        <img
          src={Discover}
          alt="plants by window"
          className="w-full max-w-4xl mx-auto rounded-md object-cover"
        />
      </div>
    </section>
  );
};

export default HomeDiscover;
