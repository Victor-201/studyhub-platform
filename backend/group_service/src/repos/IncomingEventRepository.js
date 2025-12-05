import { BaseRepository } from "./BaseRepository.js";
import IncomingEvent from "../models/IncomingEvent.js";

export default class IncomingEventRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "incoming_events");
  }

  async createEvent({ event_source, event_type, payload }) {
    const id = crypto.randomUUID();
    const data = {
      id,
      event_source,
      event_type,
      payload: JSON.stringify(payload),
      created_at: new Date(),
    };
    await this.create(data);
    return new IncomingEvent(data);
  }

  async markConsumed(id) {
    await this.updateById(id, { consumed_at: new Date() });
    const row = await this.findById(id);
    return row ? new IncomingEvent(row) : null;
  }

  async findUnconsumed({ limit = 50 } = {}) {
    const sql = `SELECT * FROM ${this.table} WHERE consumed_at IS NULL ORDER BY created_at ASC LIMIT ?`;
    const [rows] = await this.pool.query(sql, [limit]);
    return rows.map(r => new IncomingEvent(r));
  }
}
