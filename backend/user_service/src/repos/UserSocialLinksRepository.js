import { BaseRepository } from "./BaseRepository.js";
import UserSocialLinks from "../models/UserSocialLinks.js";

export class UserSocialLinksRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_social_links");
  }

  async createLink(data) {
    await super.create(data);
    return this.findById(data.id);
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`,
      [id]
    );

    return rows.length ? new UserSocialLinks(rows[0]) : null;
  }

  async findByUserId(user_id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table}
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [user_id]
    );

    return rows.map(row => new UserSocialLinks(row));
  }

  async findByUserAndPlatform(user_id, platform) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table}
       WHERE user_id = ? AND platform = ?
       LIMIT 1`,
      [user_id, platform]
    );

    return rows.length ? new UserSocialLinks(rows[0]) : null;
  }

  async updateLink(id, data) {
    await super.updateById(id, data);
    return this.findById(id);
  }

  async deleteLink(id) {
    return super.deleteById(id);
  }
}
