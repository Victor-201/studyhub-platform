import { v4 as uuidv4 } from "uuid";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { publishEvent } from "../core/events/publish.js";
import { RMQ_ROUTING_KEYS } from "../core/events/queues.js";
import { fileTypeFromBuffer } from "file-type";
import { createError } from "../utils/helper.js";

export class GroupService {
  constructor({ groupRepo, memberRepo, joinRepo, activityRepo }) {
    this.groupRepo = groupRepo;
    this.memberRepo = memberRepo;
    this.joinRepo = joinRepo;
    this.activityRepo = activityRepo;
  }

  async createGroup({
    name,
    description,
    access = "PUBLIC",
    user_id,
    auto_approve_docs = false,
    file = null,
    folder = "avatars",
  }) {
    const group_id = uuidv4();
    let avatar_url = null;

    if (file?.buffer) {
      const type = await fileTypeFromBuffer(file.buffer);
      const allowed = ["jpg", "jpeg", "png", "webp"];
      if (!type || !allowed.includes(type.ext))
        throw createError("Invalid image type");

      const uploaded = await uploadToCloudinary(file.buffer, {
        folder,
        public_id: `group_${group_id}`,
        overwrite: true,
      });
      avatar_url = uploaded.secure_url;
    }

    const group = await this.groupRepo.createGroup({
      id: group_id,
      name,
      description: description || null,
      access,
      avatar_url,
      auto_approve_docs,
    });

    await this.memberRepo.addMember({ group_id, user_id, role: "OWNER" });

    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id,
      actor_id: user_id,
      action: "CREATE_GROUP",
    });

    await publishEvent(RMQ_ROUTING_KEYS.GROUP.CREATED, { group_id, user_id });
    return group;
  }

  async checkMembership(group_id, user_id) {
    const group = await this.groupRepo.getGroupById(group_id, user_id);
    if (!group) throw createError("Group not found", 404);
    return { group };
  }

  async checkAccess(group_id, user_id) {
    const member = await this.memberRepo.getMember(group_id, user_id);
    if (!member) throw createError("Not a member", 403);
    return member.role;
  }

  async updateGroup(group_id, data) {
    return this.groupRepo.updateGroup(group_id, data);
  }

  async updateAvatar(group_id, file) {
    if (!file?.buffer) throw createError("No avatar uploaded");

    const type = await fileTypeFromBuffer(file.buffer);
    const allowed = ["jpg", "jpeg", "png", "webp"];
    if (!type || !allowed.includes(type.ext))
      throw createError("Invalid image type");

    const uploaded = await uploadToCloudinary(file.buffer, {
      folder: "group_avatars",
      public_id: `group_${group_id}`,
      overwrite: true,
    });
    return this.groupRepo.updateGroup(group_id, {
      avatar_url: uploaded.secure_url,
    });
  }

  async deleteGroup(group_id, actor_id) {
    const member = await this.memberRepo.getMember(group_id, actor_id);
    if (!member || member.role !== "OWNER")
      throw createError("Only owner can delete group", 403);

    await this.groupRepo.deleteGroup(group_id);
    await publishEvent(RMQ_ROUTING_KEYS.GROUP.DELETED, { group_id });
    return true;
  }

  async getGroupDetail(group_id, user_id) {
    return this.groupRepo.getGroupById(group_id, user_id);
  }

  async listGroupsByUser(user_id, options = {}) {
    return this.memberRepo.listGroupsByUser(user_id, options);
  }

  async listOwnedGroups(user_id) {
    return this.memberRepo.listOwnedGroups(user_id);
  }

  async findGroups({ name, access, limit, offset }, user_id = null) {
    if (name)
      return this.groupRepo.findByNameLike(name, { limit, offset }, user_id);
    return this.groupRepo.findAllGroups({ access, limit, offset }, user_id);
  }

  async listGroupsNotJoined(user_id, { limit, offset }) {
    return this.groupRepo.findGroupsNotJoined(user_id, { limit, offset });
  }

  async countGroups() {
    return this.groupRepo.countGroups();
  }

  async getAllGroups({ limit, offset }) {
    return this.groupRepo.getAllGroups({ limit, offset });
  }

  async listJoinRequests(group_id, { limit = 50, offset = 0 } = {}) {
    limit = Math.max(1, Number(limit) || 50);
    offset = Math.max(0, Number(offset) || 0);

    const [items, total] = await Promise.all([
      this.joinRepo.listPending(group_id, { limit, offset }),
      this.joinRepo.countPending(group_id),
    ]);

    return {
      items,
      total,
      limit,
      offset,
    };
  }

  async listMyInvites(user_id, { limit = 50, offset = 0 } = {}) {
    limit = Math.max(1, Number(limit) || 50);
    offset = Math.max(0, Number(offset) || 0);

    const [items, total] = await Promise.all([
      this.joinRepo.listInvitesByUser(user_id, { limit, offset }),
      this.joinRepo.countInvitesByUser(user_id),
    ]);

    return {
      items,
      total,
      limit,
      offset,
    };
  }

  async joinGroup(group_id, user_id) {
    const group = await this.groupRepo.getGroupById(group_id);
    if (!group) throw createError("Group not found");

    const existed = await this.memberRepo.getMember(group_id, user_id);
    if (existed) return existed;

    if (group.access === "PUBLIC") {
      const member = await this.memberRepo.addMember({
        group_id,
        user_id,
        role: "MEMBER",
      });
      await this.activityRepo.logActivity({
        id: uuidv4(),
        group_id,
        actor_id: user_id,
        action: "JOIN_GROUP",
      });
      return member;
    }

    return this.joinRepo.createRequest({ id: uuidv4(), group_id, user_id });
  }

  async approveJoinRequest(request_id, actor_id) {
    const req = await this.joinRepo.getById(request_id);
    if (!req) throw createError("Request not found");

    await this.joinRepo.updateStatus(request_id, "APPROVED");
    const member = await this.memberRepo.addMember({
      group_id: req.group_id,
      user_id: req.user_id,
      role: "MEMBER",
    });

    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id: req.group_id,
      actor_id,
      target_id: req.user_id,
      action: "APPROVE_JOIN",
    });
    return member;
  }

  async rejectJoinRequest(request_id, actor_id) {
    const req = await this.joinRepo.getById(request_id);
    if (!req) throw createError("Request not found");

    await this.joinRepo.updateStatus(request_id, "REJECTED");
    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id: req.group_id,
      actor_id,
      target_id: req.user_id,
      action: "REJECT_JOIN",
    });
    return true;
  }

  async cancelJoinRequest(group_id, user_id) {
    const req = await this.joinRepo.get(group_id, user_id);
    if (!req) throw createError("Request not found");
    if (req.status !== "PENDING")
      throw createError("Cannot cancel processed request");

    await this.joinRepo.deleteRequest(req.id);
    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id,
      actor_id: user_id,
      action: "CANCEL_JOIN_REQUEST",
    });
    return true;
  }

  async inviteMember(group_id, target_id, actor_id) {
    const group = await this.groupRepo.getGroupById(group_id);
    if (!group) throw createError("Group not found");

    const actor = await this.memberRepo.getMember(group_id, actor_id);
    if (!actor || !["OWNER", "MODERATOR"].includes(actor.role))
      throw createError("No permission to invite", 403);

    const existed = await this.memberRepo.getMember(group_id, target_id);
    if (existed) return existed;

    if (group.access === "PUBLIC") {
      const member = await this.memberRepo.addMember({
        group_id,
        user_id: target_id,
        role: "MEMBER",
      });
      await this.activityRepo.logActivity({
        id: uuidv4(),
        group_id,
        actor_id,
        target_id,
        action: "INVITE_MEMBER",
      });
      return member;
    } else {
      const req = await this.joinRepo.createRequest({
        id: uuidv4(),
        group_id,
        user_id: target_id,
      });
      await this.activityRepo.logActivity({
        id: uuidv4(),
        group_id,
        actor_id,
        target_id,
        action: "INVITE_MEMBER_REQUEST",
      });
      return req;
    }
  }

  async isJoinPending(group_id, user_id) {
    const request = await this.joinRepo.get(group_id, user_id);
    return request?.status === "PENDING" || false;
  }

  async getActivityLogs(group_id, action, paging) {
    return this.activityRepo.list(group_id, action, paging);
  }

  async emitEvent(key, payload) {
    await publishEvent(key, payload);
  }
}
