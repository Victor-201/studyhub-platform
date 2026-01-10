import express from "express";
import { verifyAccessToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import { DocumentInteractionsController } from "../controllers/DocumentInteractionsController.js";

/**
 * @param {Object} deps
 * @param {import("../services/DocumentInteractionsService.js").DocumentInteractionsService} deps.documentInteractionsService
 */
export function createDocumentInteractionsRouter({
  documentInteractionsService,
}) {
  const router = express.Router();
  const controller = new DocumentInteractionsController({
    interactionsService: documentInteractionsService,
  });

  // --- Auth ---
  router.use(verifyAccessToken);

  // =========================
  //        INTERACTIONS
  // =========================
  router.get("/:id/bookmark", controller.isBookmarked.bind(controller));

  router.post("/:id/bookmark", controller.toggleBookmark.bind(controller));

  router.post("/:id/comments", controller.addComment.bind(controller));

  router.delete(
    "/comments/:comment_id",
    controller.deleteComment.bind(controller)
  );

  router.get("/:id/download", controller.recordDownload.bind(controller));

  router.post("/:id/approve", controller.approveDocument.bind(controller));

  router.post("/:id/reject", controller.rejectDocument.bind(controller));

  return router;
}
