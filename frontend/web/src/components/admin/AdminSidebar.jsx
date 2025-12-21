import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  UsersRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/comments", label: "Comments", icon: MessageSquare },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/groups", label: "Groups", icon: UsersRound },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`
        h-screen bg-white border-r
        flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide text-green-600">
            ADMIN PANEL
          </span>
        )}

        <button
          data-plain
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `
              group flex items-center h-11 rounded-lg
              transition-all duration-200 my-5
              ${collapsed ? "justify-center px-0" : "px-3 gap-3"}
              ${
                isActive
                  ? "bg-green-100 text-green-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `
            }
          >
            <Icon
              size={24}
              className="shrink-0 group-hover:text-green-600"
            />

            {!collapsed && (
              <span className="text-sm whitespace-nowrap">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
