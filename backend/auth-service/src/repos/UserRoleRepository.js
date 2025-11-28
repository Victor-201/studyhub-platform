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

  async assignRole(roleData) {
    await this.create(roleData);
    return new UserRole(roleData);
  }
}
