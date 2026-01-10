import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import InputField from "@/components/common/InputField";
import authService from "@/services/authService";
import { validateForgotPassword } from "@/utils/validation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateForgotPassword(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setErrorMsg("");
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Email không tồn tại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-center mb-2">Quên mật khẩu</h2>

      <p className="text-sm opacity-70 text-center mb-6">
        Nhập email để nhận link khôi phục
      </p>

      {errorMsg && <div className="alert-error text-center mb-4">{errorMsg}</div>}

      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={Mail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setErrorMsg("");
            }}
            error={!!error}
            helperText={error}
            required
            data-plain
          />

          <button type="submit" disabled={loading} className="w-full">
            {loading ? "Đang gửi..." : "Gửi email"}
          </button>
        </form>
      ) : (
        <div className="alert-success text-center">Email khôi phục đã được gửi 📩</div>
      )}

      <Link to="/auth/login" className="block mt-6 text-sm text-center">
        ← Quay lại đăng nhập
      </Link>
    </>
  );
}
