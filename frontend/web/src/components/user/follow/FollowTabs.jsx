import { useEffect, useState } from "react";
import Tab from "@/components/common/Tab";
import UserItem from "@/components/user/UserItem";
import useUser from "@/hooks/useUser";

export default function FollowTabs({ authUser }) {
  const [activeTab, setActiveTab] = useState("followers");
  const [loading, setLoading] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const { getFollowers, getFollowing } = useUser();

  useEffect(() => {
    if (!authUser?.id) return;

    const load = async () => {
      setLoading(true);
      if (activeTab === "followers") {
        setFollowers(await getFollowers(authUser.id));
      } else {
        setFollowing(await getFollowing(authUser.id));
      }
      setLoading(false);
    };

    load();
  }, [activeTab, authUser?.id]);

  const data = activeTab === "followers" ? followers : following;

  return (
    <div className="space-y-4">
      {/* TABS */}
      <div className="flex gap-6 border-b">
        <Tab label="Followers" value="followers" activeTab={activeTab} onChange={setActiveTab} />
        <Tab label="Following" value="following" activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* LIST */}
      <div className="card p-0 overflow-hidden">
        {loading && (
          <div className="py-10 text-center text-gray-500 text-sm">
            Đang tải danh sách...
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="py-10 text-center text-gray-500 text-sm">
            {activeTab === "followers"
              ? "Chưa có ai theo dõi bạn"
              : "Bạn chưa theo dõi ai"}
          </div>
        )}

        {!loading && data.map((u) => (
          <UserItem key={u.id} user={u} authUser={authUser} />
        ))}
      </div>
    </div>
  );
}
