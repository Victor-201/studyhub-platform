import ModalWrapper from "../../common/ModalWrapper";

export default function InviteModal({
  isOpen,
  onClose,
  inviteUserId,
  setInviteUserId,
  handleInvite,
  inviting,
}) {
  return (
    <ModalWrapper isOpen={isOpen} title="Mời thành viên" onClose={onClose}>
      <input
        type="text"
        value={inviteUserId}
        onChange={(e) => setInviteUserId(e.target.value)}
        placeholder="Nhập ID người dùng"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <button
        onClick={handleInvite}
        disabled={inviting}
        className="w-full mt-2 px-4 py-2 bg-[var(--color-accent)] rounded hover:bg-[var(--color-brand-400)]"
      >
        {inviting ? "Đang gửi..." : "Gửi lời mời"}
      </button>
    </ModalWrapper>
  );
}
