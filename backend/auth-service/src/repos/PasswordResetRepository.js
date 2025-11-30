import { BaseRepository } from "./BaseRepository.js";
import PasswordReset from "../models/PasswordReset.js";

export class PasswordResetRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "password_resets");
  }

  async findByHash(tokenHash) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE token_hash = ? AND used_at IS NULL LIMIT 1`,
      [tokenHash]
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

  async createReset(data) {
    const row = await this.create(data);
    return new PasswordReset(row);
  }

  async deleteReset(id) {
    return await this.deleteById(id);
  }
}
