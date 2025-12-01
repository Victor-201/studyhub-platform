import { BaseRepository } from "./BaseRepository.js";
import EmailVerification from "../models/EmailVerification.js";

export class EmailVerificationRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "email_verifications");
  }

  async findByHash(token_hash) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE token_hash = ? AND used_at IS NULL LIMIT 1`,
      [token_hash]
    );
    return rows.length ? new EmailVerification(rows[0]) : null;
  }

  async markUsed(id) {
    const now = new Date();
    await this.updateById(id, { used_at: now });

    const updated = await this.findById(id);
    return updated ? new EmailVerification(updated) : null;
  }

  async findByUserEmailId(user_email_id) {
    const rows = await this.findAll({ user_email_id });
    return rows.map(row => new EmailVerification(row));
  }

  async createToken(data) {
    const row = await this.create(data);
    return new EmailVerification(row);
  }

  async deleteToken(id) {
    return await this.deleteById(id);
  }
}
