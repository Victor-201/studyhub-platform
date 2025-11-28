import { BaseRepository } from "./BaseRepository.js";
import AuditLog from "../models/AuditLog.js";

export class AuditLogRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "audit_logs");
  }

  async logAction(auditLog) {
    return this.create(auditLog);
  }
}
