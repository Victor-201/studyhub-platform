// src/server.js
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/db.js";

import { initRabbitConnection } from "./core/events/connection.js";
import { publishPendingEventsLoop } from "./core/events/publish.js";
import OutboxRepository from "./repos/OutboxRepository.js";
import OutboxService from "./services/OutboxService.js";

const PORT = env.PORT || 3000;

async function bootstrap() {
  // 1) Start HTTP app
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[Auth Service] running on port ${PORT}`);
  });

  // 2) Init Rabbit connection
  try {
    await initRabbitConnection();
  } catch (err) {
    console.error("[BOOT] RabbitMQ connection failed:", err);
    // Không throw để server vẫn chạy (tùy yêu cầu bạn có thể exit)
  }

  // 3) Start publish loop (Outbox -> Exchange)
  const outboxRepo = new OutboxRepository(pool);
  const outboxService = new OutboxService({ outboxRepo });

  publishPendingEventsLoop(outboxService, 1000);

  console.log("[BOOT] Auth Service bootstrap finished");
}

bootstrap().catch((err) => {
  console.error("[BOOT] bootstrap failed:", err);
  process.exit(1);
});
