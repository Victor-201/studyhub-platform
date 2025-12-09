import { getChannel, EXCHANGE } from "./connection.js";

/**
 * Publish one event immediately to RabbitMQ
 */
export async function publishEvent(routingKey, payload) {
  const channel = getChannel();

  channel.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );

  console.log(`[RABBIT] Published event: ${routingKey}`, payload);
}

/**
 * Background loop for publishing pending Outbox events
 */
export async function publishPendingEventsLoop(outboxService) {
  console.log("[RABBIT] Starting outbox publish loop...");

  async function loop() {
    try {
      const pendingEvents = await outboxService.getPendingEvents();

      if (pendingEvents.length > 0) {
        for (const evt of pendingEvents) {
          try {
            const payload = typeof evt.payload === "string"
              ? JSON.parse(evt.payload)
              : evt.payload;

            const routing = evt.routing_key || evt.event_type;

            await publishEvent(routing, payload);
            await outboxService.outboxRepo.markPublished(evt.id);

            console.log(`[OUTBOX] Published event ${evt.id}`);
          } catch (err) {
            console.error(`[OUTBOX] Failed event ${evt.id}:`, err);
            await outboxService.outboxRepo.markFailed(evt.id);
          }
        }
      }

    } catch (err) {
      console.error("[OUTBOX] Error in publishing loop:", err);
    }

    // Lặp lại sau 1s
    setTimeout(loop, 1000);
  }

  loop();
}
