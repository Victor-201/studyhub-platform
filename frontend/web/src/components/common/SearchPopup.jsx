import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

import useClickOutside from "@/hooks/useClickOutside";
import useUser from "@/hooks/useUser";
import useGroup from "@/hooks/useGroup";
import useDocument from "@/hooks/useDocument";

import UserItem from "@/components/user/UserItem";
import GroupCard from "@/components/user/group/GroupCard";

// file icons
import docIcon from "@/assets/icons/doc.png";
import pdfIcon from "@/assets/icons/pdf.png";
import pptIcon from "@/assets/icons/ppt.png";
import xlsIcon from "@/assets/icons/xls.png";
import jsonIcon from "@/assets/icons/json.png";
import imgIcon from "@/assets/icons/img.png";
import videoIcon from "@/assets/icons/video.png";
import zipIcon from "@/assets/icons/zip.png";

const fileIcons = {
  doc: docIcon,
  docx: docIcon,
  pdf: pdfIcon,
  ppt: pptIcon,
  pptx: pptIcon,
  xls: xlsIcon,
  xlsx: xlsIcon,
  json: jsonIcon,
  png: imgIcon,
  jpg: imgIcon,
  jpeg: imgIcon,
  gif: imgIcon,
  mp4: videoIcon,
  mov: videoIcon,
  zip: zipIcon,
};

// ---------------------------
// Document item
// ---------------------------
const DocumentItem = ({ doc }) => {
  const navigate = useNavigate();
  const ext = doc.file_name?.split(".").pop()?.toLowerCase();
  const icon = fileIcons[ext] || docIcon;

  return (
    <div
      onClick={() => navigate(`/documents/${doc.id}`)}
      className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition h-[60px] cursor-pointer"
    >
      <img src={icon} alt="" className="w-7 h-7" />
      <div className="min-w-0">
        <div className="font-medium truncate text-sm">{doc.title}</div>
        <div className="text-xs text-gray-500 truncate">{doc.file_name}</div>
      </div>
    </div>
  );
};

// ---------------------------
// Section wrapper
// ---------------------------
const Section = ({ title, children }) => (
  <div>
    <div className="text-xs font-semibold opacity-60 mb-1">{title}</div>
    <div className="space-y-1">{children}</div>
  </div>
);

export default function SearchPopup({ authUser }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const debounceTimer = useRef(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState({
    users: [],
    groups: [],
    documents: [],
  });

  const { searchUsers } = useUser();
  const { findGroups } = useGroup();
  const { searchDocuments } = useDocument();

  useClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    const q = query.trim();

    if (q.length < 1) {
      setResult({ users: [], groups: [], documents: [] });
      setOpen(false);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        setLoading(true);

        const [usersRes, groupsRes, documentsRes] = await Promise.all([
          searchUsers(q, 5, 1),
          findGroups({ name: q, limit: 5, offset: 0 }),
          searchDocuments(q, 5, 1),
        ]);

        setResult({
          users: Array.isArray(usersRes?.data) ? usersRes.data : usersRes || [],
          groups: Array.isArray(groupsRes) ? groupsRes : groupsRes?.data || [],
          documents: Array.isArray(documentsRes?.data)
            ? documentsRes.data
            : documentsRes || [],
        });

        setOpen(true);
      } catch (err) {
        console.error("Search error:", err);
        setResult({ users: [], groups: [], documents: [] });
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      {/* Search */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Icon Search bên trái */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 pointer-events-none">
          <Search className="w-4 h-4" />
        </span>

        {/* Input */}
        <input
          data-plain
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm dữ liệu..."
          className="
      w-full
      py-1.5
      pl-10
      pr-10
      rounded-lg
      border border-gray-200 dark:border-gray-700
      bg-white dark:bg-gray-800
      text-sm text-gray-900 dark:text-gray-50
      placeholder-gray-400 dark:placeholder-gray-400
      shadow-sm
      focus:outline-none
      focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
      focus:border-transparent
      transition-all duration-200
      hover:shadow-md
    "
        />

        {/* Button xóa/reset */}
        {query && (
          <button
            data-plain
            type="button"
            onClick={() => setQuery("")}
            className="
        absolute right-2 top-1/2 -translate-y-1/2
        w-6 h-6 flex items-center justify-center
        rounded-full
        bg-gray-200 dark:bg-gray-700
        hover:bg-gray-300 dark:hover:bg-gray-600
        text-gray-600 dark:text-gray-300
        transition-colors duration-200
      "
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-3 space-y-3 z-50 max-h-[400px] overflow-y-auto w-[400px] -translate-x-[40px]"
          >
            {loading && (
              <div className="text-sm opacity-60">Đang tìm kiếm...</div>
            )}

            {!loading && (
              <>
                {result.documents.length > 0 && (
                  <Section title="Tài liệu">
                    {result.documents.map((d) => (
                      <DocumentItem key={d.id} doc={d} />
                    ))}
                  </Section>
                )}

                {result.users.length > 0 && (
                  <Section title="Người dùng">
                    {result.users.map((u) => (
                      <UserItem
                        key={u.id}
                        user={u}
                        authUser={authUser}
                        onSelect={() => {
                          navigate(`/profile/${u.id}`);
                          setOpen(false);
                        }}
                      />
                    ))}
                  </Section>
                )}

                {result.groups.length > 0 && (
                  <Section title="Nhóm">
                    {result.groups.map((g) => (
                      <GroupCard
                        key={g.id}
                        group={{
                          ...g,
                          role: g.role || null,
                          access: g.access || "PUBLIC",
                        }}
                        variant="list"
                        onJoin={(groupId, isRestricted) =>
                          console.log("Join group", groupId, isRestricted)
                        }
                        onLeave={(groupId) =>
                          console.log("Leave group", groupId)
                        }
                      />
                    ))}
                  </Section>
                )}

                {result.users.length === 0 &&
                  result.groups.length === 0 &&
                  result.documents.length === 0 && (
                    <div className="text-sm opacity-60">Không có kết quả</div>
                  )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
