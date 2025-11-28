export class AuditService {
  /**
   * @param {Object} deps
   * @param {import("../repos/AuditLogRepository.js").AuditLogRepository} deps.auditRepo
   */
  constructor({ auditRepo }) {
    this.auditRepo = auditRepo;
  }

  /**
   * Log an action
   * @param {{actor_user_id?:number,target_user_id?:number,action:string,meta?:Object,created_at?:Date}} payload
   * @returns {Promise<Object>} created audit log entry
   */
  async log(payload) {
    const entry = {
      actor_user_id: payload.actor_user_id || null,
      target_user_id: payload.target_user_id || null,
      action: payload.action,
      meta: payload.meta || null,
      created_at: payload.created_at || new Date(),
    };

    return this.auditRepo.logAction(entry);
  }

  /**
   * Get logs by actor
   * @param {number} actorUserId
   */
  async getLogsByActor(actorUserId) {
    return this.auditRepo.findByActor(actorUserId);
  }

  /**
   * Get logs by target
   * @param {number} targetUserId
   */
  async getLogsByTarget(targetUserId) {
    return this.auditRepo.findByTarget(targetUserId);
  }
}