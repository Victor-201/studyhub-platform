import { useEffect, useState } from "react";

/**
 * Load file từ Cloudinary (image / raw / video)
 * @param {string} fileUrl - FULL Cloudinary URL
 * @returns {string|null} blobUrl
 */
export default function useCloudinaryFile(fileUrl) {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!fileUrl) {
      setBlobUrl(null);
      return;
    }

    let isMounted = true;
    let objectUrl;

    const load = async () => {
      try {
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);

        if (isMounted) setBlobUrl(objectUrl);
      } catch (err) {
        console.error("Cloudinary load error:", err);
        if (isMounted) setBlobUrl(null);
      }
    };

    load();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileUrl]);

  return blobUrl;
}
