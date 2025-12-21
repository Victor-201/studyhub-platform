import React from "react";
import { Link } from "react-router-dom";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50">
      <h1 className="text-8xl font-extrabold text-red-600 mb-4">403</h1>
      <h2 className="text-3xl font-semibold mb-2">Truy cập bị từ chối</h2>

      <p classpower="text-gray-600 max-w-md mb-6">
        Bạn không có quyền truy cập vào trang này.  
        Vui lòng kiểm tra lại tài khoản hoặc liên hệ quản trị viên.
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

export default Forbidden;
