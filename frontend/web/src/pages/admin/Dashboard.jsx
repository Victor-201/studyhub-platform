// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { FileText, MessageSquare, Users, UsersRound } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { useAuth } from "@/hooks/useAuth";
import useDocument from "@/hooks/useDocument";
import useGroup from "@/hooks/useGroup";

export default function Dashboard() {
  const { user, countAccounts } = useAuth();
  const { getCounts } = useDocument();
  const { countGroups } = useGroup();

  const [stats, setStats] = useState({
    documents: 0,
    comments: 0,
    groups: 0,
    users: 0,
    activeUsers: 0,
    blockedUsers: 0,
    deletedUsers: 0,
  });

  // ===== Fetch dashboard stats once when user.id is available =====
  useEffect(() => {
    if (!user?.id) return; // chờ user load xong

    let isMounted = true;

    const fetchStats = async () => {
      try {
        // documents & comments
        const countsRes = await getCounts?.();
        const documentsCount = countsRes?.documents ?? 0;
        const commentsCount = countsRes?.comments ?? 0;

        // groups
        const groupsRes = await countGroups?.();
        const groupsCount = groupsRes ?? 0;

        // users
        const accountsRes = await countAccounts?.();
        const {
          active = 0,
          blocked = 0,
          deleted = 0,
        } = accountsRes?.data ?? {};
        const usersCount = active + blocked + deleted;

        if (isMounted) {
          setStats({
            documents: documentsCount,
            comments: commentsCount,
            groups: groupsCount,
            users: usersCount,
            activeUsers: active,
            blockedUsers: blocked,
            deletedUsers: deleted,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [user?.id]); // thêm tất cả dependency

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Documents"
          value={stats.documents}
          icon={FileText}
          color="green"
        />
        <StatCard
          title="Comments"
          value={stats.comments}
          icon={MessageSquare}
          color="blue"
        />
        <StatCard
          title="Groups"
          value={stats.groups}
          icon={UsersRound}
          color="red"
        />
        <StatCard
          title="Users"
          value={stats.users}
          icon={Users}
          color="yellow"
        />
      </div>
    </div>
  );
}
