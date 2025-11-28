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
    const now = new Date();
    await this.updateById(id, { revoked_at: now });
    const updatedRow = await this.findById(id);
    return updatedRow ? new Session(updatedRow) : null;
  }

  async findByUserId(userId) {
    const rows = await this.findAll({ user_id: userId });
    return rows.map(row => new Session(row));
  }
}
