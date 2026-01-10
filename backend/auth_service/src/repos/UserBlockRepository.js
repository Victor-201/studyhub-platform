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
    return rows.map((row) => new UserBlock(row));
  }

  async findActiveBlockByUserId(user_id) {
    const rows = await this.pool.query(
      `
  SELECT * FROM user_blocks
  WHERE user_id = ?
    AND lifted_at IS NULL
    AND (
      is_permanent = 1
      OR blocked_until IS NULL
      OR blocked_until > NOW()
    )
  ORDER BY created_at DESC
  LIMIT 1
  `,
      [user_id]
    );
    return rows.rows[0] ? new UserBlock(rows.rows[0]) : null;
  }

  async isUserBlocked(user_id) {
    const block = await this.findActiveBlockByUserId(user_id);
    return !!block;
  }

  async liftBlock(id) {
    const now = new Date();
    await this.updateById(id, { lifted_at: now });
    const updated = await this.findById(id);
    return updated ? new UserBlock(updated) : null;
  }

  async liftAllBlocksByUser(user_id) {
    await this.pool.query(
      `
    UPDATE user_blocks
    SET lifted_at = NOW()
    WHERE user_id = ? AND lifted_at IS NULL
    `,
      [user_id]
    );
    return true;
  }

  async deleteBlock(id) {
    return await this.deleteById(id);
  }
}
