import { BaseRepository } from "./BaseRepository.js";
import GroupActivityLog from "../models/GroupActivityLog.js";

export default class GroupActivityLogRepository extends BaseRepository {
  constructor(pool) { super(pool, "group_activity_logs"); }

  async logActivity(data) {
    await this.create(data);
    return new GroupActivityLog(data);
  }

  async findAllByGroup(group_id, { limit = 100, offset = 0 } = {}) {
    const sql = `SELECT * FROM ${this.table} WHERE group_id=? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const [rows] = await this.pool.query(sql, [group_id, limit, offset]);
    return rows.map(row => new GroupActivityLog(row));
  }

  async findAllByActor(actor_id, { limit = 100, offset = 0 } = {}) {
    const sql = `SELECT * FROM ${this.table} WHERE actor_id=? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const [rows] = await this.pool.query(sql, [actor_id, limit, offset]);
    return rows.map(row => new GroupActivityLog(row));
  }

  async updateLog(id, data) {
    await this.updateById(id, data);
    const row = await this.findById(id);
    return row ? new GroupActivityLog(row) : null;
  }

  async deleteLog(id) {
    return this.deleteById(id);
  }
}
