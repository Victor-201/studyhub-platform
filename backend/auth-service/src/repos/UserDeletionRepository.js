import { BaseRepository } from "./BaseRepository.js";
import UserDeletion from "../models/UserDeletion.js";

export class UserDeletionRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_deletions");
  }

  async softDelete(data) {
    const row = await this.create(data);
    return new UserDeletion(row);
  }

  async restore(id, restored_by) {
    const now = new Date();
    await this.updateById(id, { restored_at: now, restored_by });
    const updated = await this.findById(id);
    return updated ? new UserDeletion(updated) : null;
  }

  async findByUserId(user_id) {
    const rows = await this.findAll({ user_id });
    return rows.map(row => new UserDeletion(row));
  }

  async deleteRecord(id) {
    return await this.deleteById(id);
  }
}
