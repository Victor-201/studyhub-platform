// src/index.js
import env from "./config/env.js";
import { createApp } from "./app.js";
import { initRabbitConnection } from "./core/events/connection.js";

const PORT = env.PORT || 3003;

(async () => {
  try {
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
      console.log(`[Document Service] running on port ${PORT}`);
    });
  } catch (err) {
    console.error("[FATAL] Failed to start Document Service:", err);
    process.exit(1);
  }
})();
