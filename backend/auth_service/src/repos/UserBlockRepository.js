import { BaseRepository } from "./BaseRepository.js";
import UserBlock from "../models/UserBlock.js";

export class UserBlockRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_blocks");
  }

  async blockUser(data) {
    const row = await this.create(data);
    return new UserBlock(row);
  }

  async findByUserId(user_id) {
    const rows = await this.findAll({ user_id });
    return rows.map(row => new UserBlock(row));
  }

  async liftBlock(id) {
    const now = new Date();
    await this.updateById(id, { lifted_at: now });
    const updated = await this.findById(id);
    return updated ? new UserBlock(updated) : null;
  }

  async deleteBlock(id) {
    return await this.deleteById(id);
  }
}
