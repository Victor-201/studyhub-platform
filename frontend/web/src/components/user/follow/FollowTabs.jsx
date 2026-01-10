import { useEffect, useState } from "react";
import Tab from "@/components/common/Tab";
import UserItem from "@/components/user/UserItem";
import useUser from "@/hooks/useUser";

export default function FollowTabs({ authUser, onSelectUser }) {
  const [activeTab, setActiveTab] = useState("followers");
  const [loading, setLoading] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });

  const { getFollowers, getFollowing, getFollowCounts } = useUser();

  useEffect(() => {
    if (!authUser?.id) return;

    const load = async () => {
      setLoading(true);

      if (activeTab === "followers") {
        const data = await getFollowers(authUser.id);
        setFollowers(data);
      } else {
        const data = await getFollowing(authUser.id);
        setFollowing(data);
      }

      setLoading(false);
    };

    load();
  }, [activeTab, authUser?.id]);

  useEffect(() => {
    if (!authUser?.id) return;

    const loadCounts = async () => {
      const result = await getFollowCounts(authUser.id);
      setCounts(result);
    };

    loadCounts();
  }, [authUser?.id]);

  const data = activeTab === "followers" ? followers : following;

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 mb-2">
        <Tab
          label={`Followers (${counts.followers})`}
          value="followers"
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <Tab
          label={`Following (${counts.following})`}
          value="following"
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="overflow-auto flex-1">
        {loading && (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
            Đang tải danh sách...
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
            {activeTab === "followers"
              ? "Chưa có ai theo dõi bạn"
              : "Bạn chưa theo dõi ai"}
          </div>
        )}

        {!loading &&
          data.map((u) => (
            <div
              key={u.id}
              className="cursor-pointer rounded p-2 transition-colors"
            >
              <UserItem
                user={u}
                authUser={authUser}
                onSelect={() => onSelectUser?.(u.id)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
