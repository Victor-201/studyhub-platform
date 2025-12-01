import { BaseRepository } from './BaseRepository.js';
import UserInterests from '../models/UserInterests.js';

export class UserInterestsRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'user_interests');
  }

  async findByUserId(user_id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE user_id=?`,
      [user_id]
    );

    return rows.map(row => new UserInterests(row));
  }

  async addInterest(user_id, interest, id) {
    await this.pool.query(
      `INSERT IGNORE INTO ${this.table} (id, user_id, interest) VALUES (?, ?, ?)`,
      [id, user_id, interest]
    );

    return new UserInterests({
      id,
      user_id,
      interest,
      created_at: new Date()
    });
  }

  async removeInterest(user_id, interest) {
    await this.pool.query(
      `DELETE FROM ${this.table} WHERE user_id=? AND interest=?`,
      [user_id, interest]
    );

    return true;
  }

  async deleteById(id) {
    return super.deleteById(id);
  }
}
