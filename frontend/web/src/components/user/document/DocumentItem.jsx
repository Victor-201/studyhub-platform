import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  Download,
  MessageSquare,
  Eye,
  MoreHorizontal,
  Trash2,
  Flag,
  X,
} from "lucide-react";

import useDocument from "@/hooks/useDocument";
import useUser from "@/hooks/useUser";
import useClickOutside from "@/hooks/useClickOutside";
import TagList from "@/components/common/TagList";
import CommentSection from "@/components/user/comment/CommentSection";

// import file icons
import docIcon from "@/assets/icons/doc.png";
import pdfIcon from "@/assets/icons/pdf.png";
import pptIcon from "@/assets/icons/ppt.png";
import xlsIcon from "@/assets/icons/xls.png";
import jsonIcon from "@/assets/icons/json.png";
import imgIcon from "@/assets/icons/img.png";
import videoIcon from "@/assets/icons/video.png";
import zipIcon from "@/assets/icons/zip.png";

// map extension → icon
const fileIcons = {
  doc: docIcon,
  docx: docIcon,
  pdf: pdfIcon,
  ppt: pptIcon,
  pptx: pptIcon,
  xls: xlsIcon,
  xlsx: xlsIcon,
  json: jsonIcon,
  png: imgIcon,
  jpg: imgIcon,
  jpeg: imgIcon,
  gif: imgIcon,
  mp4: videoIcon,
  mov: videoIcon,
  zip: zipIcon,
};

export default function DocumentItem({
  doc,
  currentUser,
  authUser,
  isPreview = false,
  showComments,
  onToggleComments,
  onClose,
}) {
  const navigate = useNavigate();
  const {
    toggleBookmark,
    download,
    loadDocumentPreview,
    checkBookmarked,
    deleteDocument,
  } = useDocument(doc.id);
  const { info, loadInfo } = useUser();

  const [localDoc, setLocalDoc] = useState(doc);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef();
  useClickOutside(menuRef, () => setMenuOpen(false));

  const isAuthenticated = !!authUser?.id;

  // Sync props → local state
  useEffect(() => setLocalDoc(doc), [doc]);

  // Check bookmarked
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      const bookmarked = await checkBookmarked();
      setLocalDoc((p) => ({ ...p, isBookmarked: bookmarked }));
    })();
  }, [isAuthenticated]);

  // Load owner info if not current user
  useEffect(() => {
    if (!localDoc?.owner_id) return;
    if (currentUser?.user?.id !== localDoc.owner_id) {
      loadInfo(localDoc.owner_id);
    }
  }, [localDoc?.owner_id]);

  // Load preview automatically if isPreview
  useEffect(() => {
    if (isPreview) handleLoadPreview();
  }, [isPreview]);

  const user =
    currentUser?.user?.id === localDoc.owner_id ? currentUser.user : info?.user;
  const isOwner = currentUser?.user?.id === localDoc.owner_id;
  const isBookmarked = !!localDoc.isBookmarked;
  const stats = localDoc.stats || { comments: 0, bookmarks: 0, downloads: 0 };

  // Auth guard
  const requireAuth = (action) => (e) => {
    e.stopPropagation();
    if (!isAuthenticated)
      return navigate("/auth/login", {
        state: { from: `/documents/${localDoc.id}` },
      });
    action?.();
  };

  // Load preview
  const handleLoadPreview = async (e) => {
    e?.stopPropagation();
    if (!isAuthenticated)
      return navigate("/auth/login", {
        state: { from: `/documents/${localDoc.id}` },
      });
    if (previewUrl || loadingPreview) return;
    setLoadingPreview(true);
    try {
      const url = await loadDocumentPreview();
      setPreviewUrl(url);
    } finally {
      setLoadingPreview(false);
    }
  };

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
        stats: { ...p.stats, bookmarks: p.stats.bookmarks },
      }));
    }
  };

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

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa tài liệu này?")) return;
    try {
      await deleteDocument();
      navigate("/documents");
    } catch {
      alert("Xóa thất bại!");
    }
  };

  // File icon
  const ext = doc.file_name?.split(".").pop()?.toLowerCase();
  const iconSrc = fileIcons[ext] || docIcon;

  return (
    <div
      className={
        isPreview
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          : "w-full flex justify-center py-2"
      }
      onClick={onClose}
    >
      <article
        className={`
        bg-white dark:bg-[var(--color-brand-600)] 
        rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 
        cursor-pointer flex flex-col w-full
        ${isPreview ? "relative max-w-3xl" : "p-4 max-w-4xl"}
      `}
        onClick={() => !isPreview && navigate(`/documents/${localDoc.id}`)}
      >
        <div className="p-4 flex flex-col gap-3 relative">
          {/* HEADER */}
          {user && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url || "/avatar-default.png"}
                  className="w-6 h-6 rounded-full"
                />
                <strong>{user.display_name || user.username}</strong>
              </div>

              {/* MENU hoặc CLOSE */}
              {isPreview ? (
                <button
                  data-plain
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose?.();
                  }}
                  className="text-gray-500 hover:text-[var(--color-error)] dark:hover:bg-[var(--color-brand-500)] rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              ) : (
                <div ref={menuRef} className="relative">
                  <button
                    data-plain
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen((v) => !v);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 border"
                  >
                    <MoreHorizontal size={20} />
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
              )}
            </div>
          )}

          <h3 className="text-sm font-semibold line-clamp-2">
            {localDoc.title}
          </h3>
          <TagList tags={localDoc.tags || localDoc.tag} max={3} size="xs" />
          <p className="text-xs text-gray-600 line-clamp-3">
            {localDoc.description || "Không có mô tả"}
          </p>

          {/* PREVIEW */}
          <div
            className={`w-full bg-gray-100 flex items-center justify-center p-4 rounded-xl ${
              previewUrl ? "aspect-[3/2]" : "aspect-[4/1]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full rounded-xl border border-gray-300"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
                <div className="flex items-center justify-center rounded-xl w-full gap-2">
                  <img src={iconSrc} alt="file icon" className="w-6 h-6" />
                  <span className="text-sm text-gray-500 truncate">
                    {doc.file_name}
                  </span>
                </div>
                {!isPreview && (
                  <button
                    onClick={handleLoadPreview}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                  >
                    <Eye size={14} />{" "}
                    {loadingPreview ? "Đang tải..." : "Xem preview"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          {!isPreview && (
            <div
              className="flex items-center justify-between text-xs text-gray-500 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={requireAuth(handleToggleBookmark)}
                className={`flex items-center gap-1 ${
                  isBookmarked ? "text-blue-600" : ""
                }`}
              >
                <Bookmark
                  size={14}
                  fill={isBookmarked ? "currentColor" : "none"}
                />{" "}
                {stats.bookmarks}
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={requireAuth(handleDownload)}
                  className="flex items-center gap-1"
                >
                  <Download size={14} /> {stats.downloads}
                </button>
                <button
                  onClick={requireAuth(onToggleComments)}
                  className="flex items-center gap-1"
                >
                  <MessageSquare size={14} /> {stats.comments}
                </button>
              </div>
            </div>
          )}
        </div>

        {showComments && isAuthenticated && !isPreview && (
          <div
            className="border-t mt-2 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <CommentSection
              documentId={localDoc.id}
              currentUser={currentUser}
              documentOwnerId={localDoc.owner_id}
            />
          </div>
        )}
      </article>
    </div>
  );
}
