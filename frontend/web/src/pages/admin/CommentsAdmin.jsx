import { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import Avatar from "@/components/common/Avatar";
import useDocument from "@/hooks/useDocument";
import useUser from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import DocumentItem from "@/components/user/document/DocumentItem";
import { formatDateTime } from "@/utils/date";

export default function CommentsAdmin() {
  const { user } = useAuth();
  const { getAllComments, deleteComment, loadDocumentPreview, loadDocument } =
    useDocument();
  const { loadInfo } = useUser();

  // ===== Data =====
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 100,
    offset: 0,
    total: 0,
  });

  // ===== UI state =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== Preview =====
  const [previewDoc, setPreviewDoc] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // ===== Delete modal =====
  const [actionModal, setActionModal] = useState({
    open: false,
    comment: null,
  });

  // ===== Load comments =====
  useEffect(() => {
    let alive = true;

    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAllComments({
          limit: pagination.limit,
          offset: pagination.offset,
        });

        if (!alive) return;

        const items = Array.isArray(res?.data?.data) ? res.data.data : [];

        const enriched = await Promise.all(
          items.map(async (c) => {
            if (!c.user_id) return c;

            try {
              const info = await loadInfo(c.user_id);
              const u = info?.user || info || {};

              return {
                ...c,
                user: {
                  id: u.id,
                  display_name: u.display_name,
                  full_name: u.full_name,
                  email: u.email,
                  avatar_url: u.avatar_url,
                },
              };
            } catch {
              return c;
            }
          })
        );

        if (!alive) return;

        setComments(enriched);
        setPagination((p) => ({
          ...p,
          ...(res?.data?.pagination ?? {}),
        }));
      } catch (err) {
        console.error(err);
        if (alive) setError("Failed to load comments");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchComments();
    return () => {
      alive = false;
    };
  }, [pagination.limit, pagination.offset]);

  // ===== Handlers =====
  const handlePreview = async (comment) => {
    try {
      setLoadingPreview(true);

      const doc = await loadDocument(comment.document_id);

      if (!doc) {
        alert("No preview available");
        setPreviewDoc(null);
        return;
      }

      setPreviewDoc(doc);
    } catch (err) {
      console.error(err);
      alert("Failed to load preview");
      setPreviewDoc(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  const closeModal = () => {
    setPreviewDoc(null);
  };

  const handleDelete = async () => {
    const comment = actionModal.comment;
    if (!comment) return;

    try {
      await deleteComment(comment.id);

      setComments((prev) => prev.filter((c) => c.id !== comment.id));

      setPagination((p) => ({
        ...p,
        total: Math.max(0, p.total - 1),
      }));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setActionModal({ open: false, comment: null });
    }
  };

  // ===== Table columns =====
  const columns = [
    {
      key: "user",
      title: "User",
      width: "20%",
      render: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <Avatar
            url={row.user?.avatar_url}
            size={32}
            fallback={row.user?.display_name?.[0] || "U"}
          />
          <div className="flex flex-col min-w-0 text-sm">
            <span className="font-medium truncate">
              {row.user?.display_name || "-"}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {row.user?.full_name || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      title: "Comment",
      width: "35%",
      render: (_, row) => <p className="text-sm line-clamp-2">{row.content}</p>,
    },
    {
      key: "document",
      title: "Document",
      width: "20%",
      render: (_, row) => (
        <button
          data-plain
          className="action-table action-table--primary"
          onClick={() => handlePreview(row)}
          disabled={loadingPreview}
        >
          {loadingPreview ? "Loading..." : "View"}
        </button>
      ),
    },
    {
      key: "created_at",
      title: "Created",
      width: "15%",
      render: (_, row) => {
        const dt = formatDateTime(row.created_at);
        return dt ? `${dt.date} ${dt.time}` : "-";
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: "10%",
      render: (_, row) => (
        <button
          data-plain
          className="action-table action-table--danger"
          onClick={() => setActionModal({ open: true, comment: row })}
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
        Manage Comments
      </h1>

      <div className="card p-4">
        {loading && (
          <p className="text-sm text-gray-500">Loading comments...</p>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading &&
          !error &&
          (comments.length ? (
            <Table columns={columns} data={comments} />
          ) : (
            <p className="text-sm text-gray-500">No comments found.</p>
          ))}
      </div>

      {/* ===== DOCUMENT PREVIEW ===== */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-11/12 max-w-4xl rounded-lg bg-white p-4 dark:bg-[var(--color-brand-600)]">
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <DocumentItem
              doc={previewDoc}
              currentUser={{ user }}
              authUser={user}
              showComments={false}
              isPreview={true}
              onToggleComments={() => {}}
              onClose={closeModal}
            />
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {actionModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-3">Delete Comment</h2>
            <p className="text-sm text-gray-600 mb-4">
              Bạn chắc chắn muốn xoá comment này?
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setActionModal({ open: false, comment: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
