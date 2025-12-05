import { BaseRepository } from "./BaseRepository.js";
import GroupMember from "../models/GroupMember.js";

export default class GroupMemberRepository extends BaseRepository {
  constructor(pool) { super(pool, "group_members"); }

  async addMember(data) {
    await this.create(data);
    return new GroupMember(data);
  }

  async getMember(group_id, user_id) {
    const [rows] = await this.pool.query(`SELECT * FROM ${this.table} WHERE group_id=? AND user_id=? LIMIT 1`, [group_id, user_id]);
    return rows[0] ? new GroupMember(rows[0]) : null;
  }

  async updateMemberRole(group_id, user_id, role) {
    const sql = `UPDATE ${this.table} SET role=? WHERE group_id=? AND user_id=?`;
    await this.pool.query(sql, [role, group_id, user_id]);
    return this.getMember(group_id, user_id);
  }

  async removeMember(group_id, user_id) {
    const sql = `DELETE FROM ${this.table} WHERE group_id=? AND user_id=?`;
    await this.pool.query(sql, [group_id, user_id]);
    return true;
  }

  async findAllByGroup(group_id, { limit = 100, offset = 0 } = {}) {
    const sql = `SELECT * FROM ${this.table} WHERE group_id=? ORDER BY joined_at ASC LIMIT ? OFFSET ?`;
    const [rows] = await this.pool.query(sql, [group_id, limit, offset]);
    return rows.map(row => new GroupMember(row));
  }

  async findAllByUser(user_id, { limit = 100, offset = 0 } = {}) {
    const sql = `SELECT * FROM ${this.table} WHERE user_id=? ORDER BY joined_at ASC LIMIT ? OFFSET ?`;
    const [rows] = await this.pool.query(sql, [user_id, limit, offset]);
    return rows.map(row => new GroupMember(row));
  }
}
