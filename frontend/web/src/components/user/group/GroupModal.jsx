import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import useGroup from "@/hooks/useGroup";
import useClickOutside from "@/hooks/useClickOutside";
import Avatar from "@/components/common/Avatar";

export default function GroupModal({
  onClose,
  onSaved,
  groupInfo = null,
  editAvatar = false,
}) {
  const { createGroup, updateGroup, updateAvatar } = useGroup();
  const modalRef = useRef(null);
  const fileRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [access, setAccess] = useState("PUBLIC");
  const [autoApprove, setAutoApprove] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useClickOutside(modalRef, onClose);

  const avatarPreview = avatarFile
    ? URL.createObjectURL(avatarFile)
    : groupInfo?.avatar_url || "";

  useEffect(() => {
    if (groupInfo) {
      setName(groupInfo.name || "");
      setDescription(groupInfo.description || "");
      setAccess(groupInfo.access || "PUBLIC");
      setAutoApprove(Boolean(groupInfo.auto_approve_docs));
      setAvatarFile(null);
    }
  }, [groupInfo]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (loading) return;
    if (!editAvatar && !name.trim()) {
      showToast("error", "Tên nhóm không được để trống");
      return;
    }

    setLoading(true);
    try {
      let result = null;

      if (editAvatar) {
        if (!avatarFile) {
          showToast("error", "Vui lòng chọn ảnh");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        result = await updateAvatar(groupInfo.id, formData);
        showToast("success", "Cập nhật avatar thành công 🎉");
      } else if (groupInfo) {
        const payload = {
          name: name.trim(),
          description: description || "",
          access,
          auto_approve_docs: autoApprove ? 1 : 0,
        };
        result = await updateGroup(groupInfo.id, payload);

        if (avatarFile) {
          const formData = new FormData();
          formData.append("avatar", avatarFile);
          await updateAvatar(groupInfo.id, formData);
        }

        showToast("success", "Cập nhật nhóm thành công 🎉");
      } else {
        if (avatarFile) {
          const formData = new FormData();
          formData.append("avatar", avatarFile);
          formData.append("name", name.trim());
          formData.append("description", description || "");
          formData.append("access", access);
          formData.append("auto_approve_docs", autoApprove ? 1 : 0);
          result = await createGroup(formData); // gửi FormData để backend nhận avatar
        } else {
          result = await createGroup({
            name: name.trim(),
            description: description || "",
            access,
            auto_approve_docs: autoApprove ? 1 : 0,
          });
        }
        showToast("success", "Tạo nhóm thành công 🎉");
      }

      onSaved?.(result);
      setTimeout(() => onClose(), 500);
    } catch (err) {
      console.error(err);
      showToast("error", err?.response?.data?.message || "Lưu nhóm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] px-4 py-3 rounded-md shadow-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Modal */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div
          ref={modalRef}
          className="w-full max-w-md rounded-xl shadow-lg bg-white dark:bg-[var(--color-brand-600)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[var(--color-brand-500)]">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              {editAvatar
                ? "Chỉnh sửa ảnh nhóm"
                : groupInfo
                ? "Chỉnh sửa nhóm"
                : "Tạo nhóm mới"}
            </h3>
            <button
              data-plain
              type="button"
              className="text-gray-500 hover:text-[var(--color-error)] dark:hover:bg-[var(--color-brand-500)] rounded-full p-1 transition-colors"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col items-center space-y-5">
            {/* Avatar */}
            <div
              className="relative w-28 h-28 md:w-32 md:h-32 rounded-full 
             overflow-hidden shadow-md cursor-pointer 
             bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 
             flex items-center justify-center transition-transform hover:scale-105"
              onClick={() => fileRef.current?.click()}
            >
              {avatarPreview ? (
                <Avatar
                  url={avatarPreview}
                  fallback=""
                  size="100%"
                  className="object-cover"
                />
              ) : (
                <span className="text-5xl font-extrabold text-blue-600 dark:text-blue-300 select-none">
                  {groupInfo?.name?.[0] || "U"}
                </span>
              )}

              <div className="absolute inset-0 rounded-full bg-black/25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white font-semibold text-sm tracking-wide">
                  Thêm ảnh
                </span>
              </div>

              <span className="absolute inset-0 rounded-full pointer-events-none animate-ping-slow bg-white/10"></span>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                e.target.files[0] && setAvatarFile(e.target.files[0])
              }
            />

            {!editAvatar && (
              <div className="w-full flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Tên nhóm
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên nhóm"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[var(--color-brand-500)] rounded-md bg-white dark:bg-[var(--color-brand-700)] focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Mô tả
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Nhập mô tả nhóm"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[var(--color-brand-500)] rounded-md bg-white dark:bg-[var(--color-brand-700)] focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    data-plain
                    type="button"
                    onClick={() => setAccess("PUBLIC")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors font-medium ${
                      access === "PUBLIC"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white dark:bg-[var(--color-brand-700)] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[var(--color-brand-500)]"
                    }`}
                  >
                    Công khai
                  </button>
                  <button
                    data-plain
                    type="button"
                    onClick={() => setAccess("RESTRICTED")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors font-medium ${
                      access === "RESTRICTED"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white dark:bg-[var(--color-brand-700)] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[var(--color-brand-500)]"
                    }`}
                  >
                    Riêng tư
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-[var(--color-brand-700)] border border-gray-200 dark:border-[var(--color-brand-500)]">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                    Tự động duyệt tài liệu
                  </div>
                  <input
                    type="checkbox"
                    checked={autoApprove}
                    onChange={(e) => setAutoApprove(e.target.checked)}
                    className="w-5 h-5 accent-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-[var(--color-brand-500)]">
            <button
              onClick={handleSave}
              disabled={loading || (editAvatar && !avatarFile)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
            >
              {loading
                ? "Đang lưu..."
                : editAvatar
                ? "Lưu ảnh"
                : groupInfo
                ? "Lưu thay đổi"
                : "Tạo nhóm"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
