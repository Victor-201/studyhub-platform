import { BaseRepository } from "./BaseRepository.js";
import GroupJoinRequest from "../models/GroupJoinRequest.js";

export default class GroupJoinRequestRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "group_join_requests");
  }

  async createRequest(data) {
    await this.create(data);
    return new GroupJoinRequest(data);
  }

  async get(group_id, user_id) {
    const [rows] = await this.pool.query(
      "SELECT * FROM group_join_requests WHERE group_id=? AND user_id=?",
      [group_id, user_id]
    );
    return rows[0] ? new GroupJoinRequest(rows[0]) : null;
  }

  async getById(id) {
    const row = await this.findById(id);
    return row ? new GroupJoinRequest(row) : null;
  }

  async updateStatus(id, status) {
    await this.updateById(id, { status, responded_at: new Date() });
    return this.getById(id);
  }

  async deleteRequest(id) {
    return this.deleteById(id);
  }

  async listPending(group_id, { limit = 50, offset = 0 } = {}) {
    limit = Math.max(1, Number(limit) || 50);
    offset = Math.max(0, Number(offset) || 0);

    const [rows] = await this.pool.query(
      `SELECT *
       FROM group_join_requests
       WHERE group_id = ?
         AND status = 'PENDING'
       ORDER BY requested_at ASC
       LIMIT ? OFFSET ?`,
      [group_id, limit, offset]
    );

    return rows.map((r) => new GroupJoinRequest(r));
  }
  async listInvitesByUser(user_id, { limit = 50, offset = 0 } = {}) {
    limit = Math.max(1, Number(limit) || 50);
    offset = Math.max(0, Number(offset) || 0);

    const [rows] = await this.pool.query(
      `SELECT *
       FROM group_join_requests
       WHERE user_id = ?
         AND status = 'INVITED'
       ORDER BY requested_at DESC
       LIMIT ? OFFSET ?`,
      [user_id, limit, offset]
    );

    return rows.map((r) => new GroupJoinRequest(r));
  }
  async countPending(group_id) {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS total
       FROM group_join_requests
       WHERE group_id = ?
         AND status = 'PENDING'`,
      [group_id]
    );

    return rows[0].total;
  }

  async countInvitesByUser(user_id) {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS total
       FROM group_join_requests
       WHERE user_id = ?
         AND status = 'INVITED'`,
      [user_id]
    );

    return rows[0].total;
  }
}
