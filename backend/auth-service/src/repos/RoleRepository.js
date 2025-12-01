import { BaseRepository } from "./BaseRepository.js";
import Role from "../models/Role.js";

export class RoleRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "roles");
  }

  async findByName(name) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE name = ? LIMIT 1`,
      [name]
    );
    return rows.length ? new Role(rows[0]) : null;
  }

  async findAllRoles() {
    const rows = await this.findAll();
    return rows.map(row => new Role(row));
  }

  async createRole(data) {
    const row = await this.create(data);
    return new Role(row);
  }

  async updateRole(id, update_data) {
    await this.updateById(id, update_data);
    const updated = await this.findById(id);
    return updated ? new Role(updated) : null;
  }

  async deleteRole(id) {
    return await this.deleteById(id);
  }
}
