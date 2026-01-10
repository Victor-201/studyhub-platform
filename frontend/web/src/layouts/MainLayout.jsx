import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
import { useAuth } from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function MainLayout() {
  const { user, loading } = useAuth();
  const { info: currentUser, loadInfo } = useUser();

  const fetchedRef = useRef(false);
  const [ready, setReady] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") return;

    const saved = localStorage.getItem("admin_sidebar");
    if (saved !== null) {
      setSidebarCollapsed(saved === "1");
    }
  }, [user?.role]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem("admin_sidebar", prev ? "0" : "1");
      return !prev;
    });
  };

  // Load user info
  useEffect(() => {
    if (loading) return;

    if (!user?.id) {
      setReady(true);
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    loadInfo(user.id).finally(() => setReady(true));
  }, [loading, user?.id]);

  if (loading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-gray-500">
          Đang tải dữ liệu người dùng...
        </span>
      </div>
    );
  }

  const sidebarWidth = sidebarCollapsed ? 80 : 256;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {user?.role === "admin" && (
        <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      )}

      {/* Main content */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: user?.role === "admin" ? sidebarWidth : 0 }}
      >
        <Header currentUser={currentUser} sidebarWidth={sidebarWidth} />
        <main className="p-6 flex-1 overflow-auto"
        >
          <Outlet context={{ currentUser, authUser: user }} />
        </main>
      </div>
    </div>
  );
}
