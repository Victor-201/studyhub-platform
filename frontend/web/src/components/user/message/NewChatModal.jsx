import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Avatar from "@/components/common/Avatar";
import useUser from "@/hooks/useUser";

export default function NewChatModal({
  isOpen,
  onClose,
  onSelectUser,
  authUser,
}) {
  const { getFriends, getFollowers, getFollowing } = useUser();

  const [friends, setFriends] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("friends");

  useEffect(() => {
    if (!isOpen || !authUser?.id) return;
    loadData();
  }, [isOpen, authUser?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [a, b, c] = await Promise.all([
        getFriends(authUser.id),
        getFollowers(authUser.id),
        getFollowing(authUser.id),
      ]);
      setFriends(a || []);
      setFollowers(b || []);
      setFollowing(c || []);
    } finally {
      setLoading(false);
    }
  };

  const data =
    tab === "friends" ? friends : tab === "followers" ? followers : following;

  const filtered = data.filter((u) =>
    (u.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/30
          "
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              w-full max-w-md
              bg-white dark:bg-slate-900
              rounded-xl
              shadow-[0_12px_40px_rgba(0,0,0,0.18)]
            "
          >
            {/* HEADER */}
            <div className="px-8 pt-6 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">
                    New Conversation
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Select a user to initiate a private message
                  </p>
                </div>
                <button
                  data-plain
                  onClick={onClose}
                  className="
                    p-1.5 rounded-md
                    hover:bg-black/5 dark:hover:bg-white/10
                    transition
                    focus:outline-none
                  "
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="px-8 pb-6 space-y-5">
              {/* Tabs */}
              <div className="flex gap-6 text-sm">
                {[
                  { k: "friends", l: "Friends" },
                  { k: "followers", l: "Followers" },
                  { k: "following", l: "Following" },
                ].map((t) => (
                  <button
                    data-plain
                    key={t.k}
                    onClick={() => setTab(t.k)}
                    className={`
                      relative pb-1
                      transition
                      focus:outline-none
                      ${
                        tab === t.k
                          ? "text-slate-900 dark:text-white font-medium"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }
                    `}
                  >
                    {t.l}
                    {tab === t.k && (
                      <span
                        className="
                        absolute left-0 -bottom-0.5
                        w-full h-[2px]
                        bg-[var(--color-primary)]
                      "
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by display name"
                  className="
                    w-full pl-9 pr-3 py-2.5
                    text-sm
                    bg-slate-100 dark:bg-slate-800
                    rounded-md
                    placeholder:text-slate-400
                    focus:outline-none
                    transition
                  "
                />
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto">
                {loading ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Loading users…
                  </p>
                ) : filtered.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No matching users found
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {filtered.map((u) => (
                      <li key={u.id}>
                        <button
                          data-plain
                          onClick={() => {
                            onSelectUser(u.id);
                            onClose();
                          }}
                          className="
                            w-full flex items-center gap-4
                            px-3 py-2.5
                            rounded-md
                            hover:bg-slate-100 dark:hover:bg-slate-800
                            transition
                            focus:outline-none
                          "
                        >
                          <Avatar
                            url={u.avatar_url}
                            fallback={u.display_name?.[0]}
                            size={36}
                          />
                          <div className="min-w-0 text-left">
                            <p className="text-sm font-medium truncate">
                              {u.display_name}
                            </p>
                            {u.full_name && (
                              <p className="text-xs text-slate-500 truncate">
                                {u.full_name}
                              </p>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
