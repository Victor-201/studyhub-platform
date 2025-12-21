import { useEffect, useState } from "react";

const getTimeAgo = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  // Vừa xong
  if (diffInSeconds < 60) return "vừa xong";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInDays < 30) return `${diffInWeeks} tuần`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} tháng`;

  return date.toLocaleDateString("vi-VN");
};

const useTimeAgo = (dateString, refreshInterval = 60000) => {
  const [timeAgo, setTimeAgo] = useState(() =>
    getTimeAgo(dateString)
  );

  useEffect(() => {
    if (!dateString) return;

    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(dateString));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [dateString, refreshInterval]);

  return timeAgo;
};

export default useTimeAgo;
