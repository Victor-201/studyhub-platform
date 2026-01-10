import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DocumentItem from "./DocumentItem";

export default function FeedList({
  loading,
  error,
  feed,
  currentUser,
  authUser,
  isPending = false,
}) {
  const [openCommentId, setOpenCommentId] = useState(null);

  if (error)
    return (
      <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>
    );

  if (loading)
    return (
      <div className="text-gray-500 text-center py-6">Đang tải dữ liệu...</div>
    );

  if (!feed?.length)
    return <div className="text-gray-500">Không có tài liệu nào.</div>;

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      <AnimatePresence>
        {feed.map((doc) => (
          <motion.div key={doc.id} variants={itemVariants} layout>
            <DocumentItem
              doc={doc}
              currentUser={currentUser}
              authUser={authUser}
              isPending={isPending}
              showComments={openCommentId === doc.id}
              onToggleComments={() =>
                setOpenCommentId((prev) => (prev === doc.id ? null : doc.id))
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
