import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({ onSend }) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3">
      <div className="flex items-end gap-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={1}
          placeholder="Type a message…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="
            flex-1
            resize-none
            rounded-lg
            px-3 py-2
            text-sm
            bg-slate-100 dark:bg-slate-900
            focus:outline-none
            focus:ring-2 focus:ring-[var(--color-primary)]
          "
        />

        <button
          onClick={handleSend}
          className="
            p-2 rounded-lg
            bg-[var(--color-primary)]
            text-white
            hover:opacity-90
            transition
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
