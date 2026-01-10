import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Users } from "lucide-react";
import FollowTabs from "@/components/user/follow/FollowTabs";
import { motion, AnimatePresence } from "framer-motion";
import Profile from "@/pages/user/Profile";

export default function Follow() {
  const { authUser, currentUser } = useOutletContext();
  const [selectedUserId, setSelectedUserId] = useState(null);

  if (!authUser) {
    return (
      <div className="flex justify-center items-center py-20 text-sm text-gray-500 dark:text-gray-400">
        Đang tải dữ liệu theo dõi...
      </div>
    );
  }

  return (
    <div className="container flex min-h-screen max-w-7xl m-auto px-3 gap-6">
      {/* Sidebar */}
      <aside className="flex-[1] min-w-[350px] max-w-[400px] border-r p-4 flex flex-col gap-3 overflow-hidden rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Users size={20} />
          <h2 className="text-lg font-bold">Theo dõi</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <FollowTabs authUser={authUser} onSelectUser={setSelectedUserId} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-[2] rounded-xl p-4 overflow-auto relative">
        <AnimatePresence mode="wait">
          {selectedUserId ? (
            <motion.div
              key={selectedUserId}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Profile userId={selectedUserId} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="py-20 text-center text-gray-500 dark:text-gray-400"
            >
              Chọn người dùng để xem profile
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
