import { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import Avatar from "@/components/common/Avatar";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { formatDateTime } from "@/utils/date";
import UserModal from "@/components/common/UserModal";

export default function UsersAdmin() {
  const {
    user: currentUser,
    listUsers,
    lockUser,
    unlockUser,
    blockUser,
    unblockUser,
    softDeleteUser,
    restoreUser,
    updateUserRole,
  } = useAuth();

  const { loadInfo } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== Modals =====
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [roleModal, setRoleModal] = useState({
    open: false,
    user: null,
    newRole: "",
  });

  const [actionModal, setActionModal] = useState({
    open: false,
    user: null,
    action: "", // "lock" | "unlock" | "block" | "softDelete" | "unblock"
    extra: null, // reason, days
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        const res = await listUsers();
        let data = res?.data || [];

        if (currentUser) {
          data = data.filter((u) => u.id !== currentUser.id);
        }

        const users = await Promise.all(
          data.map(async (u) => {
            const info = await loadInfo(u.id);
            const profile = info?.user || info || {};

            return {
              ...u,
              display_name: profile.display_name,
              avatar: profile.avatar_url,
              full_name: profile.full_name,
              online_status: profile.status,
            };
          })
        );

        if (mounted) {
          setUsers(users);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [listUsers, currentUser]);

  // ===== Helpers =====
  const updateUserStatus = (id, status) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  // ===== Role update =====
  const confirmUpdateRole = (user, newRole) => {
    setRoleModal({ open: true, user, newRole });
  };

  const handleUpdateRoleConfirmed = async () => {
    const { user, newRole } = roleModal;
    await updateUserRole(user.id, newRole);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, roles: [newRole] } : u))
    );
    setRoleModal({ open: false, user: null, newRole: "" });
  };

  const handleRoleCancel = () => {
    setRoleModal({ open: false, user: null, newRole: "" });
  };

  // ===== Table columns =====
  const columns = [
    {
      key: "avatar",
      title: "Avatar",
      width: "8%",
      render: (_, row) => (
        <div className="flex justify-center">
          <div className="w-9 h-9 flex-shrink-0">
            <Avatar
              url={row.avatar}
              size={36}
              fallback={row.name?.[0] || "G"}
            />
          </div>
        </div>
      ),
    },

    { key: "user_name", title: "User Name", width: "10%" },
    { key: "email", title: "Email", width: "15%" },
    { key: "display_name", title: "Name", width: "10%" },
    {
      key: "roles",
      title: "Role",
      width: "10%",
      render: (_, row) => (
        <select
          className="border border-[var(--color-brand-200)] rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          value={row.roles?.[0] || ""}
          onChange={(e) => confirmUpdateRole(row, e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      ),
    },
    {
      key: "status",
      title: "Status",
      width: "5%",
      render: (_, row) => (
        <span
          className={`badge capitalize ${
            row.status === "active"
              ? "badge--success"
              : row.status === "locked"
              ? "badge--warning"
              : row.status === "blocked"
              ? "badge--danger"
              : "badge--info"
          } text-white px-3 py-1 rounded-full text-sm`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "last_login_at",
      title: "Last login",
      width: "10%",
      render: (_, row) => {
        const dt = formatDateTime(row.last_login_at);
        return dt ? `${dt.date} ${dt.time}` : "-";
      },
    },
    {
      key: "created_at",
      title: "Created",
      width: "10%",
      render: (_, row) => {
        const dt = formatDateTime(row.created_at);
        return dt ? `${dt.date} ${dt.time}` : "-";
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: "20%",
      render: (_, row) => (
        <div className="flex flex-wrap gap-2 justify-center">
          {/* Edit */}
          <button
            data-plain
            className="action-table action-table--primary"
            onClick={() => {
              setEditingUser(row);
              setUserModalOpen(true);
            }}
          >
            Edit
          </button>

          {/* Lock / Unlock */}
          {row.status === "active" && (
            <button
              data-plain
              className="action-table action-table--danger"
              onClick={() =>
                setActionModal({
                  open: true,
                  user: row,
                  action: "lock",
                  extra: null,
                })
              }
            >
              Lock
            </button>
          )}

          {row.status === "locked" && (
            <button
              data-plain
              className="action-table action-table--success"
              onClick={() =>
                setActionModal({
                  open: true,
                  user: row,
                  action: "unlock",
                  extra: null,
                })
              }
            >
              Unlock
            </button>
          )}

          {/* Block */}
          {row.status !== "blocked" && (
            <>
              <button
                data-plain
                className="action-table action-table--danger"
                onClick={() =>
                  setActionModal({
                    open: true,
                    user: row,
                    action: "block",
                    extra: { permanent: true, reason: "" },
                  })
                }
              >
                Block permanently
              </button>

              <button
                data-plain
                className="action-table action-table--danger"
                onClick={() =>
                  setActionModal({
                    open: true,
                    user: row,
                    action: "block",
                    extra: { permanent: false, reason: "", days: "" },
                  })
                }
              >
                Block
              </button>
            </>
          )}

          {/* Unblock */}
          {row.status === "blocked" && (
            <button
              data-plain
              className="action-table action-table--success"
              onClick={() =>
                setActionModal({
                  open: true,
                  user: row,
                  action: "unblock",
                  extra: null,
                })
              }
            >
              Unblock
            </button>
          )}

          {/* Delete / Restore */}
          {row.status !== "deleted" && (
            <button
              data-plain
              className="action-table action-table--danger"
              onClick={() =>
                setActionModal({
                  open: true,
                  user: row,
                  action: "softDelete",
                  extra: { reason: "" },
                })
              }
            >
              Delete
            </button>
          )}

          {row.status === "deleted" && (
            <button
              data-plain
              className="action-table action-table--success"
              onClick={async () => {
                await restoreUser(row.id);
                updateUserStatus(row.id, "active");
              }}
            >
              Restore
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
        Manage Users
      </h1>

      <div className="card p-4">
        {loading && <p className="text-sm text-gray-500">Loading users...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading &&
          !error &&
          (users.length ? (
            <Table columns={columns} data={users} />
          ) : (
            <p className="text-sm text-gray-500">No users found.</p>
          ))}
      </div>

      {/* User Modal */}
      {userModalOpen && editingUser && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setUserModalOpen(false);
            setEditingUser(null);
          }}
          onSave={(updated) => {
            setUsers((prev) =>
              prev.map((u) => (u.id === updated.id ? updated : u))
            );
            setUserModalOpen(false);
            setEditingUser(null);
          }}
        />
      )}

      {/* Role Modal */}
      {roleModal.open && roleModal.user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Role Change</h2>
            <p className="mb-4">
              Change <strong>{roleModal.user.email}</strong> role to{" "}
              <strong>{roleModal.newRole}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                onClick={handleRoleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-blue-700"
                onClick={handleUpdateRoleConfirmed}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal.open && actionModal.user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 capitalize">
              {actionModal.action.replace(/([A-Z])/g, " $1")}
            </h2>

            {(actionModal.action === "block" ||
              actionModal.action === "softDelete") && (
              <div className="mb-4">
                <label className="block text-sm mb-1">Reason</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-2 py-1"
                  value={actionModal.extra?.reason || ""}
                  onChange={(e) =>
                    setActionModal((prev) => ({
                      ...prev,
                      extra: { ...prev.extra, reason: e.target.value },
                    }))
                  }
                />
                {actionModal.action === "block" &&
                  !actionModal.extra?.permanent && (
                    <>
                      <label className="block text-sm mt-2 mb-1">Days</label>
                      <input
                        type="number"
                        className="w-full border rounded-md px-2 py-1"
                        value={actionModal.extra?.days || ""}
                        onChange={(e) =>
                          setActionModal((prev) => ({
                            ...prev,
                            extra: { ...prev.extra, days: e.target.value },
                          }))
                        }
                      />
                    </>
                  )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                onClick={() =>
                  setActionModal({
                    open: false,
                    user: null,
                    action: "",
                    extra: null,
                  })
                }
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-blue-700"
                onClick={async () => {
                  const { user, action, extra } = actionModal;

                  if (action === "lock") {
                    await lockUser(user.id);
                    updateUserStatus(user.id, "locked");
                  }
                  if (action === "unlock") {
                    await unlockUser(user.id);
                    updateUserStatus(user.id, "active");
                  }
                  if (action === "block") {
                    const blockedUntil = extra?.days
                      ? new Date(Date.now() + extra.days * 24 * 60 * 60 * 1000)
                      : null;
                    await blockUser(user.id, extra?.reason || "", blockedUntil);
                    updateUserStatus(user.id, "blocked");
                  }
                  if (action === "unblock") {
                    await unblockUser(user.id);
                    updateUserStatus(user.id, "active");
                  }
                  if (action === "softDelete") {
                    await softDeleteUser(user.id, extra?.reason || "");
                    updateUserStatus(user.id, "deleted");
                  }

                  setActionModal({
                    open: false,
                    user: null,
                    action: "",
                    extra: null,
                  });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
