import { BaseRepository } from "./BaseRepository.js";
import Group from "../models/Group.js";

export default class GroupRepository extends BaseRepository {
  constructor(pool) { super(pool, "`groups`"); }

  async createGroup(data) {
    await this.create(data);
    return new Group(data);
  }

  async getGroupById(id) {
    const row = await this.findById(id);
    return row ? new Group(row) : null;
  }

  async updateGroup(id, data) {
    await this.updateById(id, data);
    const row = await this.findById(id);
    return row ? new Group(row) : null;
  }

  async deleteGroup(id) {
    return this.deleteById(id);
  }

  async findAllGroups({ where = {}, orderBy = "created_at DESC", limit = 100, offset = 0 } = {}) {
    const rows = await this.findAll({ where, orderBy, limit, offset });
    return rows.map(row => new Group(row));
  }

  async findByNameLike(namePattern, { limit = 20, offset = 0 } = {}) {
    const sql = `
      SELECT * FROM ${this.table} 
      WHERE name LIKE ?
      ORDER BY name ASC
      LIMIT ? OFFSET ?`;
    const [rows] = await this.pool.query(sql, [`%${namePattern}%`, limit, offset]);
    return rows.map(row => new Group(row));
  }
}
