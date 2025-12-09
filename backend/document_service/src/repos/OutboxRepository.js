import { BaseRepository } from "./BaseRepository.js";
import OutboxEvent from "../models/OutboxEvent.js";
import crypto from "crypto";

export default class OutboxRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "outbox_events");
  }

  async insertEvent(event_type, payload = {}, opts = {}) {
    const row = {
      id: opts.id || crypto.randomUUID(),
      aggregate_type: opts.aggregate_type || opts.aggregateType || "",
      aggregate_id: opts.aggregate_id || opts.aggregateId || "",
      event_type,
      routing_key: opts.routing_key || opts.routingKey || "",
      payload: JSON.stringify(payload),
      status: "pending",
      created_at: new Date(),
      published_at: null,
    };

    await super.create(row);
    return new OutboxEvent(row);
  }

  async findPending(limit = 100) {
    const [rows] = await this.pool.query(
      `SELECT * FROM outbox_events 
       WHERE status='pending' 
       ORDER BY created_at ASC 
       LIMIT ?`,
      [limit]
    );
    return rows.map(r => new OutboxEvent(r));
  }

  async markPublished(id) {
    await this.pool.query(
      `UPDATE outbox_events 
       SET status='published', published_at=? 
       WHERE id=?`,
      [new Date(), id]
    );
    return await super.findById(id);
  }

  async markFailed(id) {
    await this.pool.query(
      `UPDATE outbox_events SET status='failed' WHERE id=?`,
      [id]
    );
    return await super.findById(id);
  }
}
