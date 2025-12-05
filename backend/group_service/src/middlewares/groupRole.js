// middlewares/groupRole.js
import {createError} from "../utils/helper.js";

/**
 * @param {import("../services/GroupService.js").GroupService} groupService
 */
export function createGroupRoleMiddleware(groupService) {
  // Hàm helper lấy group_id từ params
  function extractGroupId(req) {
    return req.params.group_id || req.params.id;
  }

  // Hàm helper lấy user_id từ token
  function extractUserId(req) {
    if (!req.user || !req.user.id) {
      throw createError("Invalid token payload: user_id missing", 401);
    }
    return req.user.id;
  }

  return {
    /** USER MUST BE MEMBER */
    requireMember: async (req, res, next) => {
      try {
        const user_id = extractUserId(req);
        const group_id = extractGroupId(req);

        const { group, role } = await groupService.checkMembership(
          group_id,
          user_id
        );

        req.membership = { group, role };
        next();
      } catch (err) {
        return res
          .status(err.status || 403)
          .json({ success: false, message: err.message });
      }
    },

    /** ONLY OWNER */
    requireOwner: async (req, res, next) => {
      try {
        const user_id = extractUserId(req);
        const group_id = extractGroupId(req);

        const { group, role } = await groupService.checkMembership(
          group_id,
          user_id
        );

        if (role !== "owner") {
          throw createError("Owner permission required", 403);
        }

        req.membership = { group, role };
        next();
      } catch (err) {
        return res
          .status(err.status || 403)
          .json({ success: false, message: err.message });
      }
    },

    /** OWNER + ADMIN + MOD */
    requireManager: async (req, res, next) => {
      try {
        const user_id = extractUserId(req);
        const group_id = extractGroupId(req);

        const { group, role } = await groupService.checkMembership(
          group_id,
          user_id
        );

        const allowed = ["owner", "admin", "mod"];
        if (!allowed.includes(role)) {
          throw createError("Manager permission required", 403);
        }

        req.membership = { group, role };
        next();
      } catch (err) {
        return res
          .status(err.status || 403)
          .json({ success: false, message: err.message });
      }
    },
  };
}
