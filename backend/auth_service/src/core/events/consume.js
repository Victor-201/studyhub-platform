import { getChannel } from "./connection.js";

/**
 * Create a consumer for 1 queue
 */
export async function createConsumer(queueName, handler) {
  const channel = getChannel();
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(
    queueName,
    async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;
      const payload = JSON.parse(msg.content.toString());

      try {
        await handler(routingKey, payload);
        channel.ack(msg);
      } catch (err) {
        console.error(`[RABBIT] Consumer error in ${queueName}:`, err);
        channel.nack(msg, false, true); // requeue
      }
    },
    { noAck: false }
  );

  console.log(`[RABBIT] Listening queue: ${queueName}`);
}

/**
 * Initialize all consumers for this microservice
 */
export async function initEventConsumers(deps, incomingEventService) {
  console.log("[RABBIT] Initializing consumers...");

  // ví dụ queue
  await createConsumer("group.user-updated", async (routingKey, payload) => {
    console.log("[EVENT] user-updated", payload);
    await incomingEventService.saveEvent(routingKey, payload);

    // service xử lý nếu cần
    // deps.groupService.handleUserUpdated(payload)
  });

  await createConsumer("group.user-deleted", async (routingKey, payload) => {
    console.log("[EVENT] user-deleted", payload);
    await incomingEventService.saveEvent(routingKey, payload);
  });

  console.log("[RABBIT] Consumers initialized");
}
