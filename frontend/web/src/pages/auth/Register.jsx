import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    user_name: "",
    email: "",
    password: "",
    display_name: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.");
      navigate("/auth/login");
    } catch (err) {
      console.error("Register failed", err);
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">Đăng ký</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            value={form.email}
            required
          />

          <input
            name="user_name"
            type="text"
            placeholder="Tên người dùng"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            value={form.user_name}
            required
          />

          <input
            name="display_name"
            type="text"
            placeholder="Tên hiển thị"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            value={form.display_name}
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
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            {loading ? "Đang tạo..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Đã có tài khoản?{" "}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
