import { BaseRepository } from "./BaseRepository.js";
import Session from "../models/Session.js";

export class SessionRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "sessions");
  }

  async findByRefreshTokenHash(hash) {
    const [rows] = await this.pool.query(
      `SELECT * FROM sessions WHERE refresh_token_hash = ? LIMIT 1`,
      [hash]
    );
    return rows.length ? new Session(rows[0]) : null;
  }

  async revoke(id) {
    await this.updateById(id, { revoked_at: new Date() });
  }
}
