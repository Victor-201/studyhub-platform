import cloudinary from "cloudinary";
import { env } from "../config/env.js";

cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Upload ANY file (pdf, docx, pptx, xlsx, zip...)
 * @param {Buffer} buffer
 * @param {Object} options
 */
export function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "raw",
        use_filename: true,
        unique_filename: false,
        filename_override: options.filename, // tên đầy đủ: document_UUID.ext
        public_id: options.public_id,        // document_UUID (không đuôi)
        format: options.extension,           // pdf/docx/pptx
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete file by public_id
 */
export function deleteFromCloudinary(public_id) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(
      public_id,
      { resource_type: "raw" },
      (err, res) => {
        if (err) reject(err);
        else resolve(res);
      }
    );
  });
}
