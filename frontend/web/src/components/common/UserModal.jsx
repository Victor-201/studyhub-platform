// UserModal.jsx
import { useState, useEffect } from "react";

export default function UserModal({ user, onClose, onSave }) {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // Sync state when user changes
  useEffect(() => {
    if (user) {
      setRole(user.role || "");
      setStatus(user.status || "active");
    }
  }, [user]);

  const handleSave = () => {
    onSave({ ...user, role, status });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] space-y-4">
        <h2 className="text-xl font-semibold">Edit User</h2>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Role</label>
          <input
            className="border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Status</label>
          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="locked">Locked</option>
            <option value="blocked">Blocked</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
