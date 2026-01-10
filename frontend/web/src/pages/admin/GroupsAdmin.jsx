import { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import Avatar from "@/components/common/Avatar";
import GroupModal from "@/components/user/group/GroupModal";
import useGroup from "@/hooks/useGroup";
import { formatDateTime } from "@/utils/date";

export default function GroupsAdmin() {
  const { getAllGroups, deleteGroup } = useGroup();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== Modal =====
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  // =========================
  // LOAD GROUPS
  // =========================
  useEffect(() => {
    let mounted = true;

    const fetchGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllGroups();
        if (mounted) setGroups(data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load groups.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGroups();
    return () => {
      mounted = false;
    };
  }, []);

  // =========================
  // DELETE GROUP
  // =========================
  const handleDelete = async (groupId) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    try {
      await deleteGroup(groupId);
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete group.");
    }
  };

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns = [
    {
      key: "avatar",
      title: "Avatar",
      width: "8%",
      render: (_, row) => (
        <div className="flex justify-center">
          <div className="w-9 h-9 flex-shrink-0">
            <Avatar
              url={row.avatar_url}
              size={36}
              fallback={row.name?.[0] || "G"}
            />
          </div>
        </div>
      ),
    },
    { key: "name", title: "Group Name", width: "20%" },
    { key: "description", title: "Description", width: "25%" },
    {
      key: "access",
      title: "Access",
      width: "10%",
      render: (v) => <span className="badge badge--info">{v}</span>,
    },
    { key: "count_member", title: "Members", width: "15%" },
    {
      key: "created_at",
      title: "Created",
      width: "14%",
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
        <div
          className="flex flex-col items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            data-plain
            className="action-table action-table--primary"
            onClick={() => {
              setEditingGroup(row);
              setModalOpen(true);
            }}
          >
            Edit
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
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          Manage Groups
        </h1>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingGroup(null);
            setModalOpen(true);
          }}
        >
          + Add Group
        </button>
      </div>

      <div className="card">
        {loading && <p className="text-sm text-gray-500">Loading groups...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && <Table columns={columns} data={groups} />}
      </div>

      {modalOpen && (
        <GroupModal
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            setEditingGroup(null);
            getAllGroups().then((data) => setGroups(data || []));
          }}
          groupInfo={editingGroup}
        />
      )}
    </div>
  );
}
