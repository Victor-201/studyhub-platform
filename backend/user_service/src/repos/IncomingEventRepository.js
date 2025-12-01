import {BaseRepository} from './BaseRepository.js';
import IncomingEvent from '../models/IncomingEvent.js';

export class IncomingEventRepository extends BaseRepository {
  constructor(pool) {
    super(pool, 'incoming_events');
  }

  async findById(id) {
    const row = await super.findById(id);
    return row ? new IncomingEvent(row) : null;
  }

  async markConsumed(id) {
    await this.pool.query(
      `UPDATE ${this.table} SET consumed_at=NOW() WHERE id=?`,
      [id]
    );
  }

  async deleteById(id) {
    return super.deleteById(id);
  }

  async createEvent(data) {
    return super.create(data);
  }
}
