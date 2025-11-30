import { BaseRepository } from "./BaseRepository.js";
import UserEmail from "../models/UserEmail.js";

export class UserEmailRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_emails");
  }

  async findByEmail(email) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows.length ? new UserEmail(rows[0]) : null;
  }

  async getUserEmails(userId) {
    const rows = await this.findAll({ user_id: userId }, "created_at ASC");
    return rows.map(row => new UserEmail(row));
  }

  async markPrimary(id, userId) {
    await this.pool.query(
      `UPDATE ${this.table} SET type = 'secondary' WHERE user_id = ?`,
      [userId]
    );
    await this.updateById(id, { type: 'primary' });
    const updatedRow = await this.findById(id);
    return updatedRow ? new UserEmail(updatedRow) : null;
  }

  async createEmail(data) {
    const row = await this.create(data);
    return new UserEmail(row);
  }

  async deleteEmail(id) {
    return await this.deleteById(id);
  }
}
