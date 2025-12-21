import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { Download, Bookmark, MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";

import useDocument from "@/hooks/useDocument";
import useUser from "@/hooks/useUser";
import useTimeAgo from "@/hooks/useTimeAgo";

import CommentSection from "@/components/user/comment/CommentSection";
import Avatar from "@/components/common/Avatar";
import TagList from "@/components/common/TagList";

export default function DocumentDetail() {
  const { document_id } = useParams();
  const { currentUser } = useOutletContext();
  const navigate = useNavigate();
  /* ===== DOCUMENT ===== */
  const { document, loadDocument, download, toggleBookmark } =
    useDocument(document_id);

  /* ===== OWNER ===== */
  const { info: ownerInfo, loadInfo: loadOwnerInfo } = useUser();

  /* ===== FETCH CONTROL ===== */
  const fetchedDocRef = useRef(false);
  const fetchedOwnerRef = useRef(false);

  /* ===== LOAD DOCUMENT ===== */
  useEffect(() => {
    if (!document_id || fetchedDocRef.current) return;
    fetchedDocRef.current = true;

    loadDocument();
  }, [document_id, loadDocument]);

  /* ===== LOAD OWNER ===== */
  useEffect(() => {
    if (!document?.owner_id || fetchedOwnerRef.current) return;
    fetchedOwnerRef.current = true;

    loadOwnerInfo(document.owner_id);
  }, [document?.owner_id, loadOwnerInfo]);

  /* ===== SAFE DERIVED DATA ===== */
  const stats = document?.stats ?? {
    comments: 0,
    bookmarks: 0,
    downloads: 0,
  };

  const owner = ownerInfo?.user;

  const timeAgo = useTimeAgo(document?.created_at ?? null);

  const previewUrl = document?.preview_url;

  /* ===== LOADING ===== */
  if (!document) {
    return <div className="p-6 text-sm text-gray-500">Đang tải tài liệu…</div>;
  }

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
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <button
                  onClick={toggleBookmark}
                  className="flex items-center gap-1 px-2 py-1 bg-white border rounded-md text-xs"
                >
                  <Bookmark size={16} />
                  <span>{stats.bookmarks}</span>
                </button>

                <button
                  onClick={download}
                  className="flex items-center gap-1 px-2 py-1 bg-white border rounded-md text-xs"
                >
                  <Download size={16} />
                  <span>{stats.downloads}</span>
                </button>
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
                  Không có preview
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
              <h1 className="text-2xl font-semibold">{document.title}</h1>
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>

            <TagList tags={document.tags || document.tag} max={10} size="sm" />

            <p className="text-sm text-gray-700">{document.description}</p>

            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare size={16} />
              <span>{stats.comments}</span>
            </div>

            <CommentSection
              documentId={document_id}
              currentUser={currentUser}
              documentOwnerId={document.owner_id}
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

          <h1 className="text-xl font-semibold">{document.title}</h1>

          <TagList tags={document.tags || document.tag} max={8} size="xs" />

          <p className="text-sm text-gray-700">{document.description}</p>

          <div className="bg-white rounded-md overflow-hidden shadow-sm aspect-[3/2]">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-full"
                loading="eager"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            )}
          </div>

          <div className="flex gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Bookmark size={14} /> {stats.bookmarks}
            </span>
            <span className="flex items-center gap-1">
              <Download size={14} /> {stats.downloads}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={14} /> {stats.comments}
            </span>
          </div>

          <CommentSection
            documentId={document_id}
            currentUser={currentUser}
            documentOwnerId={document.owner_id}
          />
        </div>
      </div>
    </div>
  );
}
