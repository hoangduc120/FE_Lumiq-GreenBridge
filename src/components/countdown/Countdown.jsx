import React, { useState, useEffect } from "react";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 12,
    minutes: 25,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 23;
              if (days > 0) {
                days -= 1;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center gap-6 md:gap-12 text-center">
      <div>
        <div className="text-5xl md:text-6xl font-bold text-green-500">{timeLeft.days}</div>
        <div className="text-xs uppercase text-green-500 mt-1">Days</div>
      </div>

      <div className="text-4xl font-bold text-green-500">:</div>

      <div>
        <div className="text-5xl md:text-6xl font-bold text-green-500">{timeLeft.hours}</div>
        <div className="text-xs uppercase text-green-500 mt-1">Hours</div>
      </div>

      <div className="text-4xl font-bold text-green-500">:</div>

      <div>
        <div className="text-5xl md:text-6xl font-bold text-green-500">{timeLeft.minutes}</div>
        <div className="text-xs uppercase text-green-500 mt-1">Minutes</div>
      </div>

      <div className="text-4xl font-bold text-green-500">:</div>

      <div>
        <div className="text-5xl md:text-6xl font-bold text-green-500 relative">
          {timeLeft.seconds}
        </div>
        <div className="text-xs uppercase text-green-500 mt-1">Seconds</div>
      </div>
    </div>
  );
}
