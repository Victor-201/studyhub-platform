import { BaseRepository } from "./BaseRepository.js";
import GroupActivityLog from "../models/GroupActivityLog.js";

export default class GroupActivityLogRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "group_activity_logs");
  }

  async logActivity(data) {
    await this.create(data);
    return new GroupActivityLog(data);
  }

  async list(group_id, action, { limit = 50, offset = 0 } = {}) {
    const params = [];
    let idx = 1;

    let sql = `SELECT * FROM group_activity_logs WHERE group_id=$${idx++}`;
    params.push(group_id);

    if (action) {
      sql += ` AND action=$${idx++}`;
      params.push(action);
    }

    sql += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(limit, offset);

    const { rows } = await this.pool.query(sql, params);
    return rows.map(r => new GroupActivityLog(r));
  }
}
