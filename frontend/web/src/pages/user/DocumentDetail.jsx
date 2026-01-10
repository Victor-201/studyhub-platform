import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import {
  Download,
  Bookmark,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Flag,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import useDocument from "@/hooks/useDocument";
import useUser from "@/hooks/useUser";
import useTimeAgo from "@/hooks/useTimeAgo";
import useClickOutside from "@/hooks/useClickOutside";

import CommentSection from "@/components/user/comment/CommentSection";
import Avatar from "@/components/common/Avatar";
import TagList from "@/components/common/TagList";

export default function DocumentDetail() {
  const { document_id } = useParams();
  const { currentUser } = useOutletContext();
  const navigate = useNavigate();

  const isAuthenticated = !!currentUser?.user?.id;

  /* ===== DOCUMENT ===== */
  const {
    document,
    loadDocument,
    download,
    toggleBookmark,
    loadDocumentPreview,
    checkBookmarked,
    deleteDocument,
  } = useDocument(document_id);

  /* ===== OWNER ===== */
  const { info: ownerInfo, loadInfo: loadOwnerInfo } = useUser();

  /* ===== LOCAL STATE ===== */
  const [localDoc, setLocalDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ===== REF ===== */
  const menuRef = useRef();
  useClickOutside(menuRef, () => setMenuOpen(false));

  /* ===== FETCH CONTROL ===== */
  const fetchedDocRef = useRef(false);
  const fetchedOwnerRef = useRef(false);
  const fetchedPreviewRef = useRef(false);

  /* ===== LOAD DOCUMENT ===== */
  useEffect(() => {
    if (!document_id || fetchedDocRef.current) return;
    fetchedDocRef.current = true;
    loadDocument();
  }, [document_id, loadDocument]);

  /* ===== SYNC DOCUMENT → LOCAL ===== */
  useEffect(() => {
    if (document) setLocalDoc(document);
  }, [document]);

  /* ===== LOAD OWNER ===== */
  useEffect(() => {
    if (!document?.owner_id || fetchedOwnerRef.current) return;
    fetchedOwnerRef.current = true;
    loadOwnerInfo(document.owner_id);
  }, [document?.owner_id, loadOwnerInfo]);

  /* ===== CHECK BOOKMARKED ===== */
  useEffect(() => {
    if (!isAuthenticated || !document?.id) return;

    (async () => {
      const bookmarked = await checkBookmarked();
      setLocalDoc((p) => ({
        ...p,
        isBookmarked: bookmarked,
      }));
    })();
  }, [isAuthenticated, document?.id]);

  /* ===== LOAD PREVIEW ===== */
  useEffect(() => {
    if (!document?.id || fetchedPreviewRef.current) return;
    fetchedPreviewRef.current = true;

    (async () => {
      const url = await loadDocumentPreview(document.id);
      setPreviewUrl(url);
    })();
  }, [document?.id, loadDocumentPreview]);

  /* ===== SAFE DATA ===== */
  const stats = localDoc?.stats ?? { comments: 0, bookmarks: 0, downloads: 0 };
  const isBookmarked = !!localDoc?.isBookmarked;
  const owner = ownerInfo?.user;
  const timeAgo = useTimeAgo(document?.created_at ?? null);
  const isOwner = currentUser?.user?.id === localDoc?.owner_id;

  /* ===== AUTH GUARD ===== */
  const requireAuth = (action) => () => {
    if (!isAuthenticated) {
      navigate("/auth/login", {
        state: { from: `/documents/${document_id}` },
      });
      return;
    }
    action?.();
  };

  /* ===== BOOKMARK (OPTIMISTIC) ===== */
  const handleToggleBookmark = async () => {
    const prev = localDoc.isBookmarked;

    setLocalDoc((p) => ({
      ...p,
      isBookmarked: !prev,
      stats: { ...p.stats, bookmarks: p.stats.bookmarks + (prev ? -1 : 1) },
    }));

    try {
      await toggleBookmark();
    } catch {
      setLocalDoc((p) => ({
        ...p,
        isBookmarked: prev,
        stats: { ...p.stats, bookmarks: p.stats.bookmarks + (prev ? 1 : -1) },
      }));
    }
  };

  /* ===== DOWNLOAD (OPTIMISTIC) ===== */
  const handleDownload = async () => {
    setLocalDoc((p) => ({
      ...p,
      stats: { ...p.stats, downloads: p.stats.downloads + 1 },
    }));

    try {
      await download();
    } catch {
      setLocalDoc((p) => ({
        ...p,
        stats: { ...p.stats, downloads: p.stats.downloads - 1 },
      }));
    }
  };

  /* ===== DELETE DOCUMENT ===== */
  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa tài liệu này?")) return;
    try {
      await deleteDocument();
      navigate("/documents");
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  /* ===== LOADING ===== */
  if (!localDoc)
    return <div className="p-6 text-sm text-gray-500">Đang tải tài liệu…</div>;

  const goToOwnerProfile = () => {
    if (!owner?.id) return;
    navigate(`/profile/${owner.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ================= DESKTOP ================= */}
        <div className="hidden lg:grid grid-cols-[1.2fr_1fr] gap-8">
          {/* PREVIEW */}
          <div className="relative">
            <div className="sticky top-6 h-[82vh] bg-white rounded-md overflow-hidden shadow-sm">
              <div className="absolute top-3 right-3 flex gap-2 z-10 items-center">
                <button
                  onClick={requireAuth(handleToggleBookmark)}
                  className={`flex items-center gap-1 px-2 py-1 bg-white border rounded-md text-xs ${
                    isBookmarked ? "text-blue-600" : ""
                  }`}
                >
                  <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
                  <span>{stats.bookmarks}</span>
                </button>

                <button
                  onClick={requireAuth(handleDownload)}
                  className="flex items-center gap-1 px-2 py-1 bg-white border rounded-md text-xs"
                >
                  <Download size={16} />
                  <span>{stats.downloads}</span>
                </button>

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
                      {isOwner ? (
                        <>
                          <button
                            data-plain
                            onClick={handleDelete}
                            className="flex gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                          <button
                            data-plain
                            className="flex gap-2 px-3 py-2 text-sm hover:bg-gray-50 w-full"
                          >
                            Sửa
                          </button>
                        </>
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

              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  Đang tải preview…
                </div>
              )}
            </div>
          </div>

          {/* CONTENT */}
          <main className="space-y-6 max-w-[520px]">
            {owner && (
              <div
                onClick={goToOwnerProfile}
                className="flex gap-3 items-center text-sm cursor-pointer hover:opacity-80"
              >
                <Avatar
                  url={owner.avatar_url}
                  size={40}
                  fallback={owner.display_name?.[0] || "U"}
                />
                <strong>{owner.display_name}</strong>
              </div>
            )}

            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">{localDoc.title}</h1>
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>

            <TagList tags={localDoc.tags || localDoc.tag} max={10} size="sm" />

            <p className="text-sm text-gray-700">{localDoc.description}</p>

            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare size={16} />
              <span>{stats.comments}</span>
            </div>

            <CommentSection
              documentId={document_id}
              currentUser={currentUser}
              documentOwnerId={localDoc.owner_id}
            />
          </main>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="lg:hidden space-y-5">
          {owner && (
            <div
              onClick={goToOwnerProfile}
              className="flex gap-3 items-center text-sm cursor-pointer hover:opacity-80"
            >
              <Avatar
                url={owner.avatar_url}
                size={40}
                fallback={owner.display_name?.[0] || "U"}
              />
              <strong>{owner.display_name}</strong>
            </div>
          )}

          <div className="flex justify-between items-start">
            <h1 className="text-xl font-semibold">{localDoc.title}</h1>
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
                  {isOwner ? (
                    <>
                      <button
                        data-plain
                        onClick={handleDelete}
                        className="flex gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                      <button
                        data-plain
                        className="flex gap-2 px-3 py-2 text-sm hover:bg-gray-50 w-full"
                      >
                        Sửa
                      </button>
                    </>
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

          <TagList tags={localDoc.tags || localDoc.tag} max={8} size="xs" />

          <p className="text-sm text-gray-700">{localDoc.description}</p>

          <div className="bg-white rounded-md overflow-hidden shadow-sm aspect-[3/2] relative">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full"
                loading="eager"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                Đang tải preview…
              </div>
            )}
          </div>

          {/* ACTIONS (MOBILE) */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <button
              onClick={requireAuth(handleToggleBookmark)}
              className={`flex items-center gap-1 ${isBookmarked ? "text-blue-600" : ""}`}
            >
              <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
              {stats.bookmarks}
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={requireAuth(handleDownload)}
                className="flex items-center gap-1"
              >
                <Download size={14} />
                {stats.downloads}
              </button>

              <button className="flex items-center gap-1" disabled>
                <MessageSquare size={14} />
                {stats.comments}
              </button>
            </div>
          </div>

          <CommentSection
            documentId={document_id}
            currentUser={currentUser}
            documentOwnerId={localDoc.owner_id}
          />
        </div>
      </div>
    </div>
  );
}
