import { v4 as uuidv4 } from "uuid";

export class AuditService {
  constructor({ auditLogRepo }) {
    this.auditLogRepo = auditLogRepo;
  }

  /**
   * Ghi log hành động
   * @param {string|null} actorUserId - Người thực hiện hành động
   * @param {string|null} targetUserId - Người bị tác động
   * @param {string} action - Tên hành động (login, delete_user,…)
   * @param {string|null} resourceType - Loại resource tác động (user, session,…)
   * @param {string|null} resourceId - ID resource
   * @param {object|null} meta - Thông tin bổ sung (ip, userAgent,…)
   */
  async log({
    actorUserId = null,
    targetUserId = null,
    action,
    resourceType = null,
    resourceId = null,
    meta = null,
  }) {
    const log = {
      id: uuidv4(),
      actor_user_id: actorUserId,
      target_user_id: targetUserId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      meta: meta ? JSON.stringify(meta) : null,
      created_at: new Date(),
    };

    await this.auditLogRepo.create(log);
    return log;
  }
}
