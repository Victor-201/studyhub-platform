import { getChannel, EXCHANGE } from "./connection.js";

/**
 * Publish a single event immediately
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
 * Background loop sent from Outbox table
 */
export async function publishPendingEventsLoop(outboxService) {
  console.log("[RABBIT] Starting outbox publish loop...");

  async function loop() {
    try {
      const pending = await outboxService.getPendingEvents();

      for (const evt of pending) {
        await publishEvent(evt.routing_key, evt.payload);

        await outboxService.markAsPublished(evt.id);

        console.log(`[OUTBOX] Published event ${evt.id}`);
      }
    } catch (err) {
      console.error("[OUTBOX] Error in publishing loop:", err);
    }

    // loop again
    setTimeout(loop, 1000);
  }

  loop();
}
