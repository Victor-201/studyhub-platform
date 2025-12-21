import {
  X,
  ImagePlus,
  Globe,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import useGroup from "@/hooks/useGroup";
import useClickOutside from "@/hooks/useClickOutside";

export default function CreateGroup({ onClose, onCreated }) {
  const { createGroup } = useGroup();

  const modalRef = useRef(null);
  const fileRef = useRef(null);

  useClickOutside(modalRef, onClose);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [access, setAccess] = useState("PUBLIC");
  const [autoApprove, setAutoApprove] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState(null); // 🔥 toast nổi

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async () => {
    if (!name.trim() || loading) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("access", access);
    formData.append("auto_approve_docs", autoApprove ? 1 : 0);
    if (avatar) formData.append("avatar", avatar);

    setLoading(true);

    try {
      const group = await createGroup(formData);

      showToast("success", "Tạo nhóm thành công 🎉");
      onCreated?.(group);

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error("Create group error:", err);
      showToast("error", "Tạo nhóm thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔔 TOAST NỔI */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999]
            px-4 py-3 rounded-lg shadow-lg text-sm
            ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* MODAL */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div
          ref={modalRef}
          className="w-[460px] rounded-xl shadow-lg bg-[var(--color-surface)]
                     dark:bg-[var(--color-brand-600)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-base">Tạo nhóm mới</h3>
            <button data-plain onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--color-brand-50)]
                              overflow-hidden flex items-center justify-center">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlus className="text-[var(--color-brand-300)]" />
                )}
              </div>

              <button
                type="button"
                data-plain
                onClick={() => fileRef.current.click()}
                className="text-sm text-[var(--color-secondary)]"
              >
                Chọn ảnh đại diện
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium">Tên nhóm</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full mt-1 resize-none"
              />
            </div>

            {/* Access */}
            <div className="space-y-2">
              <button
                data-plain
                onClick={() => setAccess("PUBLIC")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border
                  ${
                    access === "PUBLIC"
                      ? "border-[var(--color-primary)] bg-[var(--color-brand-50)]"
                      : "border-[var(--color-brand-200)]"
                  }`}
              >
                <Globe size={18} />
                Công khai
              </button>

              <button
                data-plain
                onClick={() => setAccess("RESTRICTED")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border
                  ${
                    access === "RESTRICTED"
                      ? "border-[var(--color-primary)] bg-[var(--color-brand-50)]"
                      : "border-[var(--color-brand-200)]"
                  }`}
              >
                <Lock size={18} />
                Riêng tư
              </button>
            </div>

            {/* Auto approve */}
            <div className="flex items-center justify-between p-3 rounded-lg
                            bg-[var(--color-brand-50)]">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} />
                Tự động duyệt tài liệu
              </div>
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Đang tạo..." : "Tạo nhóm"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
