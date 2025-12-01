import { BaseRepository } from "./BaseRepository.js";
import OAuthProvider from "../models/OAuthProvider.js";

export class OAuthProviderRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "oauth_providers");
  }

  async findByName(name) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE name = ? LIMIT 1`,
      [name]
    );
    return rows.length ? new OAuthProvider(rows[0]) : null;
  }

  async createProvider(data) {
    const row = await this.create(data);
    return new OAuthProvider(row);
  }

  async findAllProviders() {
    const rows = await this.findAll();
    return rows.map(row => new OAuthProvider(row));
  }

  async updateProvider(id, data) {
    await this.updateById(id, data);
    const updated = await this.findById(id);
    return updated ? new OAuthProvider(updated) : null;
  }

  async deleteProvider(id) {
    return await this.deleteById(id);
  }
}
