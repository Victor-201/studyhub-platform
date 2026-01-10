import express from "express";
import { GroupController } from "../controllers/GroupController.js";
import { verifyAccessToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
import { createGroupRoleMiddleware } from "../middlewares/groupRole.js";
import multer from "multer";

export function createGroupRouter({ groupService }) {
  const router = express.Router();
  const controller = new GroupController({ groupService });
  const role = createGroupRoleMiddleware(groupService);
  const upload = multer();

  router.get(
    "/:group_id/membership",
    controller.checkMembership.bind(controller)
  );

  router.use(verifyAccessToken);

  router.get(
    "/admin/counts",
    requireRole("admin"),
    controller.countGroups.bind(controller)
  );

  router.get(
    "/admin",
    requireRole("admin"),
    controller.getAllGroups.bind(controller)
  );

  router.get("/user/owned", controller.listOwnedGroups.bind(controller));
  router.get("/user/:user_id", controller.listGroupsByUser.bind(controller));
  router.get("/invites/me", controller.listMyInvites.bind(controller));
  router.get("/not-joined", controller.listGroupsNotJoined.bind(controller));

  router.post(
    "/",
    upload.single("avatar"),
    controller.createGroup.bind(controller)
  );

  router.get("/", controller.findGroups.bind(controller));

  router.patch(
    "/requests/:group_id/:request_id/approve",
    role.requireManager,
    controller.approveJoin.bind(controller)
  );

  router.patch(
    "/requests/:group_id/:request_id/reject",
    role.requireManager,
    controller.rejectJoin.bind(controller)
  );

  router.get(
    "/:group_id/requests",
    role.requireManager,
    controller.listJoinRequests.bind(controller)
  );

  router.post("/:group_id/join", controller.joinGroup.bind(controller));

  router.delete(
    "/:group_id/join",
    controller.cancelJoinRequest.bind(controller)
  );

  router.get(
    "/:group_id/check-join",
    controller.isJoinPending.bind(controller)
  );

  router.post(
    "/:group_id/invite",
    role.requireManager,
    controller.inviteMember.bind(controller)
  );

  router.get(
    "/:group_id/logs",
    role.requireMember,
    controller.getActivityLogs.bind(controller)
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

  router.get("/:group_id", controller.getGroupDetail.bind(controller));

  return router;
}
