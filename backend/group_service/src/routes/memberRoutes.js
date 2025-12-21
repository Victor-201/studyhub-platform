import express from "express";
import { MemberController } from "../controllers/MemberController.js";
import { verifyAccessToken } from "../middlewares/auth.js";
import { createGroupRoleMiddleware } from "../middlewares/groupRole.js";

/**
 * @param {Object} deps
 * @param {import("../services/MemberService.js").MemberService} deps.memberService
 * @param {import("../services/GroupService.js").GroupService} deps.groupService
 */
export function createMemberRouter({ memberService, groupService }) {
  const router = express.Router();
  const controller = new MemberController({ memberService });
  const role = createGroupRoleMiddleware(groupService);

  // ---- AUTH REQUIRED ----
  router.use(verifyAccessToken);

  // ---- MEMBER LIST ----
  router.get("/group/:group_id", role.requireMember, controller.listMembers.bind(controller));

  // ---- MEMBER ACTIONS ----
  router.delete("/:group_id/leave", controller.leaveGroup.bind(controller));
  router.delete("/:group_id/user/:user_id", role.requireManager, controller.kickMember.bind(controller));
  router.patch("/:group_id/user/:user_id/role", role.requireManager, controller.changeRole.bind(controller));
  router.patch("/:group_id/transfer/:new_owner_id", role.requireOwner, controller.transferOwnership.bind(controller));

  return router;
}
