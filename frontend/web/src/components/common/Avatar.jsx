import useCloudinaryFile from "@/hooks/useCloudinaryFile";

export default function Avatar({
  url,
  size,                // optional
  fallback = "U",
  show = true,
  className = "",
}) {
  const blobUrl = useCloudinaryFile(show ? url : null);

  const sizeStyle = size
    ? { width: size, height: size }
    : undefined;

  if (!show || !blobUrl) {
    return (
      <div
        style={sizeStyle}
        className={`
          rounded-full bg-gray-300 flex items-center justify-center
          font-bold text-sm shrink-0
          ${className}
        `}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={blobUrl}
      alt="avatar"
      style={sizeStyle}
      className={`
        rounded-full object-cover shrink-0
        ${className}
      `}
    />
  );
}
