import express from "express";
import multer from "multer";
import { verifyAccessToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import { DocumentController } from "../controllers/DocumentController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

/**
 * @param {Object} deps
 * @param {import("../services/DocumentService.js").DocumentService} deps.documentService
 */
export function createDocumentRouter({ documentService }) {
  const router = express.Router();
  const controller = new DocumentController({ documentService });

  router.get("/feed/public", controller.getPublicFeed.bind(controller));

  router.get("/tags", controller.getAllTags.bind(controller));

  router.use(verifyAccessToken);

  router.get("/search", controller.search.bind(controller));

  router.post(
    "/",
    upload.single("file"),
    controller.createDocument.bind(controller)
  );

  router.get("/feed/home", controller.getHomeFeed.bind(controller));

  router.get("/me", controller.getMyDocuments.bind(controller));

  router.get(
    "/admin/approved",
    requireRole("admin"),
    controller.getApprovedDocuments.bind(controller)
  );

  router.get(
    "/admin/countDocuments",
    requireRole("admin"),
    controller.countDocuments.bind(controller)
  );

  router.get(
    "/admin/countComments",
    requireRole("admin"),
    controller.countComments.bind(controller)
  );

  router.get(
    "/admin/comments",
    requireRole("admin"),
    controller.getAllComments.bind(controller)
  );

  router.get(
    "/:id/comments",
    controller.getCommentsByDocument.bind(controller)
  );

  router.get(
    "/group/:group_id/approved",
    controller.getGroupApproved.bind(controller)
  );

  router.get(
    "/group/:group_id/pending",
    controller.getGroupPending.bind(controller)
  );

  // --- NEW: Public profile documents ---
  router.get(
    "/user/:user_id/public",
    controller.getUserPublicDocuments.bind(controller)
  );

  router.get("/:id", controller.getDocument.bind(controller));

  router.get("/:id/preview", controller.getDocumentPreviewUrl.bind(controller));

  router.patch("/:id", controller.updateDocument.bind(controller));

  router.delete("/:id", controller.deleteDocument.bind(controller));

  return router;
}
