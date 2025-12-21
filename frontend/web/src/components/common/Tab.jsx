export default function Tab({
  label,
  value,
  activeTab,
  onChange,
  disabled = false,
}) {
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      data-plain
      disabled={disabled}
      onClick={() => !disabled && onChange(value)}
      className={`
        pb-2 text-sm font-semibold transition
        ${isActive
          ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
          : "text-gray-500 hover:text-[var(--color-accent)]"
        }
        ${disabled && "opacity-50 cursor-not-allowed"}
      `}
    >
      {label}
    </button>
  );
}
