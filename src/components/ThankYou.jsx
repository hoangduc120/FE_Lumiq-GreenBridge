// routes/ThankYou.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const ThankYou = () => {
  const { state } = useLocation();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-green-600">🎉 Thanh toán thành công!</h1>
      <p className="mt-4 text-lg">Mã đơn hàng: <strong>{state?.orderId}</strong></p>
      <p className="mt-2 text-gray-600">Cảm ơn bạn đã mua hàng tại GreenBridge 🌱</p>
    </div>
  );
};

export default ThankYou;
