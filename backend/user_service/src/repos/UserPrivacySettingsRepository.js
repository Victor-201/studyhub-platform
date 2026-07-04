import { BaseRepository } from "./BaseRepository.js";
import UserPrivacySettings from "../models/UserPrivacySettings.js";

export class UserPrivacySettingsRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_privacy_settings");
  }

  async createSettings(data) {
    return super.create(data);
  }

  async findByUserId(user_id) {
    const { rows } = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE user_id = $1`,
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
    const s =
      settings instanceof UserPrivacySettings
        ? settings.toPlainObject()
        : settings;

    const allowMessages = s.allow_messages ?? "everyone";

    await this.pool.query(
      `INSERT INTO ${this.table} (user_id, show_full_name, show_bio, show_gender, show_birthday, show_location, show_avatar, show_profile, allow_messages, allow_tagging)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (user_id) DO UPDATE SET
         show_full_name = EXCLUDED.show_full_name,
         show_bio = EXCLUDED.show_bio,
         show_gender = EXCLUDED.show_gender,
         show_birthday = EXCLUDED.show_birthday,
         show_location = EXCLUDED.show_location,
         show_avatar = EXCLUDED.show_avatar,
         show_profile = EXCLUDED.show_profile,
         allow_messages = EXCLUDED.allow_messages,
         allow_tagging = EXCLUDED.allow_tagging`,
      [
        s.user_id,
        s.show_full_name ?? 1,
        s.show_bio ?? 1,
        s.show_gender ?? 1,
        s.show_birthday ?? 0,
        s.show_location ?? 1,
        s.show_avatar ?? 1,
        s.show_profile ?? 1,
        allowMessages,
        s.allow_tagging ?? 1,
      ]
    );

    return this.findByUserId(s.user_id);
  }
}
