import { useState, useEffect, useRef } from "react";
import { Globe, Lock, CheckCircle, ImagePlus } from "lucide-react";
import ModalWrapper from "../../common/ModalWrapper";

export default function EditGroupModal({
  isOpen,
  onClose,
  groupInfo,
  handleUpdateGroupInfo,
  editAvatar = false,
  newAvatarFile,
  setNewAvatarFile,
  handleUpdateAvatar,
}) {
  const [localInfo, setLocalInfo] = useState({
    name: "",
    description: "",
    access: "PUBLIC",
    auto_approve_docs: false,
  });

  const fileRef = useRef(null);

  // Load thông tin nhóm khi mở modal info
  useEffect(() => {
    if (isOpen && groupInfo && !editAvatar) {
      setLocalInfo({
        name: groupInfo.name || "",
        description: groupInfo.description || "",
        access: groupInfo.access || "PUBLIC",
        auto_approve_docs: groupInfo.auto_approve_docs || false,
      });
    }
  }, [isOpen, groupInfo, editAvatar]);

  // Khi mở modal avatar -> tự động mở file picker
  useEffect(() => {
    if (isOpen && editAvatar) {
      setTimeout(() => {
        fileRef.current?.click();
      }, 100);
    }
  }, [isOpen, editAvatar]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatarFile(file);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      title={editAvatar ? "Chỉnh sửa avatar" : "Chỉnh sửa nhóm"}
      onClose={onClose}
    >
      {editAvatar ? (
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-[var(--color-brand-200)] shadow cursor-pointer transition-all duration-300 hover:scale-105 hover:border-[var(--color-accent)]"
              onClick={() => fileRef.current?.click()}
            >
              {newAvatarFile ? (
                <img
                  src={URL.createObjectURL(newAvatarFile)}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--color-brand-50)]">
                  <ImagePlus
                    className="text-[var(--color-brand-200)]"
                    size={40}
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-[rgba(255,255,255,0.2)] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[var(--color-primary)] mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h2l1-2h12l1 2h2v13H3V7z"
                  />
                </svg>
                <span className="text-[var(--color-primary)] text-sm font-semibold">
                  Chọn ảnh mới
                </span>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setNewAvatarFile(file);
              }}
              className="hidden"
            />
          </div>

          {newAvatarFile && (
            <button onClick={handleUpdateAvatar} className="w-32 md:w-40">
              Cập nhật
            </button>
          )}
        </div>
      ) : (
        // ---------------- INFO ----------------
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Tên nhóm
            </label>
            <input
              type="text"
              value={localInfo.name}
              onChange={(e) =>
                setLocalInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nhập tên nhóm"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Mô tả nhóm
            </label>
            <textarea
              value={localInfo.description}
              onChange={(e) =>
                setLocalInfo((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              placeholder="Nhập mô tả"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Quyền truy cập
            </label>
            <div className="flex gap-3">
              <button
                data-plain
                type="button"
                onClick={() =>
                  setLocalInfo((prev) => ({ ...prev, access: "PUBLIC" }))
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  localInfo.access === "PUBLIC"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Globe size={18} /> Công khai
              </button>
              <button
                data-plain
                type="button"
                onClick={() =>
                  setLocalInfo((prev) => ({ ...prev, access: "RESTRICTED" }))
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  localInfo.access === "RESTRICTED"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Lock size={18} /> Riêng tư
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle size={18} /> Tự động duyệt tài liệu
            </div>
            <input
              type="checkbox"
              checked={localInfo.auto_approve_docs}
              onChange={(e) =>
                setLocalInfo((prev) => ({
                  ...prev,
                  auto_approve_docs: e.target.checked,
                }))
              }
              className="w-5 h-5 accent-blue-600"
            />
          </div>

          <button
            onClick={() => handleUpdateGroupInfo(localInfo)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
          >
            Cập nhật thông tin
          </button>
        </div>
      )}
    </ModalWrapper>
  );
}
