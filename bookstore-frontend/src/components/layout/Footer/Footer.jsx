// src/components/layout/Footer/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container-custom mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Bookly. All rights reserved.</p>
        <p className="text-sm mt-2">Designed and Developed by Your Name/Team Name</p>
        {/* Thêm các liên kết hoặc thông tin khác tại đây */}
      </div>
    </footer>
  );
};

export default Footer;