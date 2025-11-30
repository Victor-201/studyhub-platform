import { BaseRepository } from "./BaseRepository.js";
import Permission from "../models/Permission.js";

export class PermissionRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "permissions");
  }

  async findByName(name) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE name = ? LIMIT 1`,
      [name]
    );
    return rows.length ? new Permission(rows[0]) : null;
  }

  async findAllPermissions() {
    const rows = await this.findAll();
    return rows.map(row => new Permission(row));
  }

  async createPermission(data) {
    const row = await this.create(data);
    return new Permission(row);
  }

  async updatePermission(id, updateData) {
    await this.updateById(id, updateData);
    const updated = await this.findById(id);
    return updated ? new Permission(updated) : null;
  }

  async deletePermission(id) {
    return await this.deleteById(id);
  }
}
