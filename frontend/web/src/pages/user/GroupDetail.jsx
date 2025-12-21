import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  Users,
  Shield,
  Globe,
  Crown,
  MoreHorizontal,
  ImagePlus,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import useGroup from "@/hooks/useGroup";
import useClickOutside from "@/hooks/useClickOutside";
import Avatar from "@/components/common/Avatar";
import GroupTabs from "@/components/user/group/GroupTabs";
import GroupMenu from "@/components/user/group/GroupMenu";

// MODALS
import InviteModal from "@/components/user/group/InviteModal";
import TransferModal from "@/components/user/group/TransferModal";
import EditGroupModal from "@/components/user/group/EditGroupModal";

export default function GroupDetail() {
  const { authUser } = useOutletContext();
  const { group_id } = useParams();
  const navigate = useNavigate();

  const {
    currentGroup,
    loadGroup,
    loading,
    joinGroup,
    leaveGroup,
    cancelJoin,
    checkJoinPending,
    deleteGroup,
    inviteMember,
    getGroupMembers,
    transferOwnership,
    updateAvatar,
    updateGroup,
  } = useGroup();

  const [openMenu, setOpenMenu] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [editAvatarModal, setEditAvatarModal] = useState(false);
  const [editInfoModal, setEditInfoModal] = useState(false);

  const [inviteUserId, setInviteUserId] = useState("");
  const [inviting, setInviting] = useState(false);

  const [membersList, setMembersList] = useState([]);
  const [selectedNewOwner, setSelectedNewOwner] = useState("");
  const [transferring, setTransferring] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState(null);

  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setOpenMenu(false));

  // -------------------- LOAD GROUP --------------------
  useEffect(() => {
    if (group_id) loadGroup(group_id);
  }, [group_id]);

  useEffect(() => {
    if (currentGroup) {
      if (!currentGroup.role && currentGroup.access === "RESTRICTED") {
        let mounted = true;
        checkJoinPending(currentGroup.id).then(
          (pending) => mounted && setIsPending(pending)
        );
        return () => (mounted = false);
      }
    }
  }, [currentGroup]);

  useEffect(() => {
    if (transferModal && currentGroup) {
      getGroupMembers(group_id).then((members) =>
        setMembersList(members.filter((m) => m.role !== "OWNER"))
      );
    }
  }, [transferModal]);

  if (loading.detail) return <div className="p-6">Đang tải...</div>;
  if (!currentGroup) return <div className="p-6">Không tìm thấy nhóm</div>;

  const { id, name, avatar_url, description, access, count_member, role } =
    currentGroup;
  const joined = !!role;
  const isOwner = role === "OWNER";
  const isModerator = role === "MODERATOR";
  const isMember = joined && !isOwner && !isModerator;
  const isPublic = access === "PUBLIC";
  const isRestricted = access === "RESTRICTED";

  // -------------------- HANDLERS --------------------
  const handleJoin = async () => {
    try {
      await joinGroup(id);
      setIsPending(true);
      toast.success("Yêu cầu tham gia nhóm đã được gửi");
      await loadGroup(id);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Lỗi khi gửi yêu cầu tham gia nhóm"
      );
    }
  };

  const handleCancelRequest = async () => {
    try {
      await cancelJoin(id);
      setIsPending(false);
      toast.success("Đã hủy yêu cầu tham gia nhóm");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Lỗi khi hủy yêu cầu tham gia nhóm"
      );
    }
  };

  const handleLeave = async () => {
    if (isOwner) return setTransferModal(true);
    try {
      await leaveGroup(id);
      toast.success("Bạn đã rời nhóm thành công");
      navigate("/groups");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi rời nhóm");
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm("Bạn có chắc muốn xóa nhóm này?")) return;
    try {
      await deleteGroup(id);
      toast.success("Nhóm đã được xóa thành công");
      navigate("/groups");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi xóa nhóm");
    }
  };

  // -------------------- RENDER --------------------
  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[var(--color-brand-700)] text-[var(--color-on-background)] dark:text-[var(--color-brand-50)]">
      <Toaster position="top-right" />
      <div className="h-48 bg-[var(--color-primary)] dark:bg-[var(--color-brand-600)]" />

      <div className="max-w-6xl mx-auto px-4 -mt-20">
        {/* HEADER */}
        <div className="bg-[var(--color-surface)] dark:bg-[var(--color-brand-600)] rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6">
          {/* AVATAR */}
          <div className="relative mx-auto w-32 md:w-40 aspect-square flex items-center justify-center">
  <div className="w-full h-full rounded-full overflow-hidden
                  border-4 border-[var(--color-background)] shadow">
    <Avatar
      url={avatar_url}
      fallback={name?.[0]}
      className="w-full h-full object-cover"
    />
  </div>

  {(isOwner || isModerator) && (
    <button
      data-plain
      onClick={() => setEditAvatarModal(true)}
      className="absolute bottom-1 right-1 z-10 p-2
                 bg-[var(--color-accent)] rounded-full
                 hover:bg-[var(--color-brand-400)] hover:shadow"
      title="Chỉnh sửa avatar"
    >
      <ImagePlus size={18} />
    </button>
  )}
