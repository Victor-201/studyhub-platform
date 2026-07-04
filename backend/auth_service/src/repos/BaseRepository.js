export class BaseRepository {
  constructor(pool, table) {
    this.pool = pool;
    this.table = table;
  }

  #placeholders(start, count) {
    return Array.from({ length: count }, (_, i) => `$${start + i}`).join(", ");
  }

  #formatValue(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data).map(v => this.#formatValue(v));
    const cols = keys.join(",");
    const placeholders = this.#placeholders(1, keys.length);
    const sql = `INSERT INTO ${this.table} (${cols}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await this.pool.query(sql, values);
    return rows[0];
  }

  async findById(id) {
    const { rows } = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE id = $1 LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  async findAll(where = {}, orderBy = "created_at DESC") {
    let sql = `SELECT * FROM ${this.table}`;
    const values = [];
    const conditions = [];
    let idx = 1;

    for (const key in where) {
      conditions.push(`${key} = $${idx++}`);
      values.push(where[key]);
    }

    if (conditions.length) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += ` ORDER BY ${orderBy}`;

    const { rows } = await this.pool.query(sql, values);
    return rows;
  }

  async updateById(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data).map(v => this.#formatValue(v));
    const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const sql = `UPDATE ${this.table} SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`;
    const { rows } = await this.pool.query(sql, [...values, id]);
    return rows[0] || null;
  }

  async deleteById(id) {
    const { rowCount } = await this.pool.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    return rowCount > 0;
  }
}
