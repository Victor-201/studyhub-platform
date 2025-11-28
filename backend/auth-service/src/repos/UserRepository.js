import { BaseRepository } from "./BaseRepository.js";
import User from "../models/User.js";

export class UserRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "users");
  }

  async findById(id) {
    const row = await super.findById(id);
    return row ? new User(row) : null;
  }

    async findByUserName(userName) {
    const rows = await this.findAll({ user_name: userName });
    return rows.length ? rows[0] : null;
  }

  async findAll(where = {}, orderBy = "created_at DESC") {
    const rows = await super.findAll(where, orderBy);
    return rows.map(row => new User(row));
  }

  async create(data) {
    const row = await super.create(data);
    return new User(row);
  }

  async updateById(id, data) {
    await super.updateById(id, data);
    return this.findById(id);
  }

  async findByEmail(email) {
    const rows = await this.findAll({ email });
    return rows.length ? rows[0] : null;
  }
}
