import { BaseRepository } from "./BaseRepository.js";
import Group from "../models/Group.js";

export default class GroupRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "`groups`");
  }

  async createGroup(data) {
    await this.create(data);
    return new Group(data);
  }

  async getGroupById(id, user_id = null) {
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
      COUNT(gm.user_id) AS count_member,
      gm2.role
    FROM \`groups\` g
    LEFT JOIN group_members gm 
      ON g.id = gm.group_id
    LEFT JOIN group_members gm2 
      ON g.id = gm2.group_id AND gm2.user_id = ?
    WHERE g.id = ?
    GROUP BY g.id
    LIMIT 1`,
      [user_id, id]
    );

    if (!rows.length) return null;

    return rows[0];
  }

  async updateGroup(id, data) {
    await this.updateById(id, data);
    return this.getGroupById(id);
  }

  async deleteGroup(id) {
    return this.deleteById(id);
  }

  async countGroups() {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS count FROM \`groups\``
    );
    return rows[0].count;
  }

  async getAllGroups({ limit = 50, offset = 0 } = {}) {
    limit = Number(limit);
    offset = Number(offset);

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
       owner_table.owner_id AS own_id,
       IFNULL(member_table.count_member, 0) AS count_member
     FROM \`groups\` g
     LEFT JOIN (
       SELECT group_id, user_id AS owner_id
       FROM group_members
       WHERE role = 'OWNER'
     ) owner_table ON g.id = owner_table.group_id
     LEFT JOIN (
       SELECT group_id, COUNT(*) AS count_member
       FROM group_members
       GROUP BY group_id
     ) member_table ON g.id = member_table.group_id
     ORDER BY g.created_at DESC
     LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return rows;
  }

  async findAllGroups({ access, limit = 50, offset = 0 } = {}, user_id = null) {
    const params = [];
    let where = "";

    if (access) {
      where = "WHERE g.access=?";
      params.push(access);
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
      COUNT(gm.user_id) AS count_member,
      gm2.role
    FROM \`groups\` g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    LEFT JOIN group_members gm2 
      ON g.id = gm2.group_id AND gm2.user_id = ?
    ${where}
    GROUP BY g.id
    ORDER BY g.created_at DESC
    LIMIT ? OFFSET ?`,
      [user_id, ...params, limit, offset]
    );

    return rows;
  }

  async findByNameLike(name, { limit = 20, offset = 0 } = {}, user_id = null) {
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
      COUNT(gm.user_id) AS count_member,
      gm2.role
    FROM \`groups\` g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    LEFT JOIN group_members gm2 
      ON g.id = gm2.group_id AND gm2.user_id = ?
    WHERE g.name LIKE ?
    GROUP BY g.id
    ORDER BY g.name ASC
    LIMIT ? OFFSET ?`,
      [user_id, `%${name}%`, limit, offset]
    );

    return rows;
  }

  async findGroupsNotJoined(user_id, { limit = 20, offset = 0 } = {}) {
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
      COUNT(gm.user_id) AS count_member,
      NULL AS role
    FROM \`groups\` g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    WHERE g.id NOT IN (
      SELECT group_id FROM group_members WHERE user_id = ?
    )
    GROUP BY g.id
    ORDER BY g.created_at DESC
    LIMIT ? OFFSET ?`,
      [user_id, limit, offset]
    );

    return rows;
  }
}
