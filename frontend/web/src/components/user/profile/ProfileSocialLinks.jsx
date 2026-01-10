import { useState } from "react";
import Card from "./Card";
import {
  Link as LinkIcon,
  Plus,
  X as XIcon,
  Trash2,
  Pencil,
} from "lucide-react";

export default function ProfileSocialLinks({
  socialLinks,
  isOwner,
  localEditing,
  setLocalEditing,
  onAddSocial,
  onRemoveSocial,
  addingSocial = false,
  removingSocial = false,
}) {
  const [url, setUrl] = useState("");
  const [showInput, setShowInput] = useState(false);

  if (!Array.isArray(socialLinks) || socialLinks.length === 0) {
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

  const handleAddUrl = () => {
    const trimmed = url.trim();
    if (!trimmed || addingSocial) return;
    onAddSocial?.(trimmed);
    setUrl("");
    setShowInput(false);
  };

  const handleRemoveUrl = async (id) => {
    if (removingSocial) return;
    await onRemoveSocial?.(id);
  };

  return (
    <Card title="Liên kết" actions={actions}>
      {/* List */}
      <div className="space-y-2">
        {(socialLinks || []).map((l) => (
          <div
            key={l.id}
            className="
              flex items-center justify-between
              px-3 py-2 rounded-lg
              bg-gray-50 dark:bg-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition
            "
          >
            <a
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 truncate"
            >
              <LinkIcon size={16} />
              {(() => {
                try {
                  return new URL(l.url).hostname;
                } catch {
                  return l.url;
                }
              })()}
            </a>

            {localEditing && (
              <button
                data-plain
                onClick={() => handleRemoveUrl(l.id)}
                className="
                  w-8 h-8 flex items-center justify-center
                  rounded-full
                  text-red-500 hover:text-red-700
                  hover:bg-red-500/10
                  transition
                "
                title="Xóa liên kết"
              >
                <Trash2 size={16} />
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
          title="Thêm liên kết"
        >
          <Plus size={20} />
        </button>
      )}

      {/* Add input */}
      {localEditing && showInput && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="
              flex-1 px-3 py-2
              border border-gray-300 rounded-lg
              focus:outline-none
              focus:ring-2 focus:ring-[var(--color-primary)]
            "
            placeholder="url..."
            autoFocus
          />

          <button
            data-plain
            onClick={handleAddUrl}
            disabled={addingSocial}
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
            {addingSocial ? "..." : <Plus size={20} />}
          </button>
        </div>
      )}
    </Card>
  );
}
