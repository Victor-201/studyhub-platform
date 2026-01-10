import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useDocument from "@/hooks/useDocument";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";

import CreateDocument from "@/components/common/CreateDocument";
import FeedList from "@/components/user/document/FeedList";
import UserItem from "@/components/user/UserItem";
import DocumentItem from "@/components/user/document/DocumentItem";
import LogItem from "@/components/common/LogItem";
import Tab from "@/components/common/Tab";
import Table from "@/components/common/Table";
import { formatDateTime } from "@/utils/date";

export default function GroupTabs({ group, authUser, currentUser }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "documents";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);

  const [cache, setCache] = useState({
    documents: [],
    pending: [],
    members: [],
    logs: [],
  });

  const [membersInfo, setMembersInfo] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);

  const {
    getGroupApproved,
    getGroupPending,
    approve,
    reject,
    loadDocumentPreview,
  } = useDocument();
  const {
    getGroupMembers,
    getActivityLogs,
    removeMember,
    getJoinRequests,
    approveJoin,
    rejectJoin,
  } = useGroup();
  const { loadInfo } = useUser();

  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const canViewLogs = group?.role === "OWNER" || group?.role === "MODERATOR";
  const canModerate = canViewLogs;
  const canApproveMembers = canModerate;
  const isRestrictedAndNotJoined =
    group?.role == null && group?.access === "RESTRICTED";

  // -----------------------------
  // Effects
  // -----------------------------
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (!group?.id) return;
    setCache({ documents: [], pending: [], members: [], logs: [] });
    setMembersInfo([]);
    setJoinRequests([]);
  }, [group?.id]);

  useEffect(() => {
    if (!group?.id || isRestrictedAndNotJoined) return;

    const shouldLoadDocuments =
      activeTab === "documents" && cache.documents.length === 0;
    const shouldLoadPending =
      activeTab === "pending" && canModerate && cache.pending.length === 0;
    const shouldLoadMembers =
      activeTab === "members" && cache.members.length === 0;
    const shouldLoadLogs =
      activeTab === "logs" && canViewLogs && cache.logs.length === 0;
    const shouldLoadJoinRequests =
      activeTab === "join_requests" &&
      canApproveMembers &&
      joinRequests.length === 0;

    if (
      !shouldLoadDocuments &&
      !shouldLoadPending &&
      !shouldLoadMembers &&
      !shouldLoadLogs &&
      !shouldLoadJoinRequests
    )
      return;

    const load = async () => {
      setLoading(true);
      try {
        if (shouldLoadDocuments) {
          const res = await getGroupApproved(group.id);
          setCache((p) => ({ ...p, documents: res?.data || [] }));
        }
        if (shouldLoadPending) {
          const res = await getGroupPending(group.id);
          setCache((p) => ({ ...p, pending: res?.data || [] }));
        }
        if (shouldLoadMembers) {
          const members = await getGroupMembers(group.id);
          setCache((p) => ({ ...p, members }));

          const infos = await Promise.all(
            members.map(async (m) => {
              const info = await loadInfo(m.user_id);
              if (!info?.user) return null;
              return {
                ...info.user,
                role: m.role,
                joined_at: m.joined_at,
              };
            })
          );
          setMembersInfo(infos.filter(Boolean));
        }
        if (shouldLoadLogs) {
          const logs = await getActivityLogs(group.id);
          setCache((p) => ({ ...p, logs }));
        }
        if (shouldLoadJoinRequests) {
          const res = await getJoinRequests(group.id);
          // Preload user info to avoid undefined
          const requestsWithUser = await Promise.all(
            (res.items || []).map(async (req) => {
              const info = await loadInfo(req.user_id);
              return {
                ...req,
                user: info?.user || {
                  id: req.user_id,
                  name: "Unknown",
                  avatar: "",
                },
              };
            })
          );
          setJoinRequests(requestsWithUser);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [
    activeTab,
    group?.id,
    canModerate,
    canViewLogs,
    canApproveMembers,
    isRestrictedAndNotJoined,
    cache.documents.length,
    cache.pending.length,
    cache.members.length,
    cache.logs.length,
    joinRequests.length,
  ]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  const handleApproveDoc = async (docId) => {
    await approve(docId, group.id);
    setCache((prev) => ({
      ...prev,
      pending: prev.pending.filter((d) => d.id !== docId),
    }));
  };

  const handleRejectDoc = async (docId) => {
    await reject(docId, group.id);
    setCache((prev) => ({
      ...prev,
      pending: prev.pending.filter((d) => d.id !== docId),
    }));
  };

  const handleRemoveMember = async (userId) => {
    if (!group?.id || !userId) return;
    const ok = window.confirm(
      "Bạn có chắc muốn đuổi thành viên này khỏi nhóm?"
    );
    if (!ok) return;

    await removeMember(group.id, userId);
    setMembersInfo((prev) => prev.filter((u) => u.id !== userId));
    setCache((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.user_id !== userId),
    }));
  };

  const handlePreview = async (doc) => {
    setPreviewDoc(doc);
    setPreviewUrl(null);
    setLoadingPreview(true);

    try {
      const url = await loadDocumentPreview(doc.id);
      if (!url) {
        alert("No preview available");
        setPreviewDoc(null);
        return;
      }
      setPreviewUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to load preview");
      setPreviewDoc(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  const closeModal = () => {
    setPreviewDoc(null);
    setPreviewUrl(null);
  };

  const handleApproveMember = async (requestId, groupId = group.id) => {
    await approveJoin(requestId, groupId);
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const handleRejectMember = async (requestId, groupId = group.id) => {
    await rejectJoin(requestId, groupId);
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // -----------------------------
  // Table columns
  // -----------------------------
  const memberColumns = [
    {
      key: "user",
      title: "User",
      width: "50%",
      render: (_, row) => <UserItem user={row} authUser={authUser} />,
    },
    {
      key: "role",
      title: "Role",
      width: "20%",
      render: (v) => <span className="badge badge--info">{v}</span>,
    },
    {
      key: "joined_at",
      title: "Ngày tham gia",
      width: "15%",
      render: (_, row) => {
        const dt = formatDateTime(row.joined_at);
        return dt ? `${dt.date} ${dt.time}` : "-";
      },
    },
    {
      key: "actions",
      title: "Hành động",
      width: "15%",
      render: (_, row) => {
        const isSelf = authUser?.id === row.id;
        const isOwner = row.role === "OWNER";
        const isModerator = row.role === "MODERATOR";
        const canRemove =
          canModerate &&
          !isSelf &&
          !isOwner &&
          (group.role === "OWNER" ||
            (group.role === "MODERATOR" && !isModerator));

        return canRemove ? (
          <button
            data-plain
            onClick={() => handleRemoveMember(row.id)}
            className="action-table action-table--danger"
          >
            Đuổi
          </button>
        ) : (
          "-"
        );
      },
    },
  ];

  const pendingColumns = [
    {
      title: "Tiêu đề",
      key: "title",
      width: "20%",
      render: (val) => (
        <span className="font-medium text-[var(--color-primary)]">{val}</span>
      ),
    },
    { title: "Mô tả", key: "description", width: "20%" },
    { title: "File", key: "file_name", width: "20%" },
    {
      title: "Tags",
      key: "tags",
      width: "10%",
      render: (tags) => (
        <div className="text-gray-600">
          #{tags?.length ? tags.join(", ") : "-"}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      key: "created_at",
      width: "10%",
      render: (val) => {
        const dt = formatDateTime(val);
        if (!dt) return <div>-</div>;
        return (
          <div>
            {dt.date}
            <br />
            {dt.time}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (_, row) => (
        <div
          className="flex flex-col items-start gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            data-plain
            className="action-table action-table--primary"
            onClick={() => handlePreview(row)}
            disabled={loadingPreview}
          >
            Preview
          </button>
          <button
            data-plain
            className="action-table action-table--success"
            onClick={() => handleApproveDoc(row.id)}
          >
            Duyệt
          </button>
          <button
            data-plain
            className="action-table action-table--danger"
            onClick={() => handleRejectDoc(row.id)}
          >
            Từ chối
          </button>
        </div>
      ),
    },
  ];

  const joinRequestColumns = [
    {
      key: "user",
      title: "User",
      width: "50%",
      render: (_, row) => {
        const user = row.user || {
          id: row.user_id,
          name: "Unknown",
          avatar: "",
        };
        return <UserItem user={user} authUser={authUser} />;
      },
    },
    {
      key: "joined_at",
      title: "Ngày yêu cầu",
      width: "30%",
      render: (_, row) => {
        const dt = formatDateTime(row.requested_at || row.created_at);
        return dt ? `${dt.date} ${dt.time}` : "-";
      },
    },
    {
      key: "actions",
      title: "Hành động",
      width: "20%",
      render: (_, row) => (
        <div className="flex flex-col items-start gap-1">
          <button
            data-plain
            className="action-table action-table--success"
            onClick={() => handleApproveMember(row.id)}
          >
            Duyệt
          </button>
          <button
            data-plain
            className="action-table action-table--danger"
            onClick={() => handleRejectMember(row.id)}
          >
            Từ chối
          </button>
        </div>
      ),
    },
  ];

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="bg-[var(--color-surface)] rounded-xl shadow p-4">
      {/* TABS */}
      <div className="flex gap-6 border-b mb-4">
        <Tab
          label="Thảo luận"
          value="documents"
          activeTab={activeTab}
          onChange={handleTabChange}
        />
        {canModerate && (
          <Tab
            label="Chờ duyệt"
            value="pending"
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        )}
        <Tab
          label="Thành viên"
          value="members"
          activeTab={activeTab}
          onChange={handleTabChange}
        />
        {canApproveMembers && (
          <Tab
            label="Yêu cầu tham gia"
            value="join_requests"
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        )}
        {canViewLogs && (
          <Tab
            label="Nhật ký"
            value="logs"
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        )}
      </div>

      {/* CONTENT */}
      {isRestrictedAndNotJoined ? (
        <p className="py-6 text-center">
          Nhóm này là <strong>nhóm riêng tư</strong>. Hãy tham gia nhóm.
        </p>
      ) : loading ? (
        <p className="py-6 text-center">Đang tải...</p>
      ) : activeTab === "documents" ? (
        <div className="mx-auto">
          <CreateDocument groupId={group.id} />
          <FeedList feed={cache.documents} />
        </div>
      ) : activeTab === "pending" && canModerate ? (
        cache.pending.length > 0 ? (
          <Table columns={pendingColumns} data={cache.pending} />
        ) : (
          <p className="py-6 text-center">Không có tài liệu chờ duyệt.</p>
        )
      ) : activeTab === "members" ? (
        membersInfo.length > 0 ? (
          <Table columns={memberColumns} data={membersInfo} />
        ) : (
          <p className="py-6 text-center">Không có thành viên nào.</p>
        )
      ) : activeTab === "join_requests" && canApproveMembers ? (
        joinRequests.length > 0 ? (
          <Table columns={joinRequestColumns} data={joinRequests} />
        ) : (
          <p className="py-6 text-center">Không có yêu cầu tham gia nào.</p>
        )
      ) : activeTab === "logs" && canViewLogs ? (
        cache.logs.length > 0 ? (
          <div className="space-y-2">
            {cache.logs.map((log) => (
              <LogItem key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <p className="py-6 text-center">Không có hoạt động nào.</p>
        )
      ) : null}

      {/* ===== PREVIEW MODAL ===== */}
      {previewDoc && (
        <DocumentItem
          doc={previewDoc}
          currentUser={currentUser}
          authUser={authUser}
          isPreview={true}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
