import { BaseRepository } from "./BaseRepository.js";
import OAuthAccount from "../models/OAuthAccount.js";

export class OAuthAccountRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "oauth_accounts");
  }

  async linkAccount(data) {
    const row = await this.create(data);
    return new OAuthAccount(row);
  }

  async find(provider, provider_user_id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE provider = ? AND provider_user_id = ? LIMIT 1`,
      [provider, provider_user_id]
    );
    return rows.length ? new OAuthAccount(rows[0]) : null;
  }

  async findByUserId(user_id) {
    const rows = await this.findAll({ user_id });
    return rows.map(row => new OAuthAccount(row));
  }

  async unlinkAccount(id) {
    return await this.deleteById(id);
  }
}
