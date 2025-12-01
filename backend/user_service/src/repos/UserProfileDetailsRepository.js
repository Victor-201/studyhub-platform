import {BaseRepository} from './BaseRepository.js';
import UserProfileDetails from '../models/UserProfileDetails.js';

export class UserProfileDetailsRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'user_profile_details');
  }

  async createProfile(data) {
    return super.create(data);
  }

  async findByUserId(user_id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE user_id=?`,
      [user_id]
    );
    return rows.length ? new UserProfileDetails(rows[0]) : null;
  }

  async updateProfile(user_id, data) {
    await super.updateById(user_id, data);
    return this.findByUserId(user_id);
  }

  async deleteProfile(user_id) {
    return super.deleteById(user_id);
  }

  async upsert(details) {
    await this.pool.query(
      `INSERT INTO ${this.table} (user_id, bio, gender, birthday, country, city)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE bio=VALUES(bio), gender=VALUES(gender),
       birthday=VALUES(birthday), country=VALUES(country), city=VALUES(city)`,
      [details.user_id, details.bio, details.gender, details.birthday, details.country, details.city]
    );
    return this.findByUserId(details.user_id);
  }
}
