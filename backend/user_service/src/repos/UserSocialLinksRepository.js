import {BaseRepository} from './BaseRepository.js';
import UserSocialLinks from '../models/UserSocialLinks.js';

export class UserSocialLinksRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'user_social_links');
  }

  async createLink(data) {
    const id = await super.create(data);
    return this.findById(id);
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );

    return rows.length ? new UserSocialLinks(rows[0]) : null;
  }

  async findByUserId(user_id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id]
    );

    return rows.map(row => new UserSocialLinks(row));
  }

  async updateLink(id, data) {
    await super.updateById(id, data);
    return this.findById(id);
  }

  async deleteLink(id) {
    return super.deleteById(id);
  }
}
