import express from "express";
import { GroupController } from "../controllers/GroupController.js";
import { verifyAccessToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import { createGroupRoleMiddleware } from "../middlewares/groupRole.js";
import multer from "multer";
/**
 * @param {Object} deps
 * @param {import("../services/GroupService.js").GroupService} deps.groupService
 */
export function createGroupRouter({ groupService }) {
  const router = express.Router();
  const controller = new GroupController({ groupService });
  const role = createGroupRoleMiddleware(groupService);
  const upload = multer();

  // ---- PUBLIC: CHECK MEMBERSHIP ----
  router.get(
    "/:group_id/membership",
    controller.checkMembership.bind(controller)
  );

  // ---- AUTH REQUIRED ----
  router.use(verifyAccessToken);

  // ---- GROUP ----
  router.post(
    "/",
    upload.single("avatar"),
    controller.createGroup.bind(controller)
  );

  router.patch(
    "/:group_id/avatar",
    role.requireManager,
    upload.single("avatar"),
    controller.updateAvatar.bind(controller)
  );
  router.patch(
    "/:group_id",
    role.requireManager,
    controller.updateGroup.bind(controller)
  );
  router.delete(
    "/:group_id",
    role.requireOwner,
    controller.deleteGroup.bind(controller)
  );

  // ---- JOIN GROUP / REQUEST ----
  router.post("/:group_id/join", controller.joinGroup.bind(controller));
  router.delete(
    "/:group_id/join",
    controller.cancelJoinRequest.bind(controller)
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
  router.get(
    "/:group_id/check-join",
    controller.isJoinPending.bind(controller)
  );

  // ---- INVITE ----
  router.post(
    "/:group_id/invite",
    role.requireManager,
    controller.inviteMember.bind(controller)
  );

  // ---- LIST GROUPS ----
  router.get("/user/:user_id", controller.listGroupsByUser.bind(controller));
  router.get("/user/owned", controller.listOwnedGroups.bind(controller));
  router.get("/not-joined", controller.listGroupsNotJoined.bind(controller));
  router.get("/", controller.findGroups.bind(controller));

  // ---- ADMIN ----
  router.get(
    "/admin/counts",
    requireRole("admin"),
    controller.countGroups.bind(controller)
  );
  router.get(
    "/admin/group",
    requireRole("admin"),
    controller.getAllGroups.bind(controller)
  );

  // ---- GROUP DETAIL ----
  router.get("/:group_id", controller.getGroupDetail.bind(controller));

  // ---- ACTIVITY LOGS ----
  router.get(
    "/:group_id/logs",
    role.requireMember,
    controller.getActivityLogs.bind(controller)
  );

  return router;
}
