import express from "express";
import { GroupController } from "../controllers/GroupController.js";
import { verifyAccessToken } from "../middlewares/auth.js";
import { createGroupRoleMiddleware } from "../middlewares/groupRole.js";

/**
 * @param {Object} deps
 * @param {import("../services/GroupService.js").GroupService} deps.groupService
 */
export function createGroupRouter({ groupService }) {
  const router = express.Router();
  const controller = new GroupController({ groupService });
  const role = createGroupRoleMiddleware(groupService);

    // =========================
  //   CHECK MEMBERSHIP
  // =========================
  router.get(
    "/:group_id/membership",
    controller.checkMembership.bind(controller)
  );
  
  // --- Auth ---
  router.use(verifyAccessToken);

  // =========================
  //        GROUP CRUD
  // =========================
  router.post("/", controller.createGroup.bind(controller));

  router.put(
    "/:id",
    role.requireManager, // manager + owner
    controller.updateGroup.bind(controller)
  );

  router.delete(
    "/:id",
    role.requireOwner, // chỉ owner
    controller.deleteGroup.bind(controller)
  );

  router.put(
    "/:id/avatar",
    role.requireManager,
    controller.updateAvatar.bind(controller)
  );

  // =========================
  //      JOIN REQUESTS
  // =========================
  router.post(
    "/:group_id/join",
    controller.requestJoin.bind(controller)
  );

  router.get(
    "/:group_id/join-requests",
    role.requireManager,
    controller.getPendingRequests.bind(controller)
  );

  router.patch(
    "/requests/:request_id/approve",
    role.requireManager,
    controller.approveJoin.bind(controller)
  );

  router.patch(
    "/requests/:request_id/reject",
    role.requireManager,
    controller.rejectJoin.bind(controller)
  );

  // =========================
  //      ACTIVITY LOGS
  // =========================
  router.get(
    "/:id/logs",
    role.requireManager,
    controller.getActivityLogs.bind(controller)
  );


  return router;
}
