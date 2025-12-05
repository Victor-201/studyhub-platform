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

// =========================
// CREATE GROUP SERVICE
// =========================
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

  if (file && file.buffer) {
    const allowedExts = ["jpg", "jpeg", "png", "webp"];
    const type = await fileTypeFromBuffer(file.buffer);

    if (!type || !allowedExts.includes(type.ext)) {
      throw createError("Uploaded file is not a valid image.");
    }

    const public_id = `avatar_${group_id}`;
    const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);

    const uploaded = await uploadToCloudinary(buffer, {
      folder,
      public_id,
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

  if (!group) throw createError("Group creation failed");

  // Owner auto join
  await this.memberRepo.addMember({
    group_id,
    user_id,
    role: "OWNER",
  });

  // Log activity
  await this.activityRepo.logActivity({
    id: uuidv4(),
    group_id,
    actor_id: user_id,
    action: "CREATE_GROUP",
  });

  // Publish event
  await publishEvent(RMQ_ROUTING_KEYS.GROUP.CREATED, {
    group_id,
    user_id,
  });

  // Trả về object Group
  return group;
}


  // =========================
  // CHECK MEMBERSHIP
  // =========================
  async checkMembership(group_id, user_id) {
    const group = await this.groupRepo.getGroupById(group_id);
    if (!group) throw createError("Group not found", 404);

    const member = await this.memberRepo.getMember(group_id, user_id);
    if (!member) throw createError("User is not a member", 403);

    return { group, role: member.role };
  }

  // =========================
  // GET GROUPS OWNED BY USER
  // =========================
  async getUserOwnedGroups(owner_id) {
    return this.groupRepo.getGroupsByOwner(owner_id);
  }

  // =========================
  // UPDATE GROUP
  // =========================
  async updateGroup(id, data) {
    const group = await this.groupRepo.getGroupById(id);
    if (!group) throw createError("Group not found", 404);
    return this.groupRepo.updateGroup(id, data);
  }

  // =========================
  // UPDATE AVATAR
  // =========================
  async updateAvatar(group_id, file) {
    if (!file?.buffer) throw createError("No avatar file uploaded");

    const type = await fileTypeFromBuffer(file.buffer);
    const allowed = ["jpg", "jpeg", "png", "webp"];
    if (!type || !allowed.includes(type.ext)) {
      throw createError("Invalid image type");
    }

    const group = await this.groupRepo.getGroupById(group_id);
    if (!group) throw createError("Group not found", 404);

    const uploaded = await uploadToCloudinary(file.buffer, {
      folder: "group_avatars",
      public_id: `group_${group_id}`,
      overwrite: true,
    });

    return this.groupRepo.updateGroup(group_id, {
      avatar_url: uploaded.secure_url,
    });
  }

  // =========================
  // DELETE GROUP
  // =========================
  async deleteGroup(id) {
    const group = await this.groupRepo.getGroupById(id);
    if (!group) throw createError("Group not found", 404);

    await this.groupRepo.deleteGroup(id);

    await publishEvent(RMQ_ROUTING_KEYS.GROUP.DELETED, {
      group_id: id,
    });

    return true;
  }

  // =========================
  // GET GROUP, SEARCH GROUPS
  // =========================
  async getGroupById(id) {
    return this.groupRepo.getGroupById(id);
  }

  async findGroups({ namePattern, limit = 20, offset = 0 }) {
    return namePattern
      ? this.groupRepo.findByNameLike(namePattern, { limit, offset })
      : this.groupRepo.findAllGroups({ limit, offset });
  }

  // =========================
  // JOIN / REQUEST JOIN GROUP
  // =========================
  async joinGroup(group_id, user_id) {
    const group = await this.groupRepo.getGroupById(group_id);
    if (!group) throw createError("Group not found");

    const exists = await this.memberRepo.getMember(group_id, user_id);
    if (exists) return exists;

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

    return this.joinRepo.createRequest({
      id: uuidv4(),
      group_id,
      user_id,
    });
  }

  // =========================
  // APPROVE / REJECT REQUEST
  // =========================
  async approveJoinRequest(request_id, actor_id) {
    const request = await this.joinRepo.getRequestById(request_id);
    if (!request) throw createError("Request not found");

    await this.joinRepo.updateRequestStatus(request_id, "APPROVED", new Date());

    const member = await this.memberRepo.addMember({
      group_id: request.group_id,
      user_id: request.user_id,
      role: "MEMBER",
    });

    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id: request.group_id,
      actor_id,
      action: "APPROVE_JOIN",
      target_id: request.user_id,
    });

    return member;
  }

  async rejectJoinRequest(request_id, actor_id) {
    const request = await this.joinRepo.getRequestById(request_id);
    if (!request) throw createError("Request not found");

    await this.joinRepo.updateRequestStatus(request_id, "REJECTED", new Date());

    await this.activityRepo.logActivity({
      id: uuidv4(),
      group_id: request.group_id,
      actor_id,
      target_id: request.user_id,
      action: "REJECT_JOIN",
    });

    return request;
  }

  // =========================
  // PENDING REQUEST LIST
  // =========================
  async getPendingRequests(group_id) {
    return this.joinRepo.getPendingRequests(group_id);
  }

  // =========================
  // ACTIVITY LOGS
  // =========================
  async getActivityLogs(group_id) {
    return this.activityRepo.getLogs(group_id);
  }
}
