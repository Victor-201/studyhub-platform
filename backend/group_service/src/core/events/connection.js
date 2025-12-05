import amqp from 'amqplib';
import env from '../../config/env.js';

let connection = null;
let channel = null;
const EXCHANGE = env.RABBITMQ_EXCHANGE || 'studyhub_exchange';

export async function initRabbitConnection() {
  if (connection && channel) return { connection, channel };

  connection = await amqp.connect(env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, 'direct', { durable: true });

  console.log('[RABBIT] Connected & Exchange Ready');
  return { connection, channel };
}

export function getChannel() {
  if (!channel) throw new Error('[RABBIT] Channel not initialized');
  return channel;
}

export { EXCHANGE };
