// src/pages/auth/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import authService from "@/services/authService";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-xl text-center">
        {status === "loading" && <p>Đang xác minh email...</p>}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-semibold text-green-600">Xác minh thành công!</h1>
            <Link to="/auth/login" className="text-blue-600 hover:underline block mt-4">
              Đăng nhập ngay
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-semibold text-red-600">Xác minh thất bại!</h1>
            <p>Token hết hạn hoặc không hợp lệ.</p>
          </>
        )}
      </div>
    </div>
  );
}
