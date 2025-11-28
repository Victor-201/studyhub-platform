import { BaseRepository } from "./BaseRepository.js";
import EmailVerification from "../models/EmailVerification.js";

export class EmailVerificationRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "email_verifications");
  }

  async findByHash(hash) {
    const [rows] = await this.pool.query(
      `SELECT * FROM email_verifications WHERE token_hash = ? AND used_at IS NULL LIMIT 1`,
      [hash]
    );
    return rows.length ? new EmailVerification(rows[0]) : null;
  }

  async markUsed(id) {
    const now = new Date();
    await this.updateById(id, { used_at: now });
    
    const updatedRow = await this.findById(id);
    return updatedRow ? new EmailVerification(updatedRow) : null;
  }

  async findByUserId(userId) {
    const rows = await this.findAll({ user_id: userId });
    return rows.map(row => new EmailVerification(row));
  }
}
