import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
import AdminSidebar from "@/components/admin/AdminSidebar";

import { useAuth } from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";

export default function MainLayout() {
  const { user, loading } = useAuth();
  const { info: currentUser, loadInfo } = useUser();

  const fetchedRef = useRef(false);
  const [ready, setReady] = useState(false);

  // Sidebar state (giữ state khi navigate)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("admin_sidebar") === "1";
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((v) => {
      localStorage.setItem("admin_sidebar", v ? "0" : "1");
      return !v;
    });
  };

  useEffect(() => {
    if (loading) return;

    if (!user?.id) {
      setReady(true);
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    loadInfo(user.id).finally(() => {
      setReady(true);
    });
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {user?.role === "admin" && (
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      )}

      <div className="flex-1 flex flex-col">
        <Header currentUser={currentUser} />
        <main className="p-6 flex-1 overflow-auto">
          <Outlet context={{ currentUser, authUser: user }} />
        </main>
      </div>
    </div>
  );
}
