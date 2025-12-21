import { v4 as uuidv4 } from "uuid";
import { createError } from "../utils/helper.js";

export class MemberService {
  constructor({ memberRepo, activityRepo }) {
    this.memberRepo = memberRepo;
    this.activityRepo = activityRepo;
  }

  async listMembers(group_id, role, paging) {
    return this.memberRepo.list(group_id, role, paging);
  }

  async leaveGroup(group_id, user_id) {
    const member = await this.memberRepo.getMember(group_id, user_id);
    if (!member) throw createError("Not a member", 403);
    if (member.role === "OWNER")
      throw createError("Owner must transfer ownership before leaving", 400);

    await this.memberRepo.removeMember(group_id, user_id);
    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id,
      actor_id: user_id,
      action: "LEAVE_GROUP",
    });
    return true;
  }

  async kickMember(group_id, target_id, actor_id) {
    const member = await this.memberRepo.getMember(group_id, target_id);
    if (!member) throw createError("Member not found", 404);
    if (member.role === "OWNER") throw createError("Cannot remove owner", 400);

    const actor = await this.memberRepo.getMember(group_id, actor_id);
    if (!actor || !["OWNER", "MODERATOR"].includes(actor.role))
      throw createError("No permission to kick", 403);

    await this.memberRepo.removeMember(group_id, target_id);
    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id,
      actor_id,
      target_id,
      action: "KICK_MEMBER",
    });
    return true;
  }

  async changeRole(group_id, target_id, role, actor_id) {
    const member = await this.memberRepo.getMember(group_id, target_id);
    if (!member) throw createError("Member not found", 404);

    const updated = await this.memberRepo.updateRole(group_id, target_id, role);
    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id,
      actor_id,
      target_id,
      action: "CHANGE_ROLE",
    });
    return updated;
  }
}
