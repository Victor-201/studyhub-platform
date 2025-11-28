import { BaseRepository } from "./BaseRepository.js";
import UserRole from "../models/UserRole.js";

export class UserRoleRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_roles");
  }

  async findByUserId(userId) {
    return this.findAll({ user_id: userId });
  }
}
