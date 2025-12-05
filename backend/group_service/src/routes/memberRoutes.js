import express from "express";
import { MemberController } from "../controllers/MemberController.js";
import { verifyAccessToken } from "../middlewares/auth.js";

/**
 * @param {Object} deps
 * @param {import("../services/MemberService.js").MemberService} deps.memberService
 */
export function createMemberRouter({ memberService }) {
  const router = express.Router();
  const controller = new MemberController({ memberService });

  // --- Auth ---
  router.use(verifyAccessToken);

  // =========================
  //    MEMBER OPERATIONS
  // =========================
  router.get(
    "/group/:group_id",
    controller.getGroupMembers.bind(controller)
  );

  router.get(
    "/user",
    controller.getUserGroups.bind(controller)
  );

  router.delete(
    "/:group_id/user/:user_id",
    controller.removeMember.bind(controller)
  );

  router.patch(
    "/:group_id/user/:user_id/role",
    controller.changeMemberRole.bind(controller)
  );

  return router;
}
