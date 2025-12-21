import { BaseRepository } from "./BaseRepository.js";
import GroupMember from "../models/GroupMember.js";

export default class GroupMemberRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "group_members");
  }

  async addMember(data) {
    await this.create(data);
    return new GroupMember(data);
  }

  async getMember(group_id, user_id) {
    const [rows] = await this.pool.query(
      "SELECT * FROM group_members WHERE group_id=? AND user_id=?",
      [group_id, user_id]
    );
    return rows[0] ? new GroupMember(rows[0]) : null;
  }

  async updateRole(group_id, user_id, role) {
    await this.pool.query(
      "UPDATE group_members SET role=? WHERE group_id=? AND user_id=?",
      [role, group_id, user_id]
    );
    return this.getMember(group_id, user_id);
  }

  async removeMember(group_id, user_id) {
    await this.pool.query(
      "DELETE FROM group_members WHERE group_id=? AND user_id=?",
      [group_id, user_id]
    );
  }

  async list(group_id, role, { limit = 50, offset = 0 } = {}) {
    let sql = "SELECT * FROM group_members WHERE group_id=?";
    const params = [group_id];
    if (role) {
      sql += " AND role=?";
      params.push(role);
    }
    sql += " ORDER BY joined_at ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await this.pool.query(sql, params);
    return rows.map((r) => new GroupMember(r));
  }

  async listGroupsByUser(user_id, options = {}) {
    const conditions = [`gm.user_id = ?`];
    const params = [user_id];

    if (options.publicOnly) {
      conditions.push(`g.access = 'PUBLIC'`);
    }

    const [rows] = await this.pool.query(
      `SELECT
      g.id,
      g.name,
      g.avatar_url,
      g.description,
      g.access,
      g.auto_approve_docs,
      g.created_at,
      g.updated_at,
      gm.role,
      COUNT(gm2.user_id) AS count_member
    FROM \`groups\` g
    JOIN group_members gm ON g.id = gm.group_id
    JOIN group_members gm2 ON g.id = gm2.group_id
    WHERE ${conditions.join(" AND ")}
    GROUP BY g.id, gm.role`,
      params
    );

    return rows;
  }

  async listOwnedGroups(user_id) {
    const [rows] = await this.pool.query(
      `SELECT
      g.id,
      g.name,
      g.avatar_url,
      g.description,
      g.access,
      g.auto_approve_docs,
      g.created_at,
      g.updated_at,
      gm.role,
      COUNT(gm2.user_id) AS count_member
    FROM \`groups\` g
    JOIN group_members gm 
      ON g.id = gm.group_id AND gm.user_id = ? AND gm.role = 'OWNER'
    JOIN group_members gm2 ON g.id = gm2.group_id
    GROUP BY g.id, gm.role`,
      [user_id]
    );

    return rows;
  }
}
