// CommentItem.jsx
import { useEffect, useRef, useState, memo } from "react";
import { MoreHorizontal, Trash2, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Avatar from "@/components/common/Avatar";
import CreateComment from "./CreateComment";
import useTimeAgo from "@/hooks/useTimeAgo";
import useUser from "@/hooks/useUser";
import useDocument from "@/hooks/useDocument";
import useClickOutside from "@/hooks/useClickOutside";

function CommentItem({
  comment,
  currentUser,
  documentOwnerId,
  documentId,
  onCommentCreated,
  level = 0,
}) {
  const navigate = useNavigate();

  const currentUserId = currentUser?.user?.id;
  const isMine = comment.user_id === currentUserId;
  const canDelete = isMine || comment.user_id === documentOwnerId;

  const { loadInfo } = useUser();
  const { deleteComment } = useDocument(documentId);
  const timeAgo = useTimeAgo(comment.created_at);

  const [user, setUser] = useState(isMine ? currentUser.user : null);

  useEffect(() => {
    if (isMine || user) return;
    loadInfo(comment.user_id).then((res) => res?.user && setUser(res.user));
  }, [comment.user_id, isMine, loadInfo, user]);

  // 👉 đi tới profile
  const canGoProfile = user?.id && user.id !== currentUserId;
  const goProfile = () => {
    if (!canGoProfile) return;
    navigate(`/profile/${user.id}`);
  };

  // content expand
  const contentRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setCanExpand(el.scrollHeight > el.clientHeight + 1);
  }, [comment.content]);

  // menu
  const [replyOpen, setReplyOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false));

  const handleDelete = async () => {
    if (!canDelete) return;
    await deleteComment(comment.id);
  };

  return (
    <div style={{ marginLeft: level * 20 }} className="relative">
      <div className="flex gap-3 py-2">
        {/* AVATAR */}
        <Avatar
          url={user?.avatar_url}
          size={28}
          fallback={user?.display_name?.[0] || "U"}
          onClick={goProfile}
          className={canGoProfile ? "cursor-pointer hover:opacity-80" : ""}
        />

        <div className="flex-1">
          <div className="flex justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* NAME */}
              <div
                onClick={goProfile}
                className={`text-sm font-semibold ${
                  canGoProfile ? "cursor-pointer hover:underline" : ""
                }`}
              >
                {user?.display_name || "Người dùng"}
              </div>

              {/* CONTENT */}
              <div className="text-sm text-gray-700 mt-1">
                <div
                  ref={contentRef}
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: expanded ? "unset" : 2,
                    overflow: "hidden",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {comment.content}
                </div>

                {canExpand && (
                  <button
                    data-plain
                    onClick={() => setExpanded((v) => !v)}
                    className="text-xs text-[var(--color-secondary)] hover:underline"
                  >
                    {expanded ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>
            </div>

            {/* MENU */}
            <div ref={menuRef} className="relative">
              <button
                data-plain
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 border"
              >
                <MoreHorizontal size={16} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white border rounded-md shadow z-10">
                  {canDelete ? (
                    <button
                      data-plain
                      onClick={handleDelete}
                      className="flex gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                    >
                      <Trash2 size={14} /> Xóa
                    </button>
                  ) : (
                    <button
                      data-plain
                      className="flex gap-2 px-3 py-2 text-sm hover:bg-gray-50 w-full"
                    >
                      <Flag size={14} /> Báo cáo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ACTION */}
          <div className="mt-1 flex justify-between items-center">
            <button
              data-plain
              onClick={() => setReplyOpen((v) => !v)}
              className="text-xs text-[var(--color-secondary)] hover:underline"
            >
              Trả lời
            </button>
            <div className="text-xs text-gray-400">{timeAgo}</div>
          </div>

          {/* REPLY */}
          {replyOpen && (
            <div className="mt-2">
              <CreateComment
                documentId={documentId}
                parentId={comment.id}
                avatarUrl={currentUser?.user?.avatar_url}
                onCreated={(reply) => {
                  onCommentCreated(reply);
                  setReplyOpen(false);
                }}
              />
            </div>
          )}

          {/* CHILD COMMENTS */}
          {comment.children?.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              currentUser={currentUser}
              documentOwnerId={documentOwnerId}
              documentId={documentId}
              onCommentCreated={onCommentCreated}
              level={level + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(CommentItem);
