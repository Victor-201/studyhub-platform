import { BaseRepository } from "./BaseRepository.js";
import OutboxEvent from "../models/OutboxEvent.js";

export default class OutboxRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "outbox_events");
  }

  async pushEvent({ aggregate_type, aggregate_id, event_type, routing_key, payload }) {
    const id = crypto.randomUUID();
    const data = {
      id,
      aggregate_type,
      aggregate_id,
      event_type,
      routing_key,
      payload: JSON.stringify(payload),
      status: "pending",
      created_at: new Date(),
    };
    await this.create(data);
    return new OutboxEvent(data);
  }

  async markPublished(id) {
    await this.updateById(id, { status: "published", published_at: new Date() });
    const row = await this.findById(id);
    return row ? new OutboxEvent(row) : null;
  }

  async findPending({ limit = 50 } = {}) {
    const sql = `SELECT * FROM ${this.table} WHERE status='pending' ORDER BY created_at ASC LIMIT ?`;
    const [rows] = await this.pool.query(sql, [limit]);
    return rows.map(r => new OutboxEvent(r));
  }
}
