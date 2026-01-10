export function formatDateTime(value) {
  if (!value) return null;

  const date = new Date(value);
  if (isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type) =>
    parts.find((p) => p.type === type)?.value || "";

  return {
    date: `${get("day")}/${get("month")}/${get("year")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}
