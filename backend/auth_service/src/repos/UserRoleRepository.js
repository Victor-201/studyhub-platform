import { BaseRepository } from "./BaseRepository.js";
import UserRole from "../models/UserRole.js";

export class UserRoleRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_roles");
  }

  async findByUserId(user_id) {
    const rows = await this.findAll({ user_id }, "assigned_at DESC");
    return rows.map((row) => new UserRole(row));
  }

  async findByRoleId(role_id) {
    const rows = await this.findAll({ role_id }, "assigned_at DESC");
    return rows.map((row) => new UserRole(row));
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
