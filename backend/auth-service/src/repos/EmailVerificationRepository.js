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
    await this.updateById(id, { used_at: new Date() });
  }
}
