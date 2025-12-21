import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Sun, Moon, LogOut, User, Menu, X } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import useClickOutside from "@/hooks/useClickOutside";
import Avatar from "@/components/common/Avatar";

export default function Header({ currentUser }) {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const notifRef = useRef(null);
  const avatarRef = useRef(null);
  const mobileMenuRef = useRef(null);

  /* ================= THEME ================= */
  useEffect(() => {
    const saved = localStorage.getItem("studyhub:theme");
    const dark = saved === "dark";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(avatarRef, () => setAvatarMenuOpen(false));
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

  /* ================= DATA ================= */
  const user = currentUser?.user;
  const displayName = user?.display_name || "User";
  const fullName = user?.full_name || "";
  const avatarUrl = user?.avatar_url;

  /* ================= HANDLERS ================= */
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("studyhub:theme", next ? "dark" : "light");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
            SH
          </div>
          <div className="font-semibold text-blue-700 dark:text-white">
            StudyHub
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/">Trang chủ</Link>
          <Link to="/group">Nhóm</Link>
          <Link to="/follow">Follow</Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* THEME */}
          <button onClick={toggleTheme} className="p-2 rounded-lg">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* NOTIFICATION */}
          {authUser && (
            <div ref={notifRef} className="relative">
              <button onClick={() => setNotifOpen((s) => !s)} className="p-2">
                <Bell size={18} />
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-xl">
                  <div className="text-sm opacity-70">Chưa có thông báo</div>
                </div>
              )}
            </div>
          )}

          {/* AVATAR DESKTOP */}
          {authUser && (
            <div ref={avatarRef} className="relative hidden md:block">
              <div onClick={() => setAvatarMenuOpen((s) => !s)}>
                <Avatar
                  url={avatarUrl}
                  size={40}
                  fallback={displayName[0]}
                  show
                />
              </div>

              {avatarMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-2xl">
                  <div className="flex gap-3">
                    <Avatar
                      url={avatarUrl}
                      size={48}
                      fallback={displayName[0]}
                      show
                    />
                    <div>
                      <div className="font-semibold text-sm">{displayName}</div>
                      <div className="text-xs opacity-70">{fullName}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      data-plain
                      onClick={() => navigate(`/profile/${user?.id}`)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User size={16} /> Xem hồ sơ
                    </button>

                    <button
                      data-plain
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOGIN (DESKTOP ONLY WHEN NOT AUTH) */}
          {!authUser && (
            <Link
              to="/auth/login"
              className="hidden md:inline-flex text-sm font-medium"
            >
              Đăng nhập
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileMenuOpen((s) => !s)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[64px] right-4 z-50">
          <div
            ref={mobileMenuRef}
            className="w-[280px] bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4 space-y-4"
          >
            {/* LOGIN (TOP, MOBILE ONLY, NOT AUTH) */}
            {!authUser && (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-center rounded-lg"
                >
                  Đăng nhập
                </Link>
                <div className="h-px bg-gray-200 dark:bg-gray-700" />
              </>
            )}

            {/* AVATAR INFO */}
            {authUser && (
              <>
                <div className="flex gap-3 items-center">
                  <Avatar
                    url={avatarUrl}
                    size={48}
                    fallback={displayName[0]}
                    show
                  />
                  <div>
                    <div className="font-semibold text-sm">{displayName}</div>
                    <div className="text-xs opacity-70">{fullName}</div>
                  </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-700" />
              </>
            )}

            {/* MENU */}
            <nav className="flex flex-col gap-3 text-sm font-medium">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Trang chủ
              </Link>
              <Link to="/group" onClick={() => setMobileMenuOpen(false)}>
                Nhóm
              </Link>
              <Link to="/follow" onClick={() => setMobileMenuOpen(false)}>
                Follow
              </Link>
            </nav>

            {/* ACTIONS */}
            {authUser && (
              <>
                <div className="h-px bg-gray-200 dark:bg-gray-700" />

                <div className="flex flex-col gap-2">
                  <button
                    data-plain
                    onClick={() => {
                      navigate(`/profile/${user?.id}`);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left"
                  >
                    Xem hồ sơ
                  </button>

                  <button
                    data-plain
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
