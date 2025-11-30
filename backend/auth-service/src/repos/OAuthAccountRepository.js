import { BaseRepository } from "./BaseRepository.js";
import OAuthAccount from "../models/OAuthAccount.js";

export class OAuthAccountRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "oauth_accounts");
  }

  async linkAccount(accountData) {
    const row = await this.create(accountData);
    return new OAuthAccount(row);
  }

  async find(provider, providerUserId) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE provider = ? AND provider_user_id = ? LIMIT 1`,
      [provider, providerUserId]
    );
    return rows.length ? new OAuthAccount(rows[0]) : null;
  }

  async findByUserId(userId) {
    const rows = await this.findAll({ user_id: userId });
    return rows.map(row => new OAuthAccount(row));
  }

  async unlinkAccount(id) {
    return await this.deleteById(id);
  }
}
