import { BaseRepository } from "./BaseRepository.js";
import Role from "../models/Role.js";

export class RoleRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "roles");
  }

  async findByName(name) {
    const [rows] = await this.pool.query(
      `SELECT * FROM roles WHERE name = ? LIMIT 1`,
      [name]
    );
    return rows.length ? new Role(rows[0]) : null;
  }

  async findAllRoles() {
    const rows = await super.findAll();
    return rows.map(row => new Role(row));
  }
}
