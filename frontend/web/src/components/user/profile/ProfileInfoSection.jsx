import Card from "./Card";
import { X as XIcon, Pencil } from "lucide-react";
import PrivacyToggle from "./PrivacyToggle";

export default function ProfileInfoSection({
  profile,
  isEditMode,
  editData,
  onEditChange,
  isOwner,
  localEditing,
  setLocalEditing,
  onSaveLocal,
  onCancelLocal,
  privacySettings,
  onPrivacyChange,
  savingInfo = false,
}) {
  const editing = isEditMode || localEditing;

  /* Actions */
  const actions = isOwner ? (
    <button
      data-plain
      onClick={() => setLocalEditing((v) => !v)}
      className={`
        flex items-center justify-center
        w-8 h-8 rounded-full
        transition-colors duration-200
        ${
          localEditing
            ? "text-[var(--color-error)] bg-[var(--color-error)/10]"
            : "text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100 dark:hover:bg-[var(--color-brand-500)/20]"
        }
      `}
      title={localEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
    >
      {localEditing ? <XIcon size={16} /> : <Pencil size={16} />}
    </button>
  ) : null;

  return (
    <Card title="Giới thiệu" actions={actions}>
      {editing ? (
        <div className="space-y-4">
          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tiểu sử
              </label>
              {privacySettings && (
                <PrivacyToggle
                  label=""
                  checked={!!privacySettings.show_bio}
                  onChange={(v) => onPrivacyChange("show_bio", v ? 1 : 0)}
                />
              )}
            </div>

            <textarea
              value={editData.bio}
              onChange={(e) => onEditChange("bio", e.target.value)}
              rows={3}
              className="
                w-full px-3 py-2
                border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
              "
              placeholder="Tiểu sử"
            />
          </div>

          {/* Gender */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Giới tính
              </label>
              {privacySettings && (
                <PrivacyToggle
                  label=""
                  checked={!!privacySettings.show_gender}
                  onChange={(v) =>
                    onPrivacyChange("show_gender", v ? 1 : 0)
                  }
                />
              )}
            </div>

            <select
              value={editData.gender}
              onChange={(e) => onEditChange("gender", e.target.value)}
              className="
                w-full px-3 py-2
                border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
              "
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* Birthday */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ngày sinh
              </label>
              {privacySettings && (
                <PrivacyToggle
                  label=""
                  checked={!!privacySettings.show_birthday}
                  onChange={(v) =>
                    onPrivacyChange("show_birthday", v ? 1 : 0)
                  }
                />
              )}
            </div>

            <input
              type="date"
              value={editData.birthday}
              onChange={(e) => onEditChange("birthday", e.target.value)}
              className="
                w-full px-3 py-2
                border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
              "
            />
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quốc gia
              </label>
              {privacySettings && (
                <PrivacyToggle
                  label=""
                  checked={!!privacySettings.show_location}
                  onChange={(v) =>
                    onPrivacyChange("show_location", v ? 1 : 0)
                  }
                />
              )}
            </div>

            <input
              type="text"
              value={editData.country}
              onChange={(e) => onEditChange("country", e.target.value)}
              className="
                w-full px-3 py-2
                border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
              "
              placeholder="Quốc gia"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Thành phố
            </label>
            <input
              type="text"
              value={editData.city}
              onChange={(e) => onEditChange("city", e.target.value)}
              className="
                w-full px-3 py-2
                border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
              "
              placeholder="Thành phố"
            />
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-2 pt-4 mt-6 border-t">
            <button
              onClick={() => onSaveLocal?.(editData)}
              disabled={savingInfo}
              className="
                px-4 py-2 text-sm font-medium text-white rounded
                bg-green-500 hover:bg-green-600
                disabled:opacity-50 transition
              "
            >
              {savingInfo ? "Đang lưu..." : "Lưu"}
            </button>

            <button
              onClick={() => {
                setLocalEditing(false);
                onCancelLocal?.("info");
              }}
              disabled={savingInfo}
              className="
                px-4 py-2 text-sm font-medium rounded
                bg-gray-300 hover:bg-gray-400
                disabled:opacity-50 transition
              "
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {profile.bio && privacySettings?.show_bio && (
            <div className="flex gap-2">
              <span className="font-medium">Tiểu sử:</span>
              <span>{profile.bio}</span>
            </div>
          )}

          {profile.gender && privacySettings?.show_gender && (
            <div className="flex gap-2">
              <span className="font-medium">Giới tính:</span>
              <span>
                {profile.gender === "male"
                  ? "Nam"
                  : profile.gender === "female"
                  ? "Nữ"
                  : "Khác"}
              </span>
            </div>
          )}

          {profile.birthday && privacySettings?.show_birthday && (
            <div className="flex gap-2">
              <span className="font-medium">Ngày sinh:</span>
              <span>
                {new Date(profile.birthday).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}

          {(profile.city || profile.country) &&
            privacySettings?.show_location && (
              <div className="flex gap-2">
                <span className="font-medium">Địa chỉ:</span>
                <span>
                  {[profile.city, profile.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
        </div>
      )}
    </Card>
  );
}
