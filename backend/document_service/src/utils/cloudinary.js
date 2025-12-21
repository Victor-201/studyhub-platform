import cloudinary from "cloudinary";
import { env } from "../config/env.js";

cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export function uploadToCloudinary(buffer, options = {}) {
  const { public_id, filename } = options;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "documents",
        public_id,
        use_filename: true,
        unique_filename: false,
        filename_override: filename,
        access_mode: "public",
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export function getExtensionFromUrl(url = "") {
  const clean = url.split("?")[0];
  const parts = clean.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

export function buildPreviewUrl(doc) {
  if (!doc?.storage_path) return null;

  const url = doc.storage_path;
  const ext = getExtensionFromUrl(url);

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return url;
  if (["mp4", "webm", "mov"].includes(ext)) return url;

  if (ext === "pdf") {
    return url.replace("/raw/upload/", "/image/upload/");
  }

  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(
      url
    )}&embedded=true`;
  }

  return null;
}

export function buildDownloadUrl(doc) {
  return doc?.storage_path || null;
}
