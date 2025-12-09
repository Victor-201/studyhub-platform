import { publishEvent } from "../core/events/publish.js";

export default class OutboxService {
  constructor({ outboxRepo, eventPublisher = publishEvent, logger = console }) {
    this.outboxRepo = outboxRepo;
    this.eventPublisher = eventPublisher;
    this.logger = logger;
  }

  // Chỉ return danh sách pending
  async getPendingEvents(limit = 50) {
    return await this.outboxRepo.findPending(limit);
  }
}
