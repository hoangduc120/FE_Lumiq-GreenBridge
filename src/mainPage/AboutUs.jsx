import React from "react";
import { FaLeaf, FaSeedling, FaUsers } from "react-icons/fa";
import { MdSmartToy } from "react-icons/md";


function AboutUs() {
  return (
    <div className="min-h-screen p-8 md:p-16 text-white bg-gradient-to-br from-[#b6e67c] to-[#5fb537]">
      <div className="text-center mb-12 px-auto mx-auto">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg text-[#297F4E]">
          <span className="text-black">About</span> GreenBridge
        </h1>
        <p className="text-xl">
          We're dedicated to connecting people with nature through smart,
          sustainable gardening solutions.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
        {/* Smart Plant Care Section */}
        <div className="flex-1 basis-80 p-8 rounded-xl bg-white/15 backdrop-blur-md shadow-lg border border-white/20 transition-transform hover:scale-105 cursor-pointer">
          <div className="text-5xl mb-4 flex justify-center text-yellow-300">
            <MdSmartToy />
          </div>
          <h2 className="text-2xl mb-4 text-center max-w-70 mx-auto   text-gray-600">
            SMART PLANT CARE WITH AI
          </h2>
          <p className="text-base leading-relaxed">
            Let AI be your personal gardening assistant. Our technology helps
            you identify plants, diagnose issues, and set up smart reminders
            effortlessly.
          </p>
        </div>

        {/* Quality Plants Section */}
        <div className="flex-1 basis-80 p-8 rounded-xl bg-white/15 backdrop-blur-md shadow-lg border border-white/20 transition-transform hover:scale-105 cursor-pointer">
          <div className="text-5xl mb-4 flex justify-center text-yellow-300">
            <FaSeedling />
          </div>
          <h2 className="text-2xl mb-4 text-center max-w-70 mx-auto text-gray-600 ">
            QUALITY PLANTS, EXPERTLY CHOSEN
          </h2>
          <p className="text-base leading-relaxed">
            We handpick and nurture every plant to ensure it thrives in your
            space. Whether for home or office, we've got the perfect greenery
            for you.
          </p>
        </div>

        {/* Community Section */}
        <div className="flex-1 basis-80 p-8 rounded-xl bg-white/15 backdrop-blur-md shadow-lg border border-white/20 transition-transform hover:scale-105 cursor-pointer">
          <div className="text-5xl mb-4 flex justify-center text-yellow-300">
            <FaUsers />
          </div>
          <h2 className="text-2xl mb-4 text-center max-w-70 mx-auto text-gray-600">
            OUR COMMUNITY & PARTNERS
          </h2>
          <p className="text-base leading-relaxed">
            Join a network of plant lovers and experts who share a passion for
            sustainable, smart gardening. Together, we grow greener!
          </p>
        </div>
      </div>

      <div className="text-center mt-16 pt-8 border-t border-white/20">
        <h3 className="mb-4">
          Join us in our mission to bring more green into the world!
        </h3>
        <div className="flex justify-center mt-4">
          <FaLeaf className="text-4xl mx-2" />
        </div>
      </div>

    </div>
  );
}

export default AboutUs;
