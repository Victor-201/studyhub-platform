import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Plus, Users } from "lucide-react";

import useGroup from "@/hooks/useGroup";
import GroupCard from "@/components/user/group/GroupCard";
import GroupModal from "@/components/user/group/GroupModal";

export default function Group() {
  const { authUser } = useOutletContext();
  const isLoggedIn = !!authUser?.id;
  const {
    loading,
    groups,
    loadUserGroups,
    getGroupsNotJoined,
    findGroups,
    joinGroup,
    leaveGroup,
  } = useGroup();
  const fetched = useRef(false);

  /* ================= UI STATE ================= */
  const [view, setView] = useState("explore");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editAvatar, setEditAvatar] = useState(false);

  /* ================= DATA STATE ================= */
  const [exploreGroups, setExploreGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  /* ================= INIT LOAD ================= */
  useEffect(() => {
    if (!isLoggedIn || fetched.current) return;
    fetched.current = true;

    const init = async () => {
      await loadUserGroups(authUser.id);
      const explore = await getGroupsNotJoined({ limit: 12 });
      setExploreGroups(explore || []);
    };

    init();
  }, [isLoggedIn, authUser?.id, loadUserGroups, getGroupsNotJoined]);

  /* ================= SEARCH ================= */
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setView("explore");
      setSearchResult([]);
      return;
    }

    setView("search");
    const result = await findGroups({ name: value });
    setSearchResult(result || []);
  };

  /* ================= AFTER SAVE ================= */
  const handleSavedGroup = async () => {
    setView("owned");
    await loadUserGroups(authUser.id);
  };

  const handleJoinGroup = async (groupId, isRestricted) => {
    const joinedGroup = await joinGroup(groupId);
    if (joinedGroup && !isRestricted) {
      setExploreGroups((prev) => prev.filter((g) => g.id !== groupId));
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await leaveGroup(groupId, authUser.id);
    } catch (err) {
      console.error("Leave group error:", err);
    }
  };

  /* ================= DERIVED DATA ================= */
  const ownedGroups = groups.filter((g) => g.role === "OWNER");
  const joinedGroups = groups.filter((g) => g.role && g.role !== "OWNER");

  let title = "";
  let displayGroups = [];

  if (view === "explore") {
    title = "Nhóm gợi ý cho bạn";
    displayGroups = exploreGroups;
  } else if (view === "owned") {
    title = "Nhóm của bạn";
    displayGroups = ownedGroups;
  } else if (view === "joined") {
    title = "Nhóm bạn tham gia";
    displayGroups = joinedGroups;
  } else {
    title = "Kết quả tìm kiếm";
    displayGroups = searchResult;
  }

  /* ================= RENDER ================= */
  return (
    <div className=" container flex bg-[var(--color-background)] dark:bg-[var(--color-brand-700)] max-w-7xl m-auto px-3">
      {/* ================= SIDEBAR ================= */}
      <aside
        className="w-[280px] shrink-0 border-r border-[var(--color-brand-200)]
                        bg-[var(--color-surface)] dark:bg-[var(--color-brand-600)]
                        p-4 flex flex-col gap-5"
      >
        {/* Title */}
        <div className="flex items-center gap-2">
          <Users size={20} />
          <h2 className="text-lg font-bold">Nhóm</h2>
        </div>
        {/* Search */}
        <div className="relative w-full max-w-sm">
          {/* Icon Search bên trái */}
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />

          {/* Input */}
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Tìm nhóm"
            className="
      w-full
      py-2
      pl-12
      pr-10
      rounded-full
      border-2 border-transparent
      bg-white text-gray-800
      shadow-md
      placeholder-gray-400
      focus:outline-none
      focus:border-blue-500
      focus:ring-1 focus:ring-blue-500
      transition-all duration-300
      dark:bg-[var(--color-brand-700)]
      dark:text-[var(--color-brand-50)]
      dark:placeholder-gray-400
    "
          />

          {/* Button xóa/reset */}
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              <X className="w-5 h-5 text-gray-400 dark:text-gray-300" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="space-y-1">
          <NavItem
            label="Khám phá"
            active={view === "explore"}
            onClick={() => {
              setView("explore");
              setSearch("");
            }}
          />

          <NavItem
            label="Nhóm của bạn"
            active={view === "owned"}
            onClick={() => {
              setView("owned");
              setSearch("");
            }}
          />
        </div>

        {/* Create group */}
        <button
          onClick={() => {
            setEditingGroup(null);
            setEditAvatar(false);
            setModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 mt-2"
        >
          <Plus size={16} />
          Tạo nhóm
        </button>

        {/* Joined preview */}
        <div className="pt-4 border-t border-[var(--color-brand-200)] space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">
              Nhóm bạn tham gia
            </p>

            <button
              data-plain
              onClick={() => {
                setView("joined");
                setSearch("");
              }}
              className="text-xs font-medium text-[var(--color-accent)] hover:underline"
            >
              Xem tất cả
            </button>
          </div>
          {joinedGroups.length > 0 ? (
            <div className="space-y-2">
              {joinedGroups.slice(0, 4).map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  authUser={authUser}
                  variant="list"
                  onJoin={(groupId, isRestricted) =>
                    handleJoinGroup(groupId, isRestricted)
                  }
                  onLeave={() => handleLeaveGroup(group.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Bạn chưa tham gia nhóm nào
            </p>
          )}
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6 space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>

        {loading.list && (
          <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
        )}

        {!loading.list && displayGroups.length === 0 && (
          <p className="text-sm text-gray-500">Không có nhóm nào</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayGroups.map((group) => (
            <GroupCard
              authUser={authUser}
              key={group.id}
              group={group}
              onEdit={() => {
                setEditingGroup(group);
                setEditAvatar(false);
                setModalOpen(true);
              }}
              onEditAvatar={() => {
                setEditingGroup(group);
                setEditAvatar(true);
                setModalOpen(true);
              }}
              onJoin={(groupId, isRestricted) =>
                handleJoinGroup(groupId, isRestricted)
              }
              onLeave={() => handleLeaveGroup(group.id)}
            />
          ))}
        </div>
      </main>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <GroupModal
          onClose={() => setModalOpen(false)}
          onSaved={handleSavedGroup}
          groupInfo={editingGroup}
          editAvatar={editAvatar}
        />
      )}
    </div>
  );
}

/* ================= NAV ITEM ================= */
function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition
        ${
          active
            ? "bg-[var(--color-brand-100)] text-[var(--color-primary)]"
            : "hover:bg-[var(--color-brand-50)]"
        }`}
    >
      {label}
    </button>
  );
}
