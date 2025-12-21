import { Flag, Trash2, Users, Edit2 } from "lucide-react";

export default function GroupMenu({ role, isOwner, handleDeleteGroup, openEditInfo }) {
  return (
    <div className="absolute right-0 top-10 w-56 bg-[var(--color-surface)] dark:bg-[var(--color-brand-600)] border rounded-xl shadow-lg z-20 py-2">
      {role !== "OWNER" && (
        <button
          data-plain
          className="w-full px-4 py-2 text-sm flex items-center gap-2 text-left hover:bg-[var(--color-brand-50)] dark:hover:bg-[var(--color-brand-600)]"
        >
          <Flag size={16} /> Báo cáo nhóm
        </button>
      )}
      {(isOwner || role === "MODERATOR") && (
        <button
          onClick={openEditInfo}
          data-plain
          className="w-full px-4 py-2 text-sm flex items-center gap-2 text-left hover:bg-[var(--color-accent)] dark:hover:bg-[var(--color-accent)]/20"
        >
          <Edit2 size={16} /> Chỉnh sửa nhóm
        </button>
      )}
      {isOwner && (
        <button
          onClick={handleDeleteGroup}
          data-plain
          className="w-full px-4 py-2 text-sm flex items-center gap-2 text-left text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
        >
          <Trash2 size={16} /> Xóa nhóm
        </button>
      )}
    </div>
  );
}
