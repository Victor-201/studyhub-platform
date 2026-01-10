import { useEffect, useState } from "react";
import Avatar from "@/components/common/Avatar";
import useUser from "@/hooks/useUser";
import useTimeAgo from "@/hooks/useTimeAgo";

export default function ConversationItem({
  conv,
  authUser,
  selected,
  onSelect,
}) {
  const { loadInfo } = useUser();
  const [otherUser, setOtherUser] = useState(null);

  const timeAgo = useTimeAgo(conv.last_message_at);

  useEffect(() => {
    let mounted = true;

    const fetchOtherUser = async () => {
      const otherUserId = conv.participants.find((id) => id !== authUser.id);

      if (!otherUserId) return;

      const res = await loadInfo(otherUserId);
      if (mounted) setOtherUser(res.user);
    };

    fetchOtherUser();

    return () => {
      mounted = false;
    };
  }, [conv.participants, authUser.id]);

  if (!otherUser) return null;

  return (
    <button
      data-plain
      onClick={() => onSelect(conv, otherUser)} // <-- truyền otherUser
      className={`w-full px-4 py-3 flex gap-3 text-left border-l-4 transition
        ${
          selected
            ? "bg-[var(--color-brand-50)] border-[var(--color-primary)]"
            : "border-transparent hover:bg-gray-50"
        }`}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar
          url={otherUser.avatar_url}
          fallback={otherUser.display_name?.[0]}
          size={42}
        />
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white
            ${otherUser.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm truncate">
            {otherUser.display_name || otherUser.full_name}
          </p>
          {timeAgo && (
            <span className="text-[11px] text-gray-400">{timeAgo}</span>
          )}
        </div>

        <p className="text-xs text-gray-500 italic truncate mt-0.5">
          {conv.last_message_id?.content || "Chưa có tin nhắn"}
        </p>
      </div>
    </button>
  );
}
