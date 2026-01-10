// CreateComment.jsx
import { useState } from "react";
import Avatar from "@/components/common/Avatar";
import useDocument from "@/hooks/useDocument";

export default function CreateComment({
  documentId,
  parentId = null,
  avatarUrl = null,
  placeholder = "Viết bình luận…",
  onCreated,
}) {
  const { addComment } = useDocument(documentId);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.stopPropagation();
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      const res = await addComment(content, parentId);
      const newComment = res?.data || res;
      setContent("");
      onCreated?.({ ...newComment, children: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex gap-2 items-start">
      <Avatar url={avatarUrl} size={32} fallback="U" />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="flex-1 border rounded-md px-3 py-2 text-sm resize-none"
        rows={1}
      />
      <button
        type="button"
        disabled={loading}
        onClick={(e) => handleSubmit(e)}
        className="px-3 py-2 text-sm rounded-md disabled:opacity-50 bg-[var(--color-secondary)] text-white hover:bg-[var(--color-accent)]"
      >
        Gửi
      </button>
    </div>
  );
}
