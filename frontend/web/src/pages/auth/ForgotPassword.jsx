// src/pages/auth/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "@/services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      console.error("Forgot password error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">Quên mật khẩu</h1>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Nhập email"
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />

            <button
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi email khôi phục"}
            </button>
          </form>
        ) : (
          <p className="text-green-600 text-center">
            Đã gửi email khôi phục! Hãy kiểm tra hộp thư của bạn.
          </p>
        )}

        <Link to="/auth/login" className="block mt-4 text-blue-600 text-sm text-center hover:underline">
          Trở về đăng nhập
        </Link>
      </div>
    </div>
  );
}
