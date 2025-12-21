// src/pages/admin/DocumentsAdmin.jsx
import { useEffect, useState } from "react";
import useDocument from "@/hooks/useDocument";

export default function DocumentsAdmin() {
  const { getApprovedDocuments } = useDocument();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    getApprovedDocuments().then((res) => {
      setDocs(res?.data || []);
    });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Manage Documents</h1>

      <div className="bg-white rounded-xl shadow divide-y">
        {docs.map((d) => (
          <div key={d.id} className="p-4">
            <p className="font-medium">{d.title}</p>
            <p className="text-sm text-gray-500">
              Author: {d.author?.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
