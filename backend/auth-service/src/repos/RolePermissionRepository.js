import { BaseRepository } from "./BaseRepository.js";
import RolePermission from "../models/RolePermission.js";

export class RolePermissionRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "role_permissions");
  }

  async addPermissionToRole(roleId, permissionId) {
    const row = await this.create({ role_id: roleId, permission_id: permissionId });
    return new RolePermission(row);
  }

  async removePermissionFromRole(roleId, permissionId) {
    await this.pool.query(
      `DELETE FROM ${this.table} WHERE role_id = ? AND permission_id = ?`,
      [roleId, permissionId]
    );
    return true;
  }

  async findByRoleId(roleId) {
    const rows = await this.findAll({ role_id: roleId });
    return rows.map(row => new RolePermission(row));
  }

  async findByPermissionId(permissionId) {
    const rows = await this.findAll({ permission_id: permissionId });
    return rows.map(row => new RolePermission(row));
  }
}
