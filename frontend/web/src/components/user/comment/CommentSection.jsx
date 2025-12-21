// CommentSection.jsx
import { useEffect, useRef, useState } from "react";
import CreateComment from "./CreateComment";
import CommentItem from "./CommentItem";
import useDocument from "@/hooks/useDocument";

export default function CommentSection({ documentId, currentUser, documentOwnerId }) {
  const { getCommentsByDocument } = useDocument(documentId);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const fetchedRef = useRef(false);

  useEffect(() => {
    fetchedRef.current = false;
    resetComments();
  }, [documentId]);

  const resetComments = () => {
    setComments([]);
    setOffset(0);
    setHasMore(true);
    fetchComments(true);
  };

  const buildTree = (list) => {
    const map = {};
    const roots = [];
    list.forEach((c) => (map[c.id] = { ...c, children: [] }));
    list.forEach((c) => {
      if (c.parent_comment_id && map[c.parent_comment_id]) {
        map[c.parent_comment_id].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  };

  const flattenTree = (c) => [c, ...(c.children?.flatMap(flattenTree) || [])];

  const fetchComments = async (reset = false) => {
    if (loading || (!reset && !hasMore)) return;
    if (reset && fetchedRef.current) return;
    if (reset) fetchedRef.current = true;

    setLoading(true);
    try {
      const currentOffset = reset ? 0 : offset;
      const res = await getCommentsByDocument(documentId, { limit, offset: currentOffset });
      const newComments = res || [];
      const merged = reset ? newComments : [...comments.flatMap(flattenTree), ...newComments];
      setComments(buildTree(merged));
      setOffset(currentOffset + newComments.length);
      setHasMore(newComments.length === limit);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentCreated = (newComment) => {
    if (newComment.parent_comment_id) {
      const addReply = (list) =>
        list.map((c) => {
          if (c.id === newComment.parent_comment_id) {
            return { ...c, children: [newComment, ...(c.children || [])] };
          }
          return { ...c, children: addReply(c.children || []) };
        });
      setComments((prev) => addReply(prev));
    } else {
      setComments((prev) => [newComment, ...prev]);
    }
  };

  return (
    <section className="relative pt-4 space-y-3">
      <h2 className="text-sm font-semibold">Bình luận</h2>
      <div className="max-h-[60vh] overflow-y-auto pr-2 pb-20">
        {loading && <div className="text-sm text-gray-400">Đang tải…</div>}
        {!loading && comments.length === 0 && <div className="text-sm text-gray-500">Chưa có bình luận</div>}

        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            currentUser={currentUser}
            documentOwnerId={documentOwnerId}
            documentId={documentId}
            onCommentCreated={handleCommentCreated}
          />
        ))}

        {hasMore && !loading && (
          <button
            data-plain
            className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-accent)] underline"
            onClick={() => fetchComments(false)}
          >
            Xem thêm bình luận
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white p-3 border-t shadow-inner">
        <CreateComment
          documentId={documentId}
          parentId={null}
          avatarUrl={currentUser?.user?.avatar_url}
          onCreated={handleCommentCreated}
        />
      </div>
    </section>
  );
}
