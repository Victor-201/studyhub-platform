// components/group/LogItem.jsx
import { Trash, PlusCircle, Edit2, Users, Info } from "lucide-react";

export default function LogItem({ log }) {
  const getIcon = (action) => {
    switch (action) {
      case "CREATE_GROUP":
        return <Users className="w-5 h-5 text-green-500" />;
      case "UPDATE_GROUP":
        return <Edit2 className="w-5 h-5 text-yellow-500" />;
      case "DELETE_GROUP":
        return <Trash className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500 dark:text-gray-300" />;
    }
  };

  const formattedTime = new Date(log.created_at).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className="flex items-start gap-3 p-2 rounded hover:bg-[var(--color-brand-100)] dark:hover:bg-[var(--color-brand-700)]">
      <div className="mt-1">{getIcon(log.action)}</div>
      <div className="flex-1 text-sm text-[var(--color-on-surface)] dark:text-[var(--color-brand-50)]">
        <p className="font-medium">{log.action.replaceAll("_", " ")}</p>
        <span className="text-xs text-[var(--color-on-surface-variant)] dark:text-[var(--color-brand-300)]">
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
