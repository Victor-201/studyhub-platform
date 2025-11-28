import { BaseRepository } from "./BaseRepository.js";
import UserDeletion from "../models/UserDeletion.js";

export class UserDeletionRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_deletions");
  }

  async softDelete(userDeletion) {
    await this.create(userDeletion);
    return new UserDeletion(userDeletion);
  }

  async findByUserId(userId) {
    const rows = await this.findAll({ user_id: userId });
    return rows.map(row => new UserDeletion(row));
  }
}
