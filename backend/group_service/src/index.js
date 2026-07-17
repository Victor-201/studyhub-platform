// src/index.js
import env from "./config/env.js";
import { createApp } from "./app.js";
import { initRabbitConnection } from "./core/events/connection.js";
import { runMigrations } from "./db/migrate.js";

const PORT = env.PORT || 3002;

(async () => {
  try {
    // ===== Run database migrations =====
    await runMigrations();

    // ===== Init RabbitMQ BEFORE starting app =====
    try {
      await initRabbitConnection();
    } catch (err) {
      console.error("[BOOT] RabbitMQ init failed:", err);
    }

    // ===== Create app =====
    const app = createApp();

    // ===== Start HTTP server =====
    app.listen(PORT, () => {
      console.log(`[Group Service] running on port ${PORT}`);
    });
  } catch (err) {
    console.error("[FATAL] Failed to start Group Service:", err);
    process.exit(1);
  }
})();
