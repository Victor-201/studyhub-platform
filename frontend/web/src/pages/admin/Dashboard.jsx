import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, MessageSquare, Users, UsersRound } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { useAuth } from "@/hooks/useAuth";
import useDocument from "@/hooks/useDocument";
import useGroup from "@/hooks/useGroup";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, countAccounts } = useAuth();
  const { getDocumentCount, getCommentCount } = useDocument();
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

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const fetchStats = async () => {
      try {
        const documentsCount = await getDocumentCount();
        const commentsCount = await getCommentCount();
        const groupsRes = await countGroups?.();
        const groupsCount = groupsRes ?? 0;

        const accountsRes = await countAccounts?.();
        const { active = 0, blocked = 0, deleted = 0 } = accountsRes?.data ?? {};
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
  }, [user?.id]);

  const handleCardClick = (tab) => {
    navigate(`/admin/${tab}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Documents */}
        <div className="transition-transform hover:scale-105">
          <StatCard
            title="Documents"
            value={stats.documents}
            icon={FileText}
            color="green"
            onClick={() => handleCardClick("documents")}
          />
        </div>

        {/* Comments */}
        <div className="transition-transform hover:scale-105">
          <StatCard
            title="Comments"
            value={stats.comments}
            icon={MessageSquare}
            color="blue"
            onClick={() => handleCardClick("comments")}
          />
        </div>

        {/* Groups */}
        <div className="transition-transform hover:scale-105">
          <StatCard
            title="Groups"
            value={stats.groups}
            icon={UsersRound}
            color="red"
            onClick={() => handleCardClick("groups")}
          />
        </div>

        {/* Users card với "sub-card" bên ngoài */}
        <div className="transition-transform hover:scale-105 space-y-2">
          <StatCard
            title="Users"
            value={stats.users}
            icon={Users}
            color="yellow"
            onClick={() => handleCardClick("users")}
          />
          {/* Sub-info */}
          <div className="space-y-1">
            <div
              className="flex justify-between p-2 rounded bg-yellow-50 hover:bg-yellow-100 cursor-pointer transition"
              onClick={() => navigate("/admin/users?filter=active")}
            >
              <span>Active</span>
              <span className="font-bold">{stats.activeUsers}</span>
            </div>
            <div
              className="flex justify-between p-2 rounded bg-yellow-50 hover:bg-yellow-100 cursor-pointer transition"
              onClick={() => navigate("/admin/users?filter=blocked")}
            >
              <span>Blocked</span>
              <span className="font-bold">{stats.blockedUsers}</span>
            </div>
            <div
              className="flex justify-between p-2 rounded bg-yellow-50 hover:bg-yellow-100 cursor-pointer transition"
              onClick={() => navigate("/admin/users?filter=deleted")}
            >
              <span>Deleted</span>
              <span className="font-bold">{stats.deletedUsers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
