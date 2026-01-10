import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  User,
  MessageSquare,
  Users2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: User },
  { to: "/admin/groups", label: "Groups", icon: Users2 },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/comments", label: "Comments", icon: MessageSquare },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const { pathname } = useLocation();

  // Refs cho từng item
  const itemRefs = useRef([]);
  const [activeTop, setActiveTop] = useState(0);
  const [activeHeight, setActiveHeight] = useState(0);

  // Tính index active, mặc định là Dashboard nếu không tìm thấy
  const activeIndex = nav.findIndex((i) => pathname.startsWith(i.to));
  const finalIndex = activeIndex !== -1 ? activeIndex : 0;

  useEffect(() => {
    const activeEl = itemRefs.current[finalIndex];
    if (activeEl) {
      const parentTop = activeEl.parentElement.getBoundingClientRect().top;
      const rect = activeEl.getBoundingClientRect();
      setActiveTop(rect.top - parentTop);
      setActiveHeight(rect.height);
    }
  }, [pathname, collapsed]);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 255 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-[var(--color-brand-200)] bg-[var(--color-surface)] dark:bg-[var(--color-brand-600)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-[var(--header-height)] px-4 md:px-6 border-b border-[var(--color-brand-200)] dark:border-[var(--color-brand-600)]">
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-lg font-bold tracking-wide text-[var(--color-primary)] dark:text-[var(--color-brand-50)] uppercase"
            >
              Admin Panel
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          data-plain
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="p-2 rounded-full bg-[var(--color-brand-50)] dark:bg-[var(--color-brand-700)] text-[var(--color-primary)] dark:text-[var(--color-brand-50)] hover:bg-[var(--color-accent)] hover:text-[var(--color-on-primary)] transition-all duration-200"
        >
          {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-2 py-4 space-y-3">
        {/* Active background */}
        <AnimatePresence>
          {!collapsed && activeHeight > 0 && (
            <motion.div
              layoutId="active-pill"
              className="absolute left-2 right-2 rounded-xl bg-[var(--color-brand-50)] dark:bg-[var(--color-accent)] shadow-sm"
              style={{
                top: activeTop,
                height: activeHeight,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            />
          )}
        </AnimatePresence>

        {nav.map(({ to, label, icon: Icon }, index) => {
          const isActive = pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`relative z-10 flex items-center transition-all duration-200
                ${collapsed ? "justify-center h-14" : "h-14 px-4 gap-3"}
                ${isActive
                  ? "text-[var(--color-primary)] dark:text-[var(--color-accent)] font-semibold"
                  : "text-[var(--color-on-surface)] dark:text-[var(--color-brand-50)] hover:text-[var(--color-primary)] dark:hover:text-[var(--color-accent)] hover:bg-[var(--color-brand-50)] dark:hover:bg-[var(--color-brand-700)]"
                }
              `}
            >
              {/* Icon */}
              <motion.div
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex items-center justify-center w-12 h-12 rounded-xl
                  ${isActive ? "bg-[var(--color-brand-100)] dark:bg-[var(--color-accent)/30]" : "bg-[var(--color-brand-50)] dark:bg-[var(--color-brand-700)]"}
                  transition-colors duration-200
                `}
              >
                <Icon size={24} />
              </motion.div>

              {/* Label */}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, fontWeight: isActive ? 600 : 500 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-[15px] select-none"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>
    </motion.aside>
  );
}
