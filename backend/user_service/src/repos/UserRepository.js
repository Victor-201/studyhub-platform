import { BaseRepository } from "./BaseRepository.js";
import User from "../models/User.js";

export class UserRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "users");
  }

  async createUser(data) {
    const now = new Date();

    const userData = {
      id: data.id,
      display_name: data.display_name,
      full_name: data.full_name || null,
      avatar_url: data.avatar_url || null,
      status: data.status || "offline",
      created_at: data.created_at ? new Date(data.created_at) : now,
      updated_at: now,
    };

    await super.create(userData);
    return new User(userData);
  }

  async findById(id) {
    const row = await super.findById(id);
    return row ? new User(row) : null;
  }

  async findAllUsers(where = {}, orderBy = "created_at DESC") {
    const rows = await super.findAll(where, orderBy);
    return rows.map((row) => new User(row));
  }

  async updateUserById(id, data) {
    data.updated_at = new Date();
    await super.updateById(id, data);
    return this.findById(id);
  }

  async deleteUserById(id) {
    return super.deleteById(id);
  }

  async searchByKeyword(keyword, limit = 5, offset = 0) {
    if (!keyword || keyword.trim() === "") return [];

    const kw = `%${keyword.trim()}%`;

    const sqlName = `
    SELECT *
    FROM public_user_view
    WHERE display_name LIKE ? OR (full_name IS NOT NULL AND full_name LIKE ?)
    ORDER BY display_name ASC
    LIMIT ? OFFSET ?;
  `;
    const [nameRows] = await this.pool.query(sqlName, [
      kw,
      kw,
      Number(limit),
      Number(offset),
    ]);

    if (nameRows.length > 0) {
      return nameRows;
    }

    const sqlInterest = `
    SELECT pu.*
    FROM public_user_view pu
    JOIN user_interests ui ON ui.user_id = pu.user_id
    WHERE ui.interest LIKE ?
    ORDER BY pu.display_name ASC
    LIMIT ? OFFSET ?;
  `;
    const [interestRows] = await this.pool.query(sqlInterest, [
      kw,
      Number(limit),
      Number(offset),
    ]);

    return interestRows;
  }
}
