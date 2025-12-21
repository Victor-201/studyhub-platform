import { useState } from "react";
import DocumentItem from "./DocumentItem";

export default function FeedList({
  loading,
  error,
  feed,
  currentUser,
}) {
  const [openCommentId, setOpenCommentId] = useState(null);

  if (error)
    return (
      <div className="bg-red-100 text-red-700 p-3 rounded-lg">
        {error}
      </div>
    );

  if (loading)
    return (
      <div className="text-gray-500 text-center py-6">
        Đang tải dữ liệu...
      </div>
    );

  if (!feed?.length)
    return (
      <div className="text-gray-500">
        Không có tài liệu nào.
      </div>
    );

  return (
    <div className="space-y-4">
      {feed.map((doc) => (
        <DocumentItem
          key={doc.id}
          doc={doc}
          currentUser={currentUser}
          showComments={openCommentId === doc.id}
          onToggleComments={() =>
            setOpenCommentId((prev) =>
              prev === doc.id ? null : doc.id
            )
          }
        />
      ))}
    </div>
  );
}
