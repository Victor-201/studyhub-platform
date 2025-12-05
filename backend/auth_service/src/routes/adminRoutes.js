import express from "express";
import { AdminController } from "../controllers/AdminController.js";
import { verifyAccessToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";

export function createAdminRouter({ adminService }) {
  const router = express.Router();
  const controller = new AdminController({ adminService });

  router.use(verifyAccessToken, requireRole("admin"));

  router.get("/users", controller.listUsers.bind(controller));
  router.post("/users/:userId/lock", controller.lockUser.bind(controller));
  router.post("/users/:userId/unlock", controller.unlockUser.bind(controller));
  router.post("/users/:userId/block", controller.blockUser.bind(controller));
  router.delete("/users/:userId", controller.softDeleteUser.bind(controller));
  router.post("/users/:userId/restore", controller.restoreUser.bind(controller));
  router.patch("/users/:userId/role", controller.updateRole.bind(controller));

  router.get("/audit/logs", controller.getAuditLogs.bind(controller));
  router.get("/audit/logs/actor/:actorUserId", controller.getAuditLogsByActor.bind(controller));
  router.get("/audit/logs/target/:targetUserId", controller.getAuditLogsByTarget.bind(controller));

  return router;
}
