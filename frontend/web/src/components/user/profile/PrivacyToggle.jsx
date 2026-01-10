export default function PrivacyToggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>

      <button
        type="button"
        data-plain
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-7 w-12 items-center
          rounded-full transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-[var(--color-primary)]
          ${
            checked
              ? "bg-[var(--color-primary)]"
              : "bg-gray-300 dark:bg-gray-600"
          }
        `}
      >
        {/* Knob */}
        <span
          className={`
            inline-block h-5 w-5 rounded-full bg-white shadow-md
            transform transition-all duration-300
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}
