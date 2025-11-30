import { BaseRepository } from "./BaseRepository.js";
import UserRole from "../models/UserRole.js";

export class UserRoleRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_roles");
  }

  async findByUserId(userId) {
    const rows = await this.findAll({ user_id: userId });
    return rows.map(row => new UserRole(row));
  }

  async findByRoleId(roleId) {
    const rows = await this.findAll({ role_id: roleId });
    return rows.map(row => new UserRole(row));
  }

  async assignRole(data) {
    const row = await this.create(data);
    return new UserRole(row);
  }

  async revokeRole(id) {
    const now = new Date();
    await this.updateById(id, { revoked_at: now });
    const updated = await this.findById(id);
    return updated ? new UserRole(updated) : null;
  }

  async deleteRoleAssignment(id) {
    return await this.deleteById(id);
  }
}
