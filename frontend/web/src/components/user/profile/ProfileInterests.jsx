import { useState } from "react";
import Card from "./Card";
import {
  Plus,
  X as XIcon,
  Trash2,
  Pencil,
} from "lucide-react";

export default function ProfileInterests({
  interests,
  isOwner,
  localEditing,
  setLocalEditing,
  onAddInterest,
  onRemoveInterest,
  addingInterest = false,
  removingInterest = false,
}) {
  const [newInterest, setNewInterest] = useState("");
  const [showInput, setShowInput] = useState(false);

  if (!Array.isArray(interests) || interests.length === 0) {
    if (!isOwner) return null;
  }

  /* Actions (Edit / Cancel) */
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

  const handleAddInterest = () => {
    const trimmed = newInterest.trim();
    if (!trimmed || addingInterest) return;
    onAddInterest?.(trimmed);
    setNewInterest("");
    setShowInput(false);
  };

  const handleRemoveInterest = async (interest) => {
    if (removingInterest) return;
    await onRemoveInterest?.(interest);
  };

  return (
    <Card title="Sở thích" actions={actions}>
      {/* Interest tags */}
      <div className="flex flex-wrap gap-2">
        {(interests || []).map((i) => (
          <div
            key={i}
            className="
              flex items-center gap-2
              px-3 py-1.5 rounded-full
              text-xs font-medium
              bg-gray-100 text-gray-700
              dark:bg-gray-800 dark:text-gray-200
              hover:bg-gray-200 dark:hover:bg-gray-700
              transition
            "
          >
            {i}

            {localEditing && (
              <button
                data-plain
                onClick={() => handleRemoveInterest(i)}
                className="
                  w-5 h-5 flex items-center justify-center
                  rounded-full
                  text-red-500 hover:text-red-700
                  hover:bg-red-500/10
                  transition
                "
                title="Xóa sở thích"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add button */}
      {localEditing && !showInput && (
        <button
          data-plain
          onClick={() => setShowInput(true)}
          className="
            mt-4 w-10 h-10
            flex items-center justify-center
            rounded-full
            bg-[var(--color-primary)] text-white
            hover:bg-[var(--color-secondary)]
            shadow
            transition
          "
          title="Thêm sở thích"
        >
          <Plus size={20} />
        </button>
      )}

      {/* Add input */}
      {localEditing && showInput && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="
              flex-1 px-3 py-2
              border border-gray-300 rounded-lg
              focus:outline-none
              focus:ring-2 focus:ring-[var(--color-primary)]
            "
            placeholder="Ví dụ: AI, React, Security..."
            autoFocus
          />

          <button
            data-plain
            onClick={handleAddInterest}
            disabled={addingInterest}
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-full
              bg-[var(--color-primary)] text-white
              hover:bg-[var(--color-secondary)]
              disabled:opacity-50
              transition
            "
            title="Lưu"
          >
            {addingInterest ? "..." : <Plus size={20} />}
          </button>
        </div>
      )}
    </Card>
  );
}
