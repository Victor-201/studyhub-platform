import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import authService from "@/services/authService";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = params.get("token");
    if (!token) return setStatus("error");

    authService
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="text-center space-y-4">
      {status === "loading" && <p>Đang xác minh email...</p>}

      {status === "success" && (
        <>
          <CheckCircle
            size={48}
            className="mx-auto text-[var(--color-success)]"
          />
          <h2 className="text-xl font-semibold">
            Xác minh thành công
          </h2>
          <Link to="/auth/login">Đăng nhập ngay</Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle
            size={48}
            className="mx-auto text-[var(--color-error)]"
          />
          <h2 className="text-xl font-semibold">
            Xác minh thất bại
          </h2>
          <p className="opacity-70">
            Token không hợp lệ hoặc đã hết hạn
          </p>
        </>
      )}
    </div>
  );
}
