import express from "express";
import { AdminController } from "../controllers/AdminController.js";
import { verifyAccessToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";

export function createAdminRouter({ adminService }) {
  const router = express.Router();
  const controller = new AdminController({ adminService });

  router.use(verifyAccessToken, requireRole("admin"));

  router.get("/users", controller.listUsers.bind(controller));
  router.get("/count/accounts", controller.countAccounts.bind(controller));
  router.post("/users/:user_id/lock", controller.lockUser.bind(controller));
  router.post("/users/:user_id/unlock", controller.unlockUser.bind(controller));
  router.get("/users/:user_id/is_blocked", controller.isUserBlocked.bind(controller));
  router.post("/users/:user_id/block", controller.permanentBlockUser.bind(controller));
  router.post("/users/:user_id/block", controller.temporaryBlockUser.bind(controller));
  router.post("/users/:user_id/unblock", controller.unblockUser.bind(controller));
  router.delete("/users/:user_id", controller.softDeleteUser.bind(controller));
  router.post("/users/:user_id/restore", controller.restoreUser.bind(controller));
  router.patch("/users/:user_id/role", controller.updateRole.bind(controller));

  router.get("/audit/logs", controller.getAuditLogs.bind(controller));
  router.get("/audit/logs/actor/:actor_user_id", controller.getAuditLogsByActor.bind(controller));
  router.get("/audit/logs/target/:target_user_id", controller.getAuditLogsByTarget.bind(controller));

  return router;
}
