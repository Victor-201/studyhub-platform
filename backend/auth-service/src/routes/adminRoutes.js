import express from "express";
import { requireRole } from "../middlewares/role.js";
export function createAdminRouter(AdminController, ReportController, verifyAccessToken) {
  const router = express.Router();
  router.use(verifyAccessToken, requireRole("admin"));

  router.get("/users", (req, res) => AdminController.listUsers(req, res));
  router.put("/users/:id/lock", (req, res) => AdminController.lockUser(req, res));
  router.put("/users/:id/unlock", (req, res) => AdminController.unlockUser(req, res));
  router.delete("/users/:id", (req, res) => AdminController.softDeleteUser(req, res));
  router.put("/users/:id/restore", (req, res) => AdminController.restoreUser(req, res));
  router.put("/users/:id/role", (req, res) => AdminController.updateRole(req, res));
  router.put("/users/:id/block", (req, res) => AdminController.blockUser(req, res));
  router.get("/reports/summary", (req, res) => ReportController.summaryReport(req, res));
  router.get("/reports/export", (req, res) => ReportController.exportReport(req, res));

  return router;
}
