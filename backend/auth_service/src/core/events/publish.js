// src/core/events/publish.js
import { getChannel, EXCHANGE } from "./connection.js";

/**
 * Publish 1 event ngay lập tức
 */
export async function publishEvent(routingKey, payload) {
  const channel = getChannel();

  const buffer = Buffer.from(JSON.stringify(payload));

  const ok = channel.publish(EXCHANGE, routingKey, buffer, {
    persistent: true,
  });

  if (!ok) {
    // publish returned false -> internal buffer full; log for visibility
    console.warn("[RABBIT] publish returned false (internal buffer full)");
  }

  console.log(`[RABBIT] Published event: ${routingKey}`, payload);
}

/**
 * Background loop: đọc các event pending từ OutboxService và publish
 * outboxService phải implement getPendingEvents() và outboxRepo.markPublished/markFailed
 */
export async function publishPendingEventsLoop(outboxService, intervalMs = 1000) {
  console.log("[RABBIT] Starting outbox publish loop...");

  let running = true;

  async function loop() {
    if (!running) return;

    try {
      const pendingEvents = await outboxService.getPendingEvents();

      if (pendingEvents && pendingEvents.length > 0) {
        for (const evt of pendingEvents) {
          try {
            const payload = typeof evt.payload === "string" ? JSON.parse(evt.payload) : evt.payload;
            const routing = evt.routing_key || evt.event_type;

            await publishEvent(routing, payload);
            await outboxService.outboxRepo.markPublished(evt.id);

            console.log(`[OUTBOX] Published event ${evt.id}`);
          } catch (err) {
            console.error(`[OUTBOX] Failed event ${evt.id}:`, err);
            try {
              await outboxService.outboxRepo.markFailed(evt.id);
            } catch (err2) {
              console.error(`[OUTBOX] markFailed error for ${evt.id}:`, err2);
            }
          }
        }
      }
    } catch (err) {
      console.error("[OUTBOX] Error in publishing loop:", err);
    } finally {
      setTimeout(loop, intervalMs);
    }
  }

  loop();

  return {
    stop() {
      running = false;
    },
  };
}
