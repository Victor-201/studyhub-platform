import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useDocument from "@/hooks/useDocument";
import Table from "@/components/common/Table";
import DocumentItem from "@/components/user/document/DocumentItem";
import { formatDateTime } from "@/utils/date";

export default function DocumentsAdmin() {
  const { user } = useAuth();
  const { getApprovedDocuments, deleteDocument: deleteDocGlobal } =
    useDocument();

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== Preview modal =====
  const [previewDoc, setPreviewDoc] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // =========================
  // LOAD DOCUMENTS
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let mounted = true;

    const fetchDocs = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getApprovedDocuments({
          limit: 100,
          offset: 0,
        });

        if (mounted) {
          setDocs(res?.data || []);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load documents");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDocs();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // =========================
  // DELETE DOCUMENT
  // =========================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await deleteDocGlobal(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  };

  // =========================
  // PREVIEW DOCUMENT
  // =========================
  const handlePreview = async (comment) => {
    try {
      setLoadingPreview(true);
      setPreviewDoc(null);

      const doc = await loadDocument(comment.document_id);

      if (!doc) {
        alert("No preview available");
        return;
      }

      setPreviewDoc(doc);
    } catch (err) {
      console.error(err);
      alert("Failed to load preview");
    } finally {
      setLoadingPreview(false);
    }
  };

  const closeModal = () => {
    setPreviewDoc(null);
  };

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns = [
    {
      title: "Title",
      key: "title",
      width: "18%",
      render: (val) => (
        <span className="font-medium text-[var(--color-primary)]">{val}</span>
      ),
    },
    {
      title: "File",
      key: "file_name",
      width: "18%",
    },
    {
      title: "Visibility",
      key: "visibility",
      width: "10%",
      render: (val) => <span className="badge badge--info">{val}</span>,
    },
    {
      title: "Bookmarks",
      key: "stats",
      width: "8%",
      render: (stats) => stats?.bookmarks ?? 0,
    },
    {
      title: "Comments",
      key: "stats",
      width: "8%",
      render: (stats) => stats?.comments ?? 0,
    },
    {
      title: "Downloads",
      key: "stats",
      width: "8%",
      render: (stats) => stats?.downloads ?? 0,
    },
    {
      title: "Tags",
      key: "tag",
      width: "8%",
      render: (tags) => (
        <div className=" text-gray-600 ">
          #{tags?.length ? tags.join(", ") : "-"}
        </div>
      ),
    },
    {
      title: "Created At",
      key: "created_at",
      width: "12%",
      render: (val) => {
        const dt = formatDateTime(val);
        if (!dt) return <div>-</div>;

        return (
          <div>
            {dt.date}
            <br />
            {dt.time}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (_, row) => (
        <div
          className="flex flex-col items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            data-plain
            className="action-table action-table--primary"
            onClick={() => handlePreview(row)}
            disabled={loadingPreview}
          >
            Preview
          </button>

          <button
            data-plain
            className="action-table action-table--danger"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Manage Documents</h1>

      {loading && <p className="text-sm text-gray-500">Loading documents...</p>}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && <Table columns={columns} data={docs} />}

      {/* ===== PREVIEW MODAL ===== */}
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
    </div>
  );
}
