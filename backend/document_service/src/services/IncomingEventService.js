export default class IncomingEventService {
  constructor({ incomingRepo, handlers = {}, logger = console }) {
    this.incomingRepo = incomingRepo;
    this.handlers = handlers;
    this.logger = logger;
  }

  async consumeUnprocessed(limit = 50) {
    const items = await this.incomingRepo.getUnprocessed(limit);

    for (const item of items) {
      try {
        const payload = typeof item.payload === "string"
          ? JSON.parse(item.payload)
          : item.payload;

        if (this.handlers[item.event_type]) {
          await this.handlers[item.event_type](payload);
        }

        await this.incomingRepo.markConsumed(item.id);
      } catch (err) {
        this.logger.error("IncomingEventService.consume error:", err.message);
      }
    }
  }
}
