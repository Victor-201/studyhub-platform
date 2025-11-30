import { BaseRepository } from "./BaseRepository.js";
import AuditLog from "../models/AuditLog.js";

export class AuditLogRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "audit_logs");
  }

  async logAction(logData) {
    const payload = {
      ...logData,
      meta: logData.meta ? JSON.stringify(logData.meta) : null
    };

    const inserted = await this.create(payload);
    return new AuditLog(inserted);
  }

  async findByActor(actorUserId) {
    const rows = await this.findAll({ actor_user_id: actorUserId });
    return rows.map(row => new AuditLog(row));
  }

  async findByTarget(targetUserId) {
    const rows = await this.findAll({ target_user_id: targetUserId });
    return rows.map(row => new AuditLog(row));
  }
}
