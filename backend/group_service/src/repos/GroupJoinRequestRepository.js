import { BaseRepository } from "./BaseRepository.js";
import GroupJoinRequest from "../models/GroupJoinRequest.js";

export default class GroupJoinRequestRepository extends BaseRepository {
  constructor(pool) { super(pool, "group_join_requests"); }

  async createRequest(data) {
    await this.create(data);
    return new GroupJoinRequest(data);
  }

  async getRequestById(id) {
    const row = await this.findById(id);
    return row ? new GroupJoinRequest(row) : null;
  }

  async updateRequestStatus(id, status, responded_at = null) {
    await this.updateById(id, { status, responded_at });
    return this.getRequestById(id);
  }

  async deleteRequest(id) {
    return this.deleteById(id);
  }

  async findAllByGroup(group_id, { limit = 100, offset = 0 } = {}) {
    const sql = `SELECT * FROM ${this.table} WHERE group_id=? ORDER BY requested_at ASC LIMIT ? OFFSET ?`;
    const [rows] = await this.pool.query(sql, [group_id, limit, offset]);
    return rows.map(row => new GroupJoinRequest(row));
  }

  async findPendingByGroup(group_id, { limit = 100, offset = 0 } = {}) {
    const sql = `SELECT * FROM ${this.table} WHERE group_id=? AND status='PENDING' ORDER BY requested_at ASC LIMIT ? OFFSET ?`;
    const [rows] = await this.pool.query(sql, [group_id, limit, offset]);
    return rows.map(row => new GroupJoinRequest(row));
  }
}
