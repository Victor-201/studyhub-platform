// src/pages/admin/CommentsAdmin.jsx
import { useEffect, useState } from "react";
import useDocument from "@/hooks/useDocument";

export default function CommentsAdmin() {
  const { getAllComments, deleteComment } = useDocument();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getAllComments().then((res) => {
      setComments(res?.data || []);
    });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Manage Comments</h1>

      <div className="bg-white rounded-xl shadow divide-y">
        {comments.map((c) => (
          <div key={c.id} className="p-4">
            <p className="text-sm">{c.content}</p>
            <button
              onClick={() => deleteComment(c.id)}
              className="text-red-500 text-xs mt-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
