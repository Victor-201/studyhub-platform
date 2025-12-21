import { getChannel } from "./connection.js";
import { RMQ_QUEUES, RMQ_ROUTING_KEYS } from "./queues.js";

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
        console.error(`[RABBIT] Consumer error (${queueName}):`, err);
        channel.nack(msg, false, true);
      }
    },
    { noAck: false }
  );

  console.log(`[RABBIT] Listening queue: ${queueName}`);
}

export async function initEventConsumers(incomingEventService) {
  await createConsumer(RMQ_QUEUES.Auth, async (routingKey, payload) => {
    console.log(`[EVENT] ${routingKey}`, payload);

    // Save event to DB
    await incomingEventService.saveEvent(routingKey, payload, "auth");

    switch (routingKey) {
      case RMQ_ROUTING_KEYS.AUTH.CREATED:
        await incomingEventService.handlers["user.created"](payload);
        break;

      case RMQ_ROUTING_KEYS.AUTH.DELETED:
        await incomingEventService.handlers["user.deleted"](payload);
        break;
    }
  });

  console.log("[RABBIT] Consumers initialized");
}
