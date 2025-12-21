// src/pages/admin/GroupsAdmin.jsx
import { useEffect, useState } from "react";
import useGroup from "@/hooks/useGroup";

export default function GroupsAdmin() {
  const { findGroups, deleteGroup } = useGroup();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    findGroups().then(setGroups);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Manage Groups</h1>

      <div className="bg-white rounded-xl shadow divide-y">
        {groups.map((g) => (
          <div key={g.id} className="p-4 flex justify-between">
            <span>{g.name}</span>
            <button
              onClick={() => deleteGroup(g.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
