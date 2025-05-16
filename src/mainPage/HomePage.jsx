import { Link } from "react-router-dom";
import { Search, User, ShoppingCart, ChevronRight } from "lucide-react";

import { useState } from "react";
import NewsCard from "../components/newscard/NewsCard";
import Countdown from "../components/countdown/countdown";

const Home = () => {
  // return (
  //   <div>
  //     <HomeHero />
  //   </div>
  // );
  // State for notification bar
  const [showNotification, setShowNotification] = useState(true);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-6 leading-tight">
                Your Home <br /> for Help
              </h1>
              <Link to="/services">
                <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 flex items-center gap-2 mx-auto md:mx-0 shadow-md transition duration-300">
                  <div className="bg-white p-1 rounded-full">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  Explore Our Services
                </button>
              </Link>
            </div>

            <div className="md:w-1/2 relative">
              <div className="relative w-64 h-64 mx-auto md:w-80 md:h-80">
                <div className="absolute right-0 w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/Image.png"
                    alt="Assorted plants"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/Ellipse 4.png"
                    alt="Bonsai tree"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link to="/membership">
              <button className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-green-100 shadow-md transition duration-300">
                Join Membership
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative Leaves */}
        <img
          src="/Rectangle 41.png"
          alt=""
          className="absolute top-10 left-10 w-20 md:w-24 opacity-60 z-0 animate-pulse"
        />
        <img
          src="/Rectangle 41.png"
          alt=""
          className="absolute top-20 right-20 w-24 md:w-28 opacity-60 z-0 animate-pulse"
        />
        <img
          src="/Rectangle 41.png"
          alt=""
          className="absolute bottom-10 left-20 w-16 md:w-20 opacity-60 z-0 animate-pulse"
        />
        <img
          src="/Rectangle 41.png"
          alt=""
          className="absolute bottom-20 right-10 w-28 md:w-32 opacity-60 z-0 animate-pulse"
        />
      </section>

      {/* Discover Section */}
      <section className="bg-gray-800 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <img
              src="/Image.png"
              alt="Bonsai tree"
              className="rounded-lg object-cover w-full shadow-xl"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Yourself <br /> With Nature
            </h2>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Embrace the beauty of nature with our curated plant collections and expert gardening tips.
            </p>
            <Link to="/explore">
              <button className="border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition duration-300">
                Explore Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">News & Updates</h2>
            <Link
              to="/news"
              className="text-sm text-green-600 font-semibold flex items-center hover:text-green-700"
            >
              View All Posts <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NewsCard
              image="/Image 3.png"
              title="Plants Around Us"
              description="Discover the latest trends in urban gardening and sustainable living."
              date="December 23, 2021"
              large
            />
            <NewsCard
              image="/Image 3.png"
              title="Lush Gardens"
              description="Get ready! Lush Gardens exhibition is coming to your city."
              date="December 13, 2021"
            />
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 px-6 bg-green-50 relative">
        <div className="max-w-7xl mx-auto text-center">
          <Countdown />
          <div className="mt-8">
            <img
              src="/image 3.png"
              alt="Bonsai exhibition"
              className="mx-auto rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
          <div className="mt-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Bonsai Connect & Market Hub 2025
            </h3>
            <Link to="/subscribe">
              <button className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 shadow-md transition duration-300">
                Subscribe Now
              </button>
            </Link>
          </div>
        </div>
        <img
          src="/Rectangle 41.png"
          alt=""
          className="absolute bottom-10 left-10 w-20 opacity-60 animate-pulse"
        />
        <img
          src="/Rectangle 41.png"
          alt=""
          className="absolute bottom-10 right-10 w-20 opacity-60 animate-pulse"
        />
      </section>
    </main>
  );
};

export default Home;