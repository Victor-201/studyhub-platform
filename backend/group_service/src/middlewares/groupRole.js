import { createError } from "../utils/helper.js";

export function createGroupRoleMiddleware(groupService) {
  const getGroupId = req => req.params.group_id || req.params.id;
  const getUserId = req => {
    if (!req.user?.id) throw createError("Unauthorized", 401);
    return req.user.id;
  };

  return {
    requireMember: async (req, res, next) => {
      try {
        const { group, role } = await groupService.checkMembership(
          getGroupId(req),
          getUserId(req)
        );
        req.membership = { group, role };
        next();
      } catch (e) {
        res.status(e.status || 403).json({ message: e.message });
      }
    },

    requireOwner: async (req, res, next) => {
      try {
        const { role } = await groupService.checkMembership(
          getGroupId(req),
          getUserId(req)
        );
        if (role !== "OWNER") throw createError("Owner only", 403);
        next();
      } catch (e) {
        res.status(e.status || 403).json({ message: e.message });
      }
    },

    requireManager: async (req, res, next) => {
      try {
        const { role } = await groupService.checkMembership(
          getGroupId(req),
          getUserId(req)
        );
        if (!["OWNER", "MODERATOR"].includes(role)) {
          throw createError("Manager only", 403);
        }
        next();
      } catch (e) {
        res.status(e.status || 403).json({ message: e.message });
      }
    },
  };
}
