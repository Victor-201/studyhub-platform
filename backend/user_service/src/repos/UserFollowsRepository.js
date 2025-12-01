import { BaseRepository } from './BaseRepository.js';
import UserFollows from '../models/UserFollows.js';

export class UserFollowsRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'user_follows');
  }

  async follow(follower_id, target_user_id) {
    await this.pool.query(
      `INSERT IGNORE INTO ${this.table} (follower_id, target_user_id) VALUES (?, ?)`,
      [follower_id, target_user_id]
    );

    return new UserFollows({
      follower_id,
      target_user_id,
      created_at: new Date(),
    });
  }

  async unfollow(follower_id, target_user_id) {
    await this.pool.query(
      `DELETE FROM ${this.table} WHERE follower_id=? AND target_user_id=?`,
      [follower_id, target_user_id]
    );

    return true;
  }

  async getFollowCounts(user_id) {
    const [rows] = await this.pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM ${this.table} WHERE follower_id=?) AS following,
        (SELECT COUNT(*) FROM ${this.table} WHERE target_user_id=?) AS followers`,
      [user_id, user_id]
    );

    return rows[0];
  }

  async getFriends(user_id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM user_friends WHERE user_a=? OR user_b=?`,
      [user_id, user_id]
    );

    return rows;
  }

  async deleteFollow(follower_id, target_user_id) {
    return this.unfollow(follower_id, target_user_id);
  }
}