</div>

          {/* INFO */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold truncate">{name}</h1>
              {isOwner && (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border">
                  <Crown size={12} /> Chủ nhóm
                </span>
              )}
              {isModerator && !isOwner && (
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-secondary)] text-[var(--color-on-primary)]">
                  Quản trị viên
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm mt-2">
              <div className="flex items-center gap-1">
                {isPublic ? <Globe size={14} /> : <Shield size={14} />}
                {isPublic ? "Công khai" : "Riêng tư"}
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                {count_member} thành viên
              </div>
            </div>

            {description && (
              <p className="mt-4 text-sm max-w-3xl">{description}</p>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-4 flex gap-3 flex-wrap">
              {joined && (
                <button
                  onClick={handleLeave}
                  disabled={loading.action}
                  className="px-5 py-2 text-sm rounded-lg bg-[var(--color-brand-100)] hover:bg-[var(--color-brand-200)] disabled:opacity-50"
                >
                  Rời nhóm
                </button>
              )}

              {!joined && (
                <button
                  onClick={
                    isRestricted
                      ? isPending
                        ? handleCancelRequest
                        : handleJoin
                      : handleJoin
                  }
                  disabled={loading.action}
                  className="px-5 py-2 text-sm rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
                >
                  {isRestricted
                    ? isPending
                      ? "Hủy yêu cầu"
                      : "Gửi yêu cầu"
                    : "Tham gia nhóm"}
                </button>
              )}

              {(isOwner || isModerator || isMember) && (
                <button
                  onClick={() => setInviteModal(true)}
                  className="px-5 py-2 text-sm rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-brand-400)]"
                >
                  Mời
                </button>
              )}

              <div ref={menuRef} className="relative">
                <button
                  data-plain
                  onClick={() => setOpenMenu(!openMenu)}
                  className="p-2 rounded-lg hover:bg-[var(--color-brand-50)] dark:hover:bg-[var(--color-brand-600)]"
                >
                  <MoreHorizontal size={18} />
                </button>
                {openMenu && (
                  <GroupMenu
                    role={role}
                    isOwner={isOwner}
                    handleDeleteGroup={handleDeleteGroup}
                    openEditInfo={() => setEditInfoModal(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-6">
          <GroupTabs group={currentGroup} authUser={authUser} />
        </div>
      </div>

      {/* -------------------- MODALS -------------------- */}
      <InviteModal
        isOpen={inviteModal}
        onClose={() => setInviteModal(false)}
        inviteUserId={inviteUserId}
        setInviteUserId={setInviteUserId}
        inviting={inviting}
        handleInvite={async () => {
          setInviting(true);
          try {
            await inviteMember(currentGroup.id, inviteUserId);
            setInviteUserId("");
            setInviteModal(false);
            toast.success("Đã gửi lời mời thành công");
          } catch (err) {
            toast.error(err?.response?.data?.message || "Lỗi khi gửi lời mời");
          } finally {
            setInviting(false);
          }
        }}
      />

      <TransferModal
        isOpen={transferModal}
        onClose={() => setTransferModal(false)}
        membersList={membersList}
        selectedNewOwner={selectedNewOwner}
        setSelectedNewOwner={setSelectedNewOwner}
        transferring={transferring}
        handleTransferOwnership={async () => {
          setTransferring(true);
          try {
            await transferOwnership(currentGroup.id, selectedNewOwner);
            await leaveGroup(currentGroup.id);
            setTransferModal(false);
            toast.success("Đã chuyển quyền và rời nhóm thành công");
            navigate("/groups");
          } catch (err) {
            toast.error(err?.response?.data?.message || "Lỗi khi chuyển quyền");
          } finally {
            setTransferring(false);
          }
        }}
      />

      <EditGroupModal
        isOpen={editAvatarModal || editInfoModal}
        onClose={() => {
          setEditAvatarModal(false);
          setEditInfoModal(false);
        }}
        editAvatar={editAvatarModal}
        groupInfo={currentGroup}
        newAvatarFile={newAvatarFile}
        setNewAvatarFile={setNewAvatarFile}
        handleUpdateAvatar={async () => {
          if (!newAvatarFile) return;
          const formData = new FormData();
          formData.append("avatar", newAvatarFile);
          try {
            await updateAvatar(currentGroup.id, formData);
            toast.success("Cập nhật avatar thành công");
            setEditAvatarModal(false);
            setNewAvatarFile(null);
            await loadGroup(currentGroup.id);
          } catch (err) {
            toast.error(
              err?.response?.data?.message || "Lỗi khi cập nhật avatar"
            );
          }
        }}
        handleUpdateGroupInfo={async (info) => {
          try {
            await updateGroup(currentGroup.id, info);
            toast.success("Cập nhật thông tin nhóm thành công");
            setEditInfoModal(false);
            await loadGroup(currentGroup.id);
          } catch (err) {
            toast.error(
              err?.response?.data?.message || "Lỗi khi cập nhật thông tin nhóm"
            );
          }
        }}
      />
    </div>
  );
}
