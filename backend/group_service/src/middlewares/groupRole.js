import { createError } from "../utils/helper.js";

export function createGroupRoleMiddleware(groupService) {
  const getGroupId = (req) => req.params.group_id || req.params.id;
  const getUserId = (req) => {
    if (!req.user?.id) throw createError("Unauthorized", 401);
    return req.user.id;
  };

  const checkMembership = async (req) => {
    const { group } = await groupService.checkMembership(
      getGroupId(req),
      getUserId(req)
    );
    if (!group || !group.role) {
      throw createError("You are not a member of this group", 403);
    }
    return group;
  };

  return {
    requireMember: async (req, res, next) => {
      try {
        const group = await checkMembership(req);
        req.membership = { group, role: group.role };
        next();
      } catch (e) {
        res.status(e.status || 403).json({ message: e.message });
      }
    },

    requireOwner: async (req, res, next) => {
      try {
        const group = await checkMembership(req);
        if (group.role !== "OWNER") throw createError("Owner only", 403);
        req.membership = { group, role: group.role };
        next();
      } catch (e) {
        res.status(e.status || 403).json({ message: e.message });
      }
    },

    requireManager: async (req, res, next) => {
      try {
        const group = await checkMembership(req);
        if (!["OWNER", "MODERATOR"].includes(group.role)) {
          throw createError("Manager only", 403);
        }
        req.membership = { group, role: group.role };
        next();
      } catch (e) {
        res.status(e.status || 403).json({ message: e.message });
      }
    },
  };
}
