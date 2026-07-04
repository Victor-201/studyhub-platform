import { BaseRepository } from './BaseRepository.js';
import UserProfileDetails from '../models/UserProfileDetails.js';

export class UserProfileDetailsRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'user_profile_details');
  }

  async createProfile(data) {
    return super.create(data);
  }

  async findByUserId(user_id) {
    const { rows } = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE user_id = $1`,
      [user_id]
    );
    return rows.length ? new UserProfileDetails(rows[0]) : null;
  }

  // =====================================================
  // OWNER: full profile (ignore privacy)
  // =====================================================
  async findOwnerProfile(userId) {
    const { rows } = await this.pool.query(`
      SELECT
        u.id,
        u.display_name,
        u.full_name,
        u.avatar_url,
        u.status,
        u.created_at,
        u.updated_at,

        upd.bio,
        upd.gender,
        upd.birthday,
        upd.country,
        upd.city,

        ups.show_full_name,
        ups.show_bio,
        ups.show_gender,
        ups.show_birthday,
        ups.show_location,
        ups.show_avatar,
        ups.show_profile,
        ups.allow_messages,
        ups.allow_tagging,

        COALESCE((
          SELECT json_agg(
            json_build_object(
              'id', usl.id,
              'platform', usl.platform,
              'url', usl.url
            )
          )
          FROM user_social_links usl
          WHERE usl.user_id = u.id
        ), '[]'::json) AS social_links,

        COALESCE((
          SELECT json_agg(ui.interest)
          FROM user_interests ui
          WHERE ui.user_id = u.id
        ), '[]'::json) AS interests

      FROM users u
      LEFT JOIN user_profile_details upd ON upd.user_id = u.id
      LEFT JOIN user_privacy_settings ups ON ups.user_id = u.id
      WHERE u.id = $1
      LIMIT 1
    `, [userId]);

    return rows[0] || null;
  }

  // =====================================================
  // NON-OWNER: respect privacy
  // =====================================================
  async findPublicProfile(user_id) {
    const { rows } = await this.pool.query(`
      SELECT
        pu.user_id,
        pu.display_name,
        pu.full_name,
        pu.avatar_url,
        pu.bio,
        pu.gender,
        pu.birthday,
        pu.country,
        pu.city,
        pu.status,

        COALESCE((
          SELECT json_agg(
            json_build_object(
              'id', usl.id,
              'platform', usl.platform,
              'url', usl.url
            )
          )
          FROM user_social_links usl
          WHERE usl.user_id = pu.user_id
        ), '[]'::json) AS social_links,

        COALESCE((
          SELECT json_agg(ui.interest)
          FROM user_interests ui
          WHERE ui.user_id = pu.user_id
        ), '[]'::json) AS interests

      FROM public_user_view pu
      WHERE pu.user_id = $1
      LIMIT 1
    `, [user_id]);

    return rows[0] || null;
  }

  async upsert(details) {
    await this.pool.query(
      `INSERT INTO ${this.table} (user_id, bio, gender, birthday, country, city)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         bio = EXCLUDED.bio,
         gender = EXCLUDED.gender,
         birthday = EXCLUDED.birthday,
         country = EXCLUDED.country,
         city = EXCLUDED.city`,
      [
        details.user_id,
        details.bio,
        details.gender,
        details.birthday,
        details.country,
        details.city,
      ]
    );

    return this.findByUserId(details.user_id);
  }
}
