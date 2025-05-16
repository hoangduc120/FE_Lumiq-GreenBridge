import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CountDown, Leaf } from '../assets';

const CountdownSection = () => {
  const targetDate = new Date('2025-07-01T00:00:00+07:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section
      className="relative w-full px-6 md:px-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E6F2DF 12%, #E6F2DF 40%, #E6F2DF 80%)',
      }}
    >
      <div className="min-h-screen flex flex-col justify-center items-center text-center py-16 z-10 relative">

        {/* Decorative leaves */}
        <img src={Leaf} alt="leaf" className="absolute top-16 left-6 w-28 opacity-70" />
        <img src={Leaf} alt="leaf" className="absolute bottom-16 right-6 w-28 opacity-70" />

        {/* Timer section with precise layout */}
        <div className="grid grid-cols-7 gap-4 md:gap-8 text-green-700 font-extrabold text-4xl md:text-6xl mb-2">
          <span className="text-center w-[80px]">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="text-center text-5xl md:text-6xl">:</span>
          <span className="text-center w-[80px]">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-center text-5xl md:text-6xl">:</span>
          <span className="text-center w-[80px]">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-center text-5xl md:text-6xl">:</span>
          <span className="text-center w-[80px]">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>

        <div className="grid grid-cols-7 gap-4 md:gap-8 text-green-700 text-sm md:text-base font-semibold mb-6">
          <span className="text-center w-[80px]">DAYS</span>
          <span></span>
          <span className="text-center w-[80px]">HOURS</span>
          <span></span>
          <span className="text-center w-[80px]">MINUTES</span>
          <span></span>
          <span className="text-center w-[80px]">SECONDS</span>
        </div>

        {/* Enlarged image */}
        <img
          src={CountDown}
          alt="Bonsai Connect & Market Hub 2025"
          className="w-full max-w-5xl md:max-w-lg rounded-lg shadow-lg mb-6"
        />

        <h2 className="text-3xl md:text-4xl font-dancing text-green-900 mb-4">
          Bonsai Connect & Market Hub 2025
        </h2>

        <Link
          to="/subscribe"
          className="inline-block px-6 py-2 bg-gradient-to-r from-red-500 to-red-300 text-white font-semibold rounded-full shadow-md hover:from-red-600 hover:to-red-400 transition"
        >
          Subscribe now
        </Link>
      </div>
    </section>
  );
};

export default CountdownSection;
