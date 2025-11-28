import { BaseRepository } from "./BaseRepository.js";
import UserEmail from "../models/UserEmail.js";

export class UserEmailRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_emails");
  }

  async findByEmail(email) {
    const [rows] = await this.pool.query(
      `SELECT * FROM user_emails WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows.length ? new UserEmail(rows[0]) : null;
  }

  async getUserEmails(userId) {
    return this.findAll({ user_id: userId }, "created_at ASC");
  }

  async markPrimary(id, userId) {
    await this.pool.query(
      `UPDATE user_emails SET is_primary = 0 WHERE user_id = ?`,
      [userId]
    );
    await this.updateById(id, { is_primary: 1 });
  }
}
