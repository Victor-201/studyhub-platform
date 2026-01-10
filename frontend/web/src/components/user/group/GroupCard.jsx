import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Shield,
  Crown,
  Users,
  Trash2,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useGroup from "@/hooks/useGroup";
import useClickOutside from "@/hooks/useClickOutside";
import Avatar from "@/components/common/Avatar";

export default function GroupCard({
  group,
  variant = "grid",
  authUser,
  onJoin,
  onLeave,
}) {
  const navigate = useNavigate();
  const { deleteGroup, checkJoinPending, cancelJoin } = useGroup();

  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setOpenMenu(false));

  const joined = !!group.role;
  const isOwner = group.role === "OWNER";
  const isModerator = group.role === "MODERATOR";
  const isRestricted = group.access === "RESTRICTED";

  // Kiểm tra yêu cầu join
  useEffect(() => {
    if (!joined && isRestricted) {
      let mounted = true;
      checkJoinPending(group.id).then((pending) => {
        if (mounted) setIsPending(pending);
      });
      return () => (mounted = false);
    }
  }, [group.id, joined, isRestricted, checkJoinPending]);

  const goDetail = () => navigate(`/group/${group.id}`);
  const goMembers = () => navigate(`/group/${group.id}?tab=members`);

  const handleJoin = async (isRestricted) => {
    if (!onJoin) return;
    setLoading(true);
    try {
      await onJoin(group.id, isRestricted);
      setIsPending(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await cancelJoin(group.id);
      setIsPending(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    setOpenMenu(false);
    if (isOwner) {
      alert("Bạn cần chuyển quyền chủ nhóm trước khi rời nhóm.");
      return;
    }
    if (!confirm("Xác nhận rời khỏi nhóm?")) return;

    setLoading(true);
    if (!onLeave) return;
    setLoading(true);
    try {
      await onLeave(group.id);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setOpenMenu(false);
    if (!confirm("Xóa vĩnh viễn nhóm này?")) return;
    await deleteGroup(group.id);
  };

  /* ---------------- Render action button ---------------- */
  const renderActionButton = () => {
    if (joined) {
      if (isOwner) {
        return (
          <span className="px-3 py-2 text-xs rounded-lg bg-yellow-50 text-yellow-700 border">
            Chủ nhóm
          </span>
        );
      }
      return (
        <button
          disabled={loading}
          onClick={handleLeave}
          className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
        >
          Rời nhóm
        </button>
      );
    } else {
      if (isRestricted) {
        return isPending ? (
          <button
            disabled={loading}
            onClick={handleCancelRequest}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
          >
            Hủy yêu cầu
          </button>
        ) : (
          <button
            disabled={loading}
            onClick={() => handleJoin(true)}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            Tham gia
          </button>
        );
      } else {
        return (
          <button
            disabled={loading}
            onClick={() => handleJoin(false)}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            Tham gia
          </button>
        );
      }
    }
  };

  /* ================= LIST VIEW ================= */
  if (variant === "list") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition h-[60px] cursor-pointer">
        <div
          onClick={goDetail}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <Avatar url={group.avatar_url} fallback={group.name?.[0]} size={40} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate hover:underline">
                {group.name}
              </h3>
              {isRestricted && <Shield size={12} className="text-gray-500" />}
              {isOwner && <Crown size={12} className="text-yellow-500" />}
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
              <Users size={12} />
              <span>{group.count_member} thành viên</span>
            </div>
          </div>
        </div>

        {authUser && (
          <div ref={menuRef} className="relative">
            <button
              data-plain
              onClick={() => setOpenMenu((p) => !p)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <MoreHorizontal size={18} />
            </button>

            {openMenu && (
              <div className="absolute right-0 top-9 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30">
                <MenuItem label="Xem chi tiết" onClick={goDetail} />

                {!joined && (
                  <MenuItem
                    label={
                      isRestricted
                        ? isPending
                          ? "Hủy yêu cầu"
                          : "Tham gia"
                        : "Tham gia"
                    }
                    icon={!joined && !isPending ? <UserPlus size={14} /> : null}
                    onClick={
                      isRestricted
                        ? isPending
                          ? handleCancelRequest
                          : handleJoin(true)
                        : handleJoin(false)
                    }
                  />
                )}

                {joined && !isOwner && (
                  <MenuItem
                    label="Rời nhóm"
                    icon={<LogOut size={14} />}
                    onClick={handleLeave}
                  />
                )}

                {(isOwner || isModerator) && (
                  <MenuItem label="Quản lý thành viên" onClick={goMembers} />
                )}

                {isOwner && (
                  <MenuItem
                    label="Xóa nhóm"
                    danger
                    icon={<Trash2 size={14} />}
                    onClick={handleDelete}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /* ================= GRID VIEW ================= */
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition min-h-[160px]  min-w-[180px]">
      <div onClick={goDetail} className="flex items-start gap-3 cursor-pointer">
        <Avatar url={group.avatar_url} fallback={group.name?.[0]} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[16px] truncate hover:underline">
              {group.name}
            </h3>
            {isRestricted && <Shield size={14} className="text-gray-500" />}
            {isOwner && <Crown size={14} className="text-yellow-500" />}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <Users size={13} />
            <span>{group.count_member} thành viên</span>
          </div>
        </div>
      </div>

      {group.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {group.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div>{renderActionButton()}</div>

        <div ref={menuRef} className="relative">
          <button
            data-plain
            onClick={() => setOpenMenu((p) => !p)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <MoreHorizontal size={18} />
          </button>

          {openMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white border rounded-xl shadow-lg z-30">
              <MenuItem label="Xem chi tiết" onClick={goDetail} />

              {(isOwner || isModerator) && (
                <MenuItem label="Quản lý thành viên" onClick={goMembers} />
              )}

              {isOwner && (
                <MenuItem
                  label="Xóa nhóm"
                  danger
                  icon={<Trash2 size={14} />}
                  onClick={handleDelete}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Menu item ---------- */
function MenuItem({ label, onClick, icon, danger, disabled }) {
  return (
    <button
      data-plain
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2 text-sm flex items-center gap-2 text-left ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
}
