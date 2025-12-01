import {BaseRepository} from './BaseRepository.js';
import UserPrivacySettings from '../models/UserPrivacySettings.js';

export class UserPrivacySettingsRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'user_privacy_settings');
  }

  async createSettings(data) {
    return super.create(data);
  }

  async findByUserId(user_id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE user_id = ?`,
      [user_id]
    );

    return rows.length ? new UserPrivacySettings(rows[0]) : null;
  }

  async updateSettings(user_id, data) {
    await super.updateById(user_id, data);
    return this.findByUserId(user_id);
  }

  async deleteSettings(user_id) {
    return super.deleteById(user_id);
  }

  async upsert(settings) {
    const s = settings instanceof UserPrivacySettings
      ? settings.toPlainObject()
      : settings;

    await this.pool.query(
      `CALL sp_upsert_privacy(?,?,?,?,?,?,?,?,?,?)`,
      [
        s.user_id,
        s.show_full_name,
        s.show_bio,
        s.show_gender,
        s.show_birthday,
        s.show_location,
        s.show_avatar,
        s.show_profile,
        s.allow_messages,
        s.allow_tagging,
      ]
    );

    return this.findByUserId(s.user_id);
  }
}
