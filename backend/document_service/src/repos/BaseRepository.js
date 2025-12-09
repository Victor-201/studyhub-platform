export class BaseRepository {
  constructor(pool, table) {
    this.pool = pool;
    this.table = table;
  }

  #formatValue(value) {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 19).replace("T", " ");
    }
    return value;
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data).map(v => this.#formatValue(v));

    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(",");

    const sql = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders})`;
    await this.pool.query(sql, values);
    return data;
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  async findAll(where = {}, orderBy = "created_at DESC") {
    let sql = `SELECT * FROM ${this.table}`;
    const values = [];
    const conditions = [];

    for (const key in where) {
      conditions.push(`${key} = ?`);
      values.push(where[key]);
    }

    if (conditions.length) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += ` ORDER BY ${orderBy}`;

    const [rows] = await this.pool.query(sql, values);
    return rows;
  }

  async updateById(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data).map(v => this.#formatValue(v));
    const setString = keys.map((key) => `${key} = ?`).join(", ");

    const sql = `UPDATE ${this.table} SET ${setString} WHERE id = ?`;
    await this.pool.query(sql, [...values, id]);
    return true;
  }

  async deleteById(id) {
    await this.pool.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    return true;
  }
}
