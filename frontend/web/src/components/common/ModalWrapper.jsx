import { useRef } from "react";
import { X } from "lucide-react";

export default function ModalWrapper({ isOpen, title, onClose, children }) {
  const modalRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-[var(--color-surface)] dark:bg-[var(--color-brand-600)] rounded-xl shadow-lg p-6 relative"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
 