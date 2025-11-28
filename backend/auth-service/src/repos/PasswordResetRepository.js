import { BaseRepository } from "./BaseRepository.js";
import PasswordReset from "../models/PasswordReset.js";

export class PasswordResetRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "password_resets");
  }

  async findByHash(hash) {
    const [rows] = await this.pool.query(
      `SELECT * FROM password_resets WHERE token_hash = ? AND used_at IS NULL LIMIT 1`,
      [hash]
    );
    return rows.length ? new PasswordReset(rows[0]) : null;
  }

  async markUsed(id) {
    const now = new Date();
    await this.updateById(id, { used_at: now });
    const updatedRow = await this.findById(id);
    return updatedRow ? new PasswordReset(updatedRow) : null;
  }

  async findByUserId(userId) {
    const rows = await this.findAll({ user_id: userId });
    return rows.map(row => new PasswordReset(row));
  }
}
