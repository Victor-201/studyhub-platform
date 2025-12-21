import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import useDocument from "@/hooks/useDocument";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";

import FeedList from "@/components/user/document/FeedList";
import UserItem from "@/components/user/UserItem";
import LogItem from "@/components/common/LogItem";
import Tab from "@/components/common/Tab";

export default function GroupTabs({ group, authUser }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "documents";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);

  const [cache, setCache] = useState({
    documents: [],
    members: [],
    logs: [],
  });
  const [membersInfo, setMembersInfo] = useState([]);

  const { getGroupApproved } = useDocument();
  const { getGroupMembers, getActivityLogs } = useGroup();
  const { loadInfo } = useUser();

  /* guard group chưa load */
  const canViewLogs =
    group?.role === "OWNER" || group?.role === "MODERATOR";

  const isRestrictedAndNotJoined =
    group?.role == null && group?.access === "RESTRICTED";

  /* sync tab từ URL */
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  /* reset cache khi đổi group */
  useEffect(() => {
    if (!group?.id) return;
    setCache({ documents: [], members: [], logs: [] });
    setMembersInfo([]);
  }, [group?.id]);

  /* load data theo tab (NO stale closure) */
  useEffect(() => {
    if (!group?.id || isRestrictedAndNotJoined) return;

    const shouldLoadDocuments =
      activeTab === "documents" && cache.documents.length === 0;

    const shouldLoadMembers =
      activeTab === "members" && cache.members.length === 0;

    const shouldLoadLogs =
      activeTab === "logs" && canViewLogs && cache.logs.length === 0;

    if (!shouldLoadDocuments && !shouldLoadMembers && !shouldLoadLogs) return;

    const load = async () => {
      setLoading(true);
      try {
        if (shouldLoadDocuments) {
          const res = await getGroupApproved(group.id);
          setCache((p) => ({ ...p, documents: res?.data || [] }));
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
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [
    activeTab,
    group?.id,
    canViewLogs,
    isRestrictedAndNotJoined,
    cache.documents.length,
    cache.members.length,
    cache.logs.length,
  ]);

  /* đổi tab + sync URL */
  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <div className="bg-[var(--color-surface)] dark:bg-[var(--color-brand-600)] rounded-xl shadow p-4 text-[var(--color-on-surface)] dark:text-[var(--color-brand-50)]">
      {/* TABS */}
      <div className="flex gap-6 border-b border-[var(--color-brand-200)] dark:border-[var(--color-brand-500)] mb-4">
        <Tab
          label="Thảo luận"
          value="documents"
          activeTab={activeTab}
          onChange={handleTabChange}
        />
        <Tab
          label="Thành viên"
          value="members"
          activeTab={activeTab}
          onChange={handleTabChange}
        />
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
        <FeedList feed={cache.documents} />
      ) : activeTab === "members" ? (
        membersInfo.length > 0 ? (
          <div className="divide-y divide-[var(--color-brand-200)] dark:divide-[var(--color-brand-500)]">
            {membersInfo.map((user) => (
              <UserItem key={user.id} user={user} authUser={authUser} />
            ))}
          </div>
        ) : (
          <p className="py-6 text-center">Không có thành viên nào.</p>
        )
      ) : (
        canViewLogs && (
          <div className="text-sm space-y-2">
            {cache.logs.map((log) => (
              <LogItem key={log.id} log={log} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
