import { BaseRepository } from "./BaseRepository.js";
import User from "../models/User.js";

export class UserRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "users");
  }

  async findById(id) {
    const row = await super.findById(id);
    return row ? new User(row) : null;
  }

  async findByUserName(user_name) {
    const users = await this.findAll({ user_name });
    return users.length ? users[0] : null;
  }

  async findByEmail(email) {
    const [rows] = await this.pool.query(
      `SELECT u.* 
       FROM users u
       JOIN user_emails ue ON ue.user_id = u.id
       WHERE ue.email = ? LIMIT 1`,
      [email]
    );
    return rows.length ? new User(rows[0]) : null;
  }

  async findAll(where = {}, orderBy = "created_at DESC") {
    const rows = await super.findAll(where, orderBy);
    return rows.map((row) => new User(row));
  }

  async create(data) {
    const row = await super.create(data);
    return new User(row);
  }

  async countByStatus(status) {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) as count FROM users WHERE status = ?`,
      [status]
    );
    return rows[0].count;
  }

  async updateById(id, data) {
    await super.updateById(id, data);
    const updated = await this.findById(id);
    return updated;
  }

  async deleteById(id) {
    return await super.deleteById(id);
  }
}
