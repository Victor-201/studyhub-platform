import { useEffect, useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUser from "@/hooks/useUser";

export default function UserItem({ user, authUser }) {
  const { follow, unfollow, isFollowing } = useUser();
  const [following, setFollowing] = useState(false);
  const navigate = useNavigate();

  const isOwner = authUser?.id === user.id;

  useEffect(() => {
    if (!isOwner && authUser?.id) {
      isFollowing(user.id).then(setFollowing);
    }
  }, [user.id]);

  const toggleFollow = async (e) => {
    e.stopPropagation();
    if (following) {
      await unfollow(user.id);
      setFollowing(false);
    } else {
      await follow(user.id);
      setFollowing(true);
    }
  };

  return (
    <div
      onClick={() => navigate(`/profile/${user.id}`)}
      className="flex items-center justify-between px-4 py-3 hover:bg-[var(--color-brand-50)]
                 dark:hover:bg-[var(--color-brand-700)] transition cursor-pointer"
    >
      {/* USER INFO */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={user.avatar_url || "/avatar.png"}
          className="w-11 h-11 rounded-full object-cover border"
        />

        <div className="min-w-0">
          <div className="font-semibold truncate">
            {user.full_name || user.display_name}
          </div>
          <div className="text-sm text-gray-500 truncate">
            @{user.display_name}
          </div>
        </div>
      </div>

      {/* ACTION */}
      {!isOwner && authUser && (
        <button
          onClick={toggleFollow}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold
            transition
            ${following
              ? "bg-gray-200 text-black hover:bg-gray-300"
              : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
            }`}
        >
          {following ? <UserMinus size={14} /> : <UserPlus size={14} />}
          {following ? "Đang theo dõi" : "Theo dõi"}
        </button>
      )}
    </div>
  );
}
