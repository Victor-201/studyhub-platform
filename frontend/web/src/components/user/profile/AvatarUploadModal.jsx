import { useRef, useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import Avatar from "@/components/common/Avatar";

export default function AvatarUploadModal({
  isOpen,
  onClose,
  onUpload,
  uploadingAvatar,
}) {
  const fileRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [avatarFile]);

  const handleChoose = () => fileRef.current?.click();

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setAvatarFile(f);
      setError("");
    }
  };

  const handleSave = async () => {
    if (!avatarFile || uploadingAvatar) return;
    setError("");
    try {
      await onUpload(avatarFile);
      setAvatarFile(null);
      onClose();
      // Show success toast here
      import("react-hot-toast").then(({ default: toast }) => {
        toast.success("Cập nhật avatar thành công");
      });
    } catch (err) {
      console.error(err);
      setError("Cập nhật avatar thất bại. Vui lòng thử lại.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md rounded-xl shadow-lg bg-white overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800">
            Cập nhật ảnh đại diện
          </h3>
          <button
            data-plain
            type="button"
            className="text-gray-500 hover:text-[var(--color-error)] dark:hover:bg-[var(--color-brand-500)] rounded-full p-1 transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center space-y-5">
          <div
            onClick={handleChoose}
            className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-md cursor-pointer bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center transition-transform hover:scale-105"
          >
            {previewUrl ? (
              <Avatar
                url={previewUrl}
                fallback=""
                size="100%"
                className="object-cover"
              />
            ) : (
              <div className="text-5xl font-extrabold text-blue-600 select-none">
                A
              </div>
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
            onChange={handleFile}
          />

          {error && (
            <div className="w-full text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="w-full flex gap-2 mt-2">
            <button
              onClick={handleSave}
              disabled={!avatarFile || uploadingAvatar}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {uploadingAvatar ? "Đang đổi avatar..." : "Lưu ảnh"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
