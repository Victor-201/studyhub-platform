import { BaseRepository } from "./BaseRepository.js";
import RolePermission from "../models/RolePermission.js";

export class RolePermissionRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "role_permissions");
  }

  async addPermissionToRole(role_id, permission_id) {
    const row = await this.create({ role_id, permission_id });
    return new RolePermission(row);
  }

  async removePermissionFromRole(role_id, permission_id) {
    await this.pool.query(
      `DELETE FROM ${this.table} WHERE role_id = ? AND permission_id = ?`,
      [role_id, permission_id]
    );
    return true;
  }

  async findByRoleId(role_id) {
    const rows = await this.findAll({ role_id });
    return rows.map(row => new RolePermission(row));
  }

  async findByPermissionId(permission_id) {
    const rows = await this.findAll({ permission_id });
    return rows.map(row => new RolePermission(row));
  }
}
