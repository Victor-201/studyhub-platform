import express from "express";

/**
 * @param {Object} deps
 * @param {import("../controllers/AdminController.js").AdminController} deps.adminController
 * @param {import("../controllers/ReportController.js").ReportController} deps.reportController
 * @param {Function} deps.verifyAccessToken
 */
export function createAdminRouter({ adminController, reportController, verifyAccessToken }) {
  const router = express.Router();
  router.use(verifyAccessToken);

  router.get("/users", adminController.listUsers.bind(adminController));
  router.post("/users/:userId/lock", adminController.lockUser.bind(adminController));
  router.post("/users/:userId/unlock", adminController.unlockUser.bind(adminController));
  router.post("/users/:userId/block", adminController.blockUser.bind(adminController));
  router.delete("/users/:userId", adminController.softDeleteUser.bind(adminController));
  router.post("/users/:userId/restore", adminController.restoreUser.bind(adminController));
  router.patch("/users/:userId/role", adminController.updateRole.bind(adminController));

  router.get("/audit/logs", reportController.getAllLogs.bind(reportController));
  router.get("/audit/logs/actor/:actorUserId", reportController.getLogsByActor.bind(reportController));
  router.get("/audit/logs/target/:targetUserId", reportController.getLogsByTarget.bind(reportController));

  return router;
}
