export class OutboxService {
  /**
   * @param {Object} deps
   * @param {any} deps.outboxRepo
   */
  constructor({ outboxRepo }) {
    this.outboxRepo = outboxRepo;
  }

  async pushEvent({ aggregate_type, aggregate_id, event_type, routing_key, payload }) {
    return this.outboxRepo.pushEvent({ aggregate_type, aggregate_id, event_type, routing_key, payload });
  }

  async markPublished(id) {
    return this.outboxRepo.markPublished(id);
  }

  async getPendingEvents(limit = 50) {
    return this.outboxRepo.findPending({ limit });
  }
}
