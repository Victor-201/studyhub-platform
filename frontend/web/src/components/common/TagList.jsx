export default function TagList({ tags = [], max = 3, size = "sm" }) {
  if (!tags || tags.length === 0) return null;

  const shownTags = tags.slice(0, max);
  const remain = tags.length - shownTags.length;

  const sizeClass =
    size === "xs" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <div className="flex flex-wrap gap-1.5">
      {shownTags.map((tag) => (
        <span
          key={tag}
          className={`${sizeClass} bg-gray-100 text-gray-600 rounded-full leading-none`}
        >
          #{tag}
        </span>
      ))}

      {remain > 0 && (
        <span
          className={`
            ${sizeClass}
            bg-gray-50 text-gray-400
            rounded-full
          `}
        >
          +{remain}
        </span>
      )}
    </div>
  );
}
