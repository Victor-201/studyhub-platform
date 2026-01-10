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

  async findAllForAdmin() {
    const [rows] = await this.pool.query(`
    SELECT 
      u.id,
      u.user_name,
      u.status,
      u.last_login_at,
      u.created_at,
      u.updated_at,
      ue.email AS primary_email,
      GROUP_CONCAT(r.name) AS roles
    FROM users u
    LEFT JOIN user_emails ue 
      ON ue.user_id = u.id AND ue.type = 'primary'
    LEFT JOIN user_roles ur 
      ON ur.user_id = u.id AND ur.revoked_at IS NULL
    LEFT JOIN roles r 
      ON r.id = ur.role_id
    GROUP BY u.id, ue.email
    ORDER BY u.created_at DESC
  `);
    return rows.map((row) => ({
      id: row.id,
      user_name: row.user_name,
      status: row.status,
      last_login_at: row.last_login_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      email: row.primary_email,
      roles: row.roles ? row.roles.split(",") : [],
    }));
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
