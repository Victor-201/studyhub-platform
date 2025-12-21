import { getChannel, EXCHANGE } from "./connection.js";
import { RMQ_QUEUES, RMQ_ROUTING_KEYS } from "./queues.js";

export async function bindQueues() {
  const channel = getChannel();

  // Queue chung của Auth Service
  await channel.assertQueue(RMQ_QUEUES.Auth, { durable: true });

  // Bind event user.created
  await channel.bindQueue(
    RMQ_QUEUES.Auth,
    EXCHANGE,
    RMQ_ROUTING_KEYS.AUTH.CREATED
  );

  // Bind event user.deleted
  await channel.bindQueue(
    RMQ_QUEUES.Auth,
    EXCHANGE,
    RMQ_ROUTING_KEYS.AUTH.DELETED
  );

  console.log("[RABBIT] Queues bound to exchange");
}
