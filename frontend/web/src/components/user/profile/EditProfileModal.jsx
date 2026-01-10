import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function EditProfileModal({ open, onClose, profile, updateProfile }) {
  const [formData, setFormData] = useState({
    display_name: "",
    full_name: "",
    bio: "",
    gender: "",
    birthday: "",
    city: "",
    country: "",
  });

  // Khi profile load hoặc mở popup, set dữ liệu
  useEffect(() => {
    if (profile && open) {
      setFormData({
        display_name: profile.display_name || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        gender: profile.gender || "",
        birthday: profile.birthday
          ? new Date(profile.birthday).toISOString().split("T")[0]
          : "",
        city: profile.city || "",
        country: profile.country || "",
      });
    }
  }, [profile, open]);

  const handleSave = async () => {
    try {
      const updated = await updateProfile(formData);
      if (updated) {
        toast.success("Cập nhật thông tin thành công");
        onClose();
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative">
        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa thông tin</h3>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block mb-1 font-semibold">Tên hiển thị</label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) =>
                setFormData({ ...formData, display_name: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Họ và tên</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Tiểu sử</label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Giới tính</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Chọn</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Ngày sinh</label>
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) =>
                setFormData({ ...formData, birthday: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Thành phố</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Quốc gia</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded bg-green-500 text-white text-sm"
            >
              Lưu
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded bg-gray-300 text-black text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
