import { BaseRepository } from "./BaseRepository.js";
import EmailVerification from "../models/EmailVerification.js";

export class EmailVerificationRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "email_verifications");
  }

  async findByHash(tokenHash) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE token_hash = ? AND used_at IS NULL LIMIT 1`,
      [tokenHash]
    );
    return rows.length ? new EmailVerification(rows[0]) : null;
  }

  async markUsed(id) {
    const now = new Date();
    await this.updateById(id, { used_at: now });

    const updatedRow = await this.findById(id);
    return updatedRow ? new EmailVerification(updatedRow) : null;
  }

  async findByUserEmailId(userEmailId) {
    const rows = await this.findAll({ user_email_id: userEmailId });
    return rows.map(row => new EmailVerification(row));
  }

  async createToken(tokenData) {
    const row = await this.create(tokenData);
    return new EmailVerification(row);
  }

  async deleteToken(id) {
    return await this.deleteById(id);
  }
}
