import { BaseRepository } from "./BaseRepository.js";
import OAuthAccount from "../models/OAuthAccount.js";

export class OAuthAccountRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "oauth_accounts");
  }

  async linkAccount(account) {
    await this.create(account);
    return new OAuthAccount(account);
  }

  async find(provider, providerUserId) {
    const [rows] = await this.pool.query(
      `SELECT * FROM oauth_accounts WHERE provider = ? AND provider_user_id = ? LIMIT 1`,
      [provider, providerUserId]
    );
    return rows[0] ? new OAuthAccount(rows[0]) : null;
  }
}
