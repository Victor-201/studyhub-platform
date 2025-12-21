import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50">
      <h1 className="text-8xl font-extrabold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Không tìm thấy trang</h2>

      <p className="text-gray-600 max-w-md mb-6">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xoá.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
