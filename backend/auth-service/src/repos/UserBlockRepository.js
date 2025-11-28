import { BaseRepository } from "./BaseRepository.js";
import UserBlock from "../models/UserBlock.js";

export class UserBlockRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_blocks");
  }

  async blockUser(userBlock) {
    await this.create(userBlock);
    return new UserBlock(userBlock);
  }

  async findByUserId(userId) {
    const rows = await this.findAll({ user_id: userId });
    return rows.map(row => new UserBlock(row));
  }
}
