import { v4 as uuidv4 } from "uuid";
import { createError } from "../utils/helper.js";

export class MemberService {
  constructor({ memberRepo, activityRepo }) {
    this.memberRepo = memberRepo;
    this.activityRepo = activityRepo;
  }

  // =========================
  // GET MEMBERS OF A GROUP
  // =========================
  async getMembersByGroup(group_id) {
    return this.memberRepo.getMembers(group_id);
  }

  // =========================
  // GET GROUPS USER BELONGS TO
  // =========================
  async getUserGroups(user_id) {
    return this.memberRepo.getGroupsByUser(user_id);
  }

  // =========================
  // REMOVE MEMBER
  // =========================
  async removeMember(group_id, user_id, actor_id) {
    const existed = await this.memberRepo.getMember(group_id, user_id);
    if (!existed) throw createError("Member not found", 404);

    await this.memberRepo.removeMember(group_id, user_id);

    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id,
      actor_id,
      target_id: user_id,
      action: "REMOVE_MEMBER",
    });

    return true;
  }

  // =========================
  // CHANGE ROLE
  // =========================
  async changeMemberRole(group_id, user_id, role, actor_id) {
    const member = await this.memberRepo.getMember(group_id, user_id);
    if (!member) throw createError("Member not found", 404);

    const updated = await this.memberRepo.updateMemberRole(group_id, user_id, role);

    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id,
      actor_id,
      target_id: user_id,
      action: "CHANGE_ROLE",
    });

    return updated;
  }
}
