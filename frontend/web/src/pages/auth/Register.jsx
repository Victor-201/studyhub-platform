import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, Lock } from "lucide-react";
import InputField from "@/components/common/InputField";
import { useAuth } from "@/hooks/useAuth";
import { validateRegister } from "@/utils/validation";
import { toast, Toaster } from "react-hot-toast";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    user_name: "",
    display_name: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setErrors({});
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegister(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { email, user_name, display_name, password } = form;
      await register({ email, user_name, display_name, password });

      toast.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
      );

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err) {
      const data = err.response?.data;

      if (data?.errors) {
        const vietnameseErrors = {};
        Object.keys(data.errors).forEach((key) => {
          switch (key) {
            case "user_name":
              vietnameseErrors[key] = "Tên đăng nhập đã tồn tại";
              break;
            case "email":
              vietnameseErrors[key] = "Email đã được sử dụng";
              break;
            case "password":
              vietnameseErrors[key] = "Mật khẩu không hợp lệ";
              break;
            default:
              vietnameseErrors[key] = data.errors[key];
          }
        });
        setErrors(vietnameseErrors);
      } else if (data?.error) {
        if (data.error.includes("Username"))
          setErrorMsg("Tên đăng nhập đã tồn tại");
        else if (data.error.includes("Email"))
          setErrorMsg("Email đã được sử dụng");
        else setErrorMsg(data.error);
      } else if (data?.message) setErrorMsg(data.message);
      else setErrorMsg("Đăng ký thất bại");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
        Tạo tài khoản
      </h2>

      {errorMsg && (
        <div className="alert-error text-center mb-4">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          icon={Mail}
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          required
          data-plain
        />
        <InputField
          icon={User}
          name="user_name"
          placeholder="Tên đăng nhập"
          value={form.user_name}
          onChange={handleChange}
          error={!!errors.user_name}
          helperText={errors.user_name}
          required
          data-plain
        />
        <InputField
          icon={User}
          name="display_name"
          placeholder="Tên hiển thị"
          value={form.display_name}
          onChange={handleChange}
          error={!!errors.display_name}
          helperText={errors.display_name}
          required
          data-plain
        />
        <InputField
          icon={Lock}
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          required
          data-plain
        />
        <InputField
          icon={Lock}
          type="password"
          name="confirm_password"
          placeholder="Xác nhận mật khẩu"
          value={form.confirm_password}
          onChange={handleChange}
          error={!!errors.confirm_password}
          helperText={errors.confirm_password}
          required
          data-plain
        />

        <button type="submit" disabled={loading} className="w-full">
          {loading ? "Đang tạo..." : "Đăng ký"}
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
      </p>
    </div>
  );
}
