import express from "express";
import { verifyAccessToken } from "../middlewares/auth.js";
import { DocumentInteractionsController } from "../controllers/DocumentInteractionsController.js";

/**
 * @param {Object} deps
 * @param {import("../services/DocumentInteractionsService.js").DocumentInteractionsService} deps.documentInteractionsService
 */
export function createDocumentInteractionsRouter({ documentInteractionsService }) {
  const router = express.Router();
  const controller = new DocumentInteractionsController({ documentInteractionsService });

  // --- Auth ---
  router.use(verifyAccessToken);

  // =========================
  //        INTERACTIONS
  // =========================

  router.post("/:id/bookmark", controller.toggleBookmark.bind(controller));

  router.post("/:id/comments", controller.addComment.bind(controller));

  router.delete(
    "/comments/:comment_id",
    controller.deleteComment.bind(controller)
  );

  router.post("/:id/download", controller.recordDownload.bind(controller));

  router.get("/:id/stats", controller.stats.bind(controller));

  return router;
}
