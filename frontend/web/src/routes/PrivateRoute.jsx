import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Đang kiểm tra quyền...</div>;

  if (!user) return <Navigate to="/auth/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/error/forbidden" replace />;
  }

  return children;
}
