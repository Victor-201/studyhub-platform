import { BaseRepository } from "./BaseRepository.js";
import Permission from "../models/Permission.js";

export class PermissionRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "permissions");
  }

  async findByName(name) {
    const [rows] = await this.pool.query(
      `SELECT * FROM permissions WHERE name = ? LIMIT 1`,
      [name]
    );
    return rows.length ? new Permission(rows[0]) : null;
  }

  async findAllPermissions() {
    const rows = await super.findAll();
    return rows.map(row => new Permission(row));
  }
}
