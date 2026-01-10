import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Sun, Moon, LogOut, User, Menu, X } from "lucide-react";
import Logo from "@/assets/images/logo.png";

import { useAuth } from "@/hooks/useAuth";
import useClickOutside from "@/hooks/useClickOutside";
import SearchPopup from "./SearchPopup";
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
  const headerRef = useRef(null);

  // Load theme
  useEffect(() => {
    const saved = localStorage.getItem("studyhub:theme");
    const dark = saved === "dark";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(avatarRef, () => setAvatarMenuOpen(false));
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("studyhub:theme", next ? "dark" : "light");
  };

  const handleLogout = async () => {
    await logout();
    setAvatarMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/auth/login");
  };

  // Set header height for CSS variable
  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty(
        "--header-height",
        `${height}px`
      );
    }
  }, []);

  const user = currentUser?.user;
  const displayName = user?.display_name || "User";
  const fullName = user?.full_name || "";
  const avatarUrl = user?.avatar_url;

  // Helper: navigate + close menus
  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setAvatarMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className="
        sticky top-0 z-50
        bg-[var(--color-surface)]
        text-[var(--color-on-surface)]
        dark:bg-[var(--color-brand-600)]
        dark:text-[var(--color-brand-50)]
        shadow
        transition-all duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-4 w-1/2 md:w-1/3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center">
              <img src={Logo} alt="StudyHub logo" className="object-contain" />
            </div>

            <span className="font-semibold hidden md:block text-[var(--color-primary)] dark:text-[var(--color-brand-50)]">
              StudyHub
            </span>
          </Link>

          <div className="max-w-[250px] w-full">
            <SearchPopup />
          </div>
        </div>

        {/* CENTER */}
        <nav className="hidden md:flex items-center justify-center md:w-1/3 gap-6 text-sm font-medium">
          {[
            { to: "/", label: "Trang chủ" },
            { to: "/group", label: "Nhóm" },
            { to: "/follow", label: "Follow" },
            {to: "/message", label: "Tin nhắn"},
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center justify-end gap-1 ml-auto w-1/2 md:w-1/3">
          {/* THEME */}
          <button data-plain onClick={toggleTheme} className="p-2 rounded-lg">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* NOTIFICATION */}
          {authUser && (
            <div ref={notifRef} className="relative">
              <button
                data-plain
                onClick={() => setNotifOpen((s) => !s)}
                className="p-2"
              >
                <Bell size={18} />
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[var(--color-surface)] text-[var(--color-on-surface)] dark:bg-[var(--color-brand-600)] dark:text-[var(--color-brand-50)] rounded-lg p-3 shadow-xl">
                  <div className="text-sm opacity-70">Chưa có thông báo</div>
                </div>
              )}
            </div>
          )}

          {/* AVATAR DESKTOP */}
          {authUser && (
            <div ref={avatarRef} className="relative hidden md:block cursor-pointer">
              <div onClick={() => setAvatarMenuOpen((s) => !s)}>
                <Avatar
                  url={avatarUrl}
                  size={40}
                  fallback={displayName[0]}
                  show
                />
              </div>

              {avatarMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-[var(--color-surface)] text-[var(--color-on-surface)] dark:bg-[var(--color-brand-600)] dark:text-[var(--color-brand-50)] rounded-xl p-4 shadow-2xl cursor-pointer">
                  <div
                    className="flex gap-3"
                    onClick={() => handleNavigate(`/profile/${user?.id}`)}
                  >
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
                      onClick={() => handleNavigate(`/profile/${user?.id}`)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-brand-50)] dark:hover:bg-[var(--color-brand-700)] cursor-pointer"
                    >
                      <User size={16} /> Xem hồ sơ
                    </button>

                    <button
                      data-plain
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--color-error)] cursor-pointer"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!authUser && (
            <Link to="/auth/login" className="hidden md:inline-flex text-sm">
              Đăng nhập
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            data-plain
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
            className="w-[280px] bg-[var(--color-surface)] text-[var(--color-on-surface)] dark:bg-[var(--color-brand-600)] dark:text-[var(--color-brand-50)] rounded-xl shadow-xl p-4 space-y-4"
          >
            {!authUser && (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-center"
                >
                  Đăng nhập
                </Link>
                <div className="h-px bg-[var(--color-brand-200)] dark:bg-[var(--color-brand-700)]" />
              </>
            )}

            {authUser && (
              <>
                <div
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={() => handleNavigate(`/profile/${user?.id}`)}
                >
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
                <div className="h-px bg-[var(--color-brand-200)] dark:bg-[var(--color-brand-700)]" />
              </>
            )}

            <nav className="flex flex-col text-sm font-medium">
              {[
                { to: "/", label: "Trang chủ" },
                { to: "/group", label: "Nhóm" },
                { to: "/follow", label: "Follow" },
                { to: "/message", label: "Tin nhắn"}
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[var(--color-brand-50)] dark:hover:bg-[var(--color-brand-700)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {authUser && (
              <>
                <div className="h-px bg-[var(--color-brand-200)] dark:bg-[var(--color-brand-700)]" />
                <div className="flex flex-col gap-2">
                  <button
                    data-plain
                    onClick={() => handleNavigate(`/profile/${user?.id}`)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-brand-50)] dark:hover:bg-[var(--color-brand-700)] cursor-pointer"
                  >
                    <User size={16} /> Xem hồ sơ
                  </button>

                  <button
                    data-plain
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--color-error)] cursor-pointer"
                  >
                    <LogOut size={16} /> Đăng xuất
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
