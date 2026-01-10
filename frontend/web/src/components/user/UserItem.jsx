import { useEffect, useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUser from "@/hooks/useUser";
import Avatar from "@/components/common/Avatar";

export default function UserItem({ user, authUser, onSelect }) {
  const { follow, unfollow, isFollowing } = useUser();
  const [following, setFollowing] = useState(false);
  const navigate = useNavigate();

  const isOwner = authUser?.id === user.id;

  useEffect(() => {
    if (!isOwner && authUser?.id) {
      isFollowing(user.id).then(setFollowing);
    }
  }, [user.id, authUser?.id]);

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
      onClick={() => (onSelect ? onSelect() : navigate(`/profile/${user.id}`))}
      className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition h-[60px] cursor-pointer"
    >
      {/* USER INFO */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          url={user.avatar_url}
          fallback={user.display_name?.[0]}
          size={40}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">
              {user.full_name || user.display_name}
            </h3>
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
            <span> @{user.display_name}</span>
          </div>
        </div>
      </div>

      {/* ACTION */}
      {!isOwner && authUser && (
        <button
          data-plain
          onClick={toggleFollow}
          className={`
    flex items-center justify-center gap-1
    min-w-[36px]
    px-3 py-1.5
    rounded-full text-xs font-semibold
    whitespace-nowrap
    transition
    cursor-pointer
    ${
      following
        ? "bg-gray-200 text-black hover:bg-gray-300"
        : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
    }
  `}
        >
          {following ? <UserMinus size={14} /> : <UserPlus size={14} />}

          <span className="hidden md:inline whitespace-nowrap">
            {following ? "Đang theo dõi" : "Theo dõi"}
          </span>
        </button>
      )}
    </div>
  );
}
