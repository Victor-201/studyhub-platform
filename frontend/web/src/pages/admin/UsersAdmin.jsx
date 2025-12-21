// src/pages/admin/UsersAdmin.jsx
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";

export default function UsersAdmin() {
  const { searchUsers } = useUser();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    searchUsers("").then(setUsers);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Manage Users</h1>

      <div className="bg-white rounded-xl shadow divide-y">
        {users.map((u) => (
          <div key={u.id} className="p-4 flex justify-between">
            <span>{u.email}</span>
            <span className="text-sm text-gray-500">{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
