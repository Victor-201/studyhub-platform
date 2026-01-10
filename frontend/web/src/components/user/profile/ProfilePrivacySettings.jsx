import PrivacyToggle from "./PrivacyToggle";

export default function ProfilePrivacySettings({
  privacySettings,
  onPrivacyChange,
}) {
  return (
    <div className="space-y-2">
      <PrivacyToggle
        label="Hiển thị tên đầy đủ"
        checked={privacySettings.show_full_name}
        onChange={(value) => onPrivacyChange("show_full_name", value)}
      />
      <PrivacyToggle
        label="Hiển thị tiểu sử"
        checked={privacySettings.show_bio}
        onChange={(value) => onPrivacyChange("show_bio", value)}
      />
      <PrivacyToggle
        label="Hiển thị giới tính"
        checked={privacySettings.show_gender}
        onChange={(value) => onPrivacyChange("show_gender", value)}
      />
      <PrivacyToggle
        label="Hiển thị ngày sinh"
        checked={privacySettings.show_birthday}
        onChange={(value) => onPrivacyChange("show_birthday", value)}
      />
      <PrivacyToggle
        label="Hiển thị địa chỉ"
        checked={privacySettings.show_location}
        onChange={(value) => onPrivacyChange("show_location", value)}
      />
      <PrivacyToggle
        label="Hiển thị avatar"
        checked={privacySettings.show_avatar}
        onChange={(value) => onPrivacyChange("show_avatar", value)}
      />
      <PrivacyToggle
        label="Hiển thị profile"
        checked={privacySettings.show_profile}
        onChange={(value) => onPrivacyChange("show_profile", value)}
      />

      {/* Allow Messages */}
      <div className="py-2 border-t border-gray-200">
        <label className="text-sm text-gray-600 block mb-2">Cho phép nhắn tin từ</label>
        <select
          value={privacySettings.allow_messages}
          onChange={(e) => onPrivacyChange("allow_messages", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
        >
          <option value="everyone">Mọi người</option>
          <option value="contacts">Chỉ liên hệ</option>
          <option value="no_one">Không ai</option>
        </select>
      </div>

      {/* Allow Tagging */}
      <PrivacyToggle
        label="Cho phép tag trong bài đăng"
        checked={privacySettings.allow_tagging}
        onChange={(value) => onPrivacyChange("allow_tagging", value)}
      />
    </div>
  );
}
