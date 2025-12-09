import { BaseRepository } from "./BaseRepository.js";
import IncomingEvent from "../models/IncomingEvent.js";
import crypto from "crypto";

export default class IncomingEventRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "incoming_events");
  }

  async recordEvent({ id = null, event_source, event_type, payload }) {
    const row = {
      id: id || crypto.randomUUID(),
      event_source,
      event_type,
      payload: JSON.stringify(payload),
      consumed_at: null,
      created_at: new Date(),
    };

    await super.create(row);
    return new IncomingEvent(row);
  }

  async getUnconsumed(limit = 50) {
    const [rows] = await this.pool.query(
      `SELECT * FROM incoming_events 
       WHERE consumed_at IS NULL 
       ORDER BY created_at ASC 
       LIMIT ?`,
      [limit]
    );

    return rows.map(r => new IncomingEvent(r));
  }

  async markConsumed(id) {
    await this.pool.query(
      `UPDATE incoming_events SET consumed_at=? WHERE id=?`,
      [new Date(), id]
    );
    return new IncomingEvent(await super.findById(id));
  }

  async clearConsumedBefore(date) {
    await this.pool.query(
      `DELETE FROM incoming_events 
       WHERE consumed_at IS NOT NULL AND consumed_at < ?`,
      [date]
    );
  }
}
