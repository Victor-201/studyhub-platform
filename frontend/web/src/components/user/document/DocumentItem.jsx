import { Bookmark, Download, MessageSquare } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useDocument from "@/hooks/useDocument";
import useUser from "@/hooks/useUser";
import TagList from "@/components/common/TagList";
import CommentSection from "@/components/user/comment/CommentSection";

export default function DocumentItem({
  doc,
  currentUser,
  showComments,
  onToggleComments,
}) {
  const navigate = useNavigate();
  const { toggleBookmark, download } = useDocument(doc.id);
  const { info, loadInfo } = useUser();

  useEffect(() => {
    if (!doc?.owner_id) return;

    if (currentUser?.user?.id !== doc.owner_id) {
      loadInfo(doc.owner_id);
    }
  }, [doc?.owner_id, currentUser?.user?.id]);

  const user =
    currentUser?.user?.id === doc.owner_id
      ? currentUser.user
      : info?.user;

  const previewUrl = doc?.preview_url;

  const stats = doc?.stats || {
    comments: 0,
    bookmarks: 0,
    downloads: 0,
  };

  return (
    <article
      className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition cursor-pointer flex flex-col"
      onClick={() => navigate(`/documents/${doc.id}`)}
    >
      <div className="p-4 flex flex-col gap-3">
        {/* USER */}
        {user && (
          <div className="flex items-center gap-2 text-xs text-gray-800">
            <img
              src={user.avatar_url || "/avatar-default.png"}
              className="w-6 h-6 rounded-full object-cover"
            />
            <strong>{user.display_name || user.username}</strong>
          </div>
        )}

        {/* TITLE */}
        <h3 className="text-sm font-semibold line-clamp-2">
          {doc.title}
        </h3>

        {/* TAGS */}
        <TagList tags={doc.tags || doc.tag} max={3} size="xs" />

        {/* DESCRIPTION */}
        <p className="text-xs text-gray-600 line-clamp-3">
          {doc.description || "Không có mô tả"}
        </p>

        {/* PREVIEW */}
        <div
          className="aspect-[3/2] bg-gray-100 border overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full"
              loading="eager"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              Không có preview
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div
          className="flex items-center justify-between pt-2 text-xs text-gray-500"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={toggleBookmark}
            className="flex items-center gap-1 hover:text-gray-800"
          >
            <Bookmark size={14} />
            <span>{stats.bookmarks}</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={download}
              className="flex items-center gap-1 hover:text-gray-800"
            >
              <Download size={14} />
              <span>{stats.downloads}</span>
            </button>

            <button
              onClick={onToggleComments}
              className="flex items-center gap-1 hover:text-gray-800"
            >
              <MessageSquare size={14} />
              <span>{stats.comments}</span>
            </button>
          </div>
        </div>
      </div>

      {/* COMMENT */}
      {showComments && (
        <div
          className="border-t border-gray-200 mt-2 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <CommentSection
            documentId={doc.id}
            currentUser={currentUser}
            documentOwnerId={doc.owner_id}
          />
        </div>
      )}
    </article>
  );
}

