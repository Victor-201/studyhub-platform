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

    const row = await this.create(payload);
    return new AuditLog(row);
  }

  async findByActor(actor_user_id) {
    const rows = await this.findAll({ actor_user_id });
    return rows.map(row => new AuditLog(row));
  }

  async findByTarget(target_user_id) {
    const rows = await this.findAll({ target_user_id });
    return rows.map(row => new AuditLog(row));
  }
}
