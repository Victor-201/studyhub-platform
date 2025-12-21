// src/core/events/connection.js
import amqp from "amqplib";
import { env } from "../../config/env.js";

let connection = null;
let channel = null;
export const EXCHANGE = env.RABBITMQ_EXCHANGE || "studyhub_exchange";

/**
 * Khởi tạo kết nối RabbitMQ (singleton)
 */
export async function initRabbitConnection() {
  if (connection && channel) return { connection, channel };

  connection = await amqp.connect(env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, "direct", { durable: true });

  console.log("[RABBIT] Connected & Exchange Ready");
  return { connection, channel };
}

/**
 * Lấy channel đã khởi tạo
 */
export function getChannel() {
  if (!channel) throw new Error("[RABBIT] Channel not initialized");
  return channel;
}

/**
 * Set channel (testing / hot-replace) - không bắt buộc, nhưng tiện debug
 */
export function _setChannel(ch) {
  channel = ch;
}
