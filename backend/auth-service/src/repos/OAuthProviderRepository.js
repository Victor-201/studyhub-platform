import { BaseRepository } from "./BaseRepository.js";
import OAuthProvider from "../models/OAuthProvider.js";

export class OAuthProviderRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "oauth_providers");
  }

  async findByName(name) {
    const [rows] = await this.pool.query(
      `SELECT * FROM oauth_providers WHERE name = ? LIMIT 1`,
      [name]
    );
    return rows[0] ? new OAuthProvider(rows[0]) : null;
  }

  async create(data) {
    const result = await super.create(data);
    return new OAuthProvider({ ...data, id: result.insertId });
  }
}
