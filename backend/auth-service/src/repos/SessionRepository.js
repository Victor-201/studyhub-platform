import { BaseRepository } from "./BaseRepository.js";
import Session from "../models/Session.js";

export class SessionRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "sessions");
  }

  async createSession(data) {
    const row = await this.create(data);
    return new Session(row);
  }

  async findById(id) {
    const row = await super.findById(id);
    return row ? new Session(row) : null;
  }

  async findByUserId(userId) {
    const rows = await this.findAll({ user_id: userId });
    return rows.map(row => new Session(row));
  }

  async findByRefreshTokenHash(refreshTokenHash) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE refresh_token_hash = ? LIMIT 1`,
      [refreshTokenHash]
    );
    return rows.length ? new Session(rows[0]) : null;
  }

  async updateSession(id, updateData) {
    await this.updateById(id, updateData);
    const updated = await this.findById(id);
    return updated ? new Session(updated) : null;
  }

  async revokeSession(id) {
    const now = new Date();
    await this.updateById(id, { revoked_at: now });
    const updated = await this.findById(id);
    return updated ? new Session(updated) : null;
  }

  async deleteSession(id) {
    return await this.deleteById(id);
  }
}
