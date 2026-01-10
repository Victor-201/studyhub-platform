import { useState } from "react";
import {
  Edit2,
  Check,
  X,
  Camera,
  MoreHorizontal,
  UserMinus,
  UserPlus,
} from "lucide-react";
import Avatar from "@/components/common/Avatar";
import Stat from "./Stat";

export default function ProfileHeader({
  profile,
  isOwner,
  isEditMode,
  editData,
  setShowAvatarModal,
  onEditChange,
  onSave,
  onCancel,
  following,
  authUser,
  onFollowClick,
  onReportClick,
  showMenu,
  setShowMenu,
  onOpenFullEdit,
  onOpenPrivacyModal,
  followCounts,
  followingUser = false,
  savingProfile = false,
  reportingUser = false,
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex gap-6">
      <div className={`cursor-pointer relative ${isOwner ? "group" : ""}`}>
        {(profile.show_avatar ?? 1) === 1 && (
          <div className="relative w-[150px] h-[150px]">
            {/* Avatar */}
            <div
              className="
        w-full h-full rounded-full overflow-hidden
        border-4 border-[var(--color-background)]
        shadow
      "
            >
              <Avatar
                url={profile.avatar_url}
                fallback={profile.display_name?.[0]}
                size={150}
              />
            </div>

            {/* Edit avatar button */}
            {isOwner && (
              <button
                data-plain
                onClick={() => setShowAvatarModal(true)}
                className="
          absolute bottom-2 right-2 z-10
          p-2 rounded-full
          bg-[var(--color-primary)] text-white
          hover:bg-[var(--color-secondary)]
          transition shadow-lg
        "
                title="Chỉnh sửa avatar"
              >
                <Camera size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 my-auto">
        {/* NAME + EDIT / FOLLOW / REPORT */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditMode ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Tên hiển thị</label>
                  <input
                    type="text"
                    value={editData.display_name}
                    onChange={(e) =>
                      onEditChange("display_name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder="Tên hiển thị"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Tên đầy đủ</label>
                  <input
                    type="text"
                    value={editData.full_name}
                    onChange={(e) => onEditChange("full_name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder="Tên đầy đủ"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{profile.display_name}</h1>
                {profile.full_name && (
                  <div className="text-gray-500">{profile.full_name}</div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isOwner && authUser && (
              <button
                data-plain
                onClick={onFollowClick}
                disabled={followingUser}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition
                  ${
                    following
                      ? "bg-gray-200 text-black hover:bg-gray-300"
                      : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
                  } ${followingUser ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {following ? (
                  <>
                    <X size={14} />
                    <span>Đang theo dõi</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Theo dõi</span>
                  </>
                )}
              </button>
            )}

            <div className="relative">
              <button
                data-plain
                onClick={() => setShowMenu((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <MoreHorizontal size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50">
                  {isOwner ? (
                    <>
                      <button
                        data-plain
                        onClick={onOpenFullEdit}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Chỉnh sửa thông tin
                      </button>
                      <button
                        data-plain
                        onClick={onOpenPrivacyModal}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Thay đổi quyền riêng tư
                      </button>
                      <button
                        data-plain
                        onClick={() => setShowMenu(false)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Cài đặt
                      </button>
                    </>
                  ) : (
                    <button
                      data-plain
                      onClick={() => {
                        setShowMenu(false);
                        onReportClick();
                      }}
                      disabled={reportingUser}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 disabled:opacity-50"
                    >
                      {reportingUser ? "Đang báo cáo..." : "Báo cáo người dùng"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="flex gap-6 mt-4">
          <Stat label="Documents" value={profile.documents_count || 0} />
          <Stat label="Followers" value={followCounts.followers} />
          <Stat label="Following" value={followCounts.following} />
        </div>

        {/* EDIT SAVE BUTTON */}
        {isEditMode && isOwner && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={onSave}
              disabled={savingProfile}
              className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
            >
              <Check size={16} />
              Lưu
            </button>
            <button
              onClick={onCancel}
              disabled={savingProfile}
              className="flex items-center gap-1 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
            >
              <X size={16} />
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
