// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { login, loading, user } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const navigate = useNavigate();

  // Cập nhật giá trị input
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();

  const isEmail = form.identifier.includes("@");
  const payload = isEmail
    ? { email: form.identifier, password: form.password }
    : { user_name: form.identifier, password: form.password };

  try {
    const res = await login(payload);  // login trả về user

    const role = res?.user?.role;

    if (role === "admin") navigate("/admin/dashboard");
    else navigate("/");
  } catch (err) {
    console.error("Login failed:", err);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">Đăng nhập</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="identifier"
            type="text"
            placeholder="Email hoặc tên đăng nhập"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            value={form.identifier}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            value={form.password}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/auth/register" className="text-blue-600 hover:underline">
            Tạo tài khoản
          </Link>
          <Link
            to="/auth/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
}
