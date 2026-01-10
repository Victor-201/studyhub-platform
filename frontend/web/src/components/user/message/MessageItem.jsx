import { MoreVertical, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import useTimeAgo from "@/hooks/useTimeAgo";
import Avatar from "@/components/common/Avatar";

export default function MessageItem({ msg, isMine, onDelete, sender }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false));

  const timeAgo = useTimeAgo(msg.created_at);

  return (
    <div
      className={`flex mb-4 items-end ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      {!isMine && (
        <div className="mr-3 flex-shrink-0 text-center">
          <Avatar
            url={sender?.avatar_url}
            fallback={sender?.display_name?.[0]}
            size={36}
          />
          <div className="mt-1 text-xs font-semibold text-slate-700">
            {sender?.display_name || "User"}
          </div>
        </div>
      )}

      <div
        className={`relative group max-w-[70%] flex flex-col ${
          isMine ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`
            min-w-[70px]
            relative
            px-4 py-2 pb-4 pr-5
            rounded-xl
            break-words
            shadow-sm
            ${
              isMine
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-900 rounded-bl-none"
            }
          `}
        >
          {msg.content}

          <span
            className={`
              absolute bottom-0 text-[11px] select-none
              ${isMine ? "right-2 text-blue-100" : "right-2 text-gray-400"}
            `}
          >
            {timeAgo}
          </span>

          {isMine && (
            <div
              ref={menuRef}
              className="absolute top-1 left-[-32px] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                data-plain
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1 rounded hover:bg-blue-500/20 transition"
              >
                <MoreVertical size={16} className="text-blue-600" />
              </button>

              {menuOpen && (
                <div className="absolute left-0 bottom-full mb-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    data-plain
                    onClick={() => {
                      onDelete(msg._id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!isMine && <div className="ml-3 flex-shrink-0" />}
    </div>
  );
}
