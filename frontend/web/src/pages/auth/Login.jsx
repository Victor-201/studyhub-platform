import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import InputField from "@/components/common/InputField";
import { useAuth } from "@/hooks/useAuth";
import { validateLogin } from "@/utils/validation";
import { decodeGoogleCredential, isGoogleSDKReady } from "@/utils/google";

export default function Login() {
  const { login, oauthLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  // ==== Bản đồ lỗi backend sang tiếng Việt ====
  const errorMap = {
    "Invalid credentials": "Email/tên đăng nhập hoặc mật khẩu không đúng",
    "Email not found": "Email không tồn tại",
    "Username not found": "Tên đăng nhập không tồn tại",
    "Password incorrect": "Mật khẩu không đúng",
    "Invalid token": "Token không hợp lệ",
  };

  // Check Google SDK
  useEffect(() => {
    const timer = setInterval(() => {
      if (isGoogleSDKReady()) {
        setGoogleReady(true);
        clearInterval(timer);
      }
    }, 300);

    return () => clearInterval(timer);
  }, []);

  // Load remembered identifier
  useEffect(() => {
    const saved = localStorage.getItem("remember_identifier");
    if (saved) {
      setForm((f) => ({ ...f, identifier: saved }));
      setRemember(true);
    }
  }, []);

  const handleChange = (e) => {
    setErrors({});
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = form.identifier.includes("@")
      ? { email: form.identifier, password: form.password }
      : { user_name: form.identifier, password: form.password };

    try {
      await login(payload);

      if (remember)
        localStorage.setItem("remember_identifier", form.identifier);
      else localStorage.removeItem("remember_identifier");

      navigate("/");
    } catch (err) {
      const backendMsg = err?.response?.data?.error || err?.message;
      setErrorMsg(errorMap[backendMsg] || "Đăng nhập thất bại");
    }
  };

  const handleGoogleLogin = () => {
    if (!googleReady) {
      setErrorMsg("Google SDK chưa sẵn sàng, vui lòng thử lại");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const profile = decodeGoogleCredential(response.credential);
          if (!profile) throw new Error("Invalid token");

          await oauthLogin({
            provider_name: "google",
            provider_user: {
              id: profile.sub,
              email: profile.email,
              name: profile.name,
              user_agent: navigator.userAgent,
            },
          });

          navigate("/");
        } catch (err) {
          console.error(err);
          const backendMsg = err?.response?.data?.error || err?.message;
          setErrorMsg(errorMap[backendMsg] || "Đăng nhập Google thất bại");
        }
      },
    });

    window.google.accounts.id.prompt();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
        Đăng nhập
      </h2>

      {errorMsg && (
        <div className="alert-error text-center mb-4">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          icon={Mail}
          name="identifier"
          placeholder="Email hoặc tên đăng nhập"
          value={form.identifier}
          onChange={handleChange}
          error={!!errors.identifier}
          helperText={errors.identifier}
          required
        />

        <div className="relative">
          <InputField
            icon={Lock}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
            data-plain
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Nhớ tài khoản
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
        <span className="text-sm opacity-60 dark:text-gray-400">HOẶC</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={!googleReady}
        className="w-full flex items-center justify-center gap-3 bg-white text-black border border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 disabled:opacity-50 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <FcGoogle size={20} />
        {googleReady ? "Đăng nhập với Google" : "Đang tải Google..."}
      </button>

      <p className="text-sm text-center mt-6 text-gray-700 dark:text-gray-300">
        Chưa có tài khoản?{" "}
        <Link to="/auth/register" className="text-blue-600 hover:underline">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
