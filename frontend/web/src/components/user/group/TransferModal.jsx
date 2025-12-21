import ModalWrapper from "../../common/ModalWrapper";

export default function TransferModal({
  isOpen,
  onClose,
  membersList,
  selectedNewOwner,
  setSelectedNewOwner,
  handleTransferOwnership,
  transferring,
}) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      title="Chuyển quyền trước khi rời nhóm"
      onClose={onClose}
    >
      <select
        className="w-full px-4 py-2 border rounded-lg"
        value={selectedNewOwner}
        onChange={(e) => setSelectedNewOwner(e.target.value)}
      >
        <option value="">Chọn thành viên</option>
        {membersList.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name} ({m.role})
          </option>
        ))}
      </select>
      <button
        onClick={handleTransferOwnership}
        disabled={transferring}
        className="w-full mt-2 px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600"
      >
        {transferring ? "Đang chuyển..." : "Chuyển quyền và rời nhóm"}
      </button>
    </ModalWrapper>
  );
}
