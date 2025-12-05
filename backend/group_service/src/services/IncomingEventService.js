export class IncomingEventService {
  /**
   * @param {Object} deps
   * @param {any} deps.incomingRepo
   */
  constructor({ incomingRepo }) {
    this.incomingRepo = incomingRepo;
  }

  async createEvent({ event_source, event_type, payload }) {
    return this.incomingRepo.createEvent({ event_source, event_type, payload });
  }

  async markConsumed(id) {
    return this.incomingRepo.markConsumed(id);
  }

  async getUnconsumed(limit = 50) {
    return this.incomingRepo.findUnconsumed({ limit });
  }
}
