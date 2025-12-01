import { BaseRepository } from './BaseRepository.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'users');
  }

  async createUser(data) {
    const now = new Date();

    const userData = {
      id: uuidv4(),
      display_name: data.display_name,
      full_name: data.full_name || null,
      avatar_url: data.avatar_url || null,
      status: data.status || 'offline',
      created_at: now,
      updated_at: now
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
    return rows.map(row => new User(row));
  }

  async updateUserById(id, data) {
    data.updated_at = new Date();
    await super.updateById(id, data);
    return this.findById(id);
  }

  async deleteUserById(id) {
    return super.deleteById(id);
  }

  async search({ query, country, interest }) {
    const [rows] = await this.pool.query(
      `CALL sp_search_users(?, ?, ?)`,
      [query || null, country || null, interest || null]
    );

    return rows[0]?.map(row => new User(row)) || [];
  }
}
