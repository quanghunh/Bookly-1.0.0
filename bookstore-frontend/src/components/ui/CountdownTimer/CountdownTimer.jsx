import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center md:justify-start items-center space-x-4 mb-6">
      <div className="text-center">
        <div className="text-4xl font-bold">{countdown.days}</div>
        <div className="text-sm">Days</div>
      </div>
      <div className="text-pink-500 text-2xl">:</div>
      <div className="text-center">
        <div className="text-4xl font-bold">{countdown.hours}</div>
        <div className="text-sm">Hrs</div>
      </div>
      <div className="text-pink-500 text-2xl">:</div>
      <div className="text-center">
        <div className="text-4xl font-bold">{countdown.minutes}</div>
        <div className="text-sm">Min</div>
      </div>
      <div className="text-pink-500 text-2xl">:</div>
      <div className="text-center">
        <div className="text-4xl font-bold">{countdown.seconds}</div>
        <div className="text-sm">Sec</div>
      </div>
    </div>
  );
};

export default CountdownTimer;