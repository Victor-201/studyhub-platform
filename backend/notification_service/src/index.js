// src/index.js
import { createApp } from "./app.js";
import { connectMongo } from "./config/db.js";
import { env } from "./config/env.js";

async function main() {
    console.log("[NotificationService] Starting...");

    // Connect to MongoDB
    await connectMongo();

    // Create Express app
    const app = createApp();

    // Start server
    const PORT = env.PORT || 3005;

    app.listen(PORT, () => {
        console.log(`[NotificationService] Server running on port ${PORT}`);
        console.log(`[NotificationService] Environment: ${env.NODE_ENV}`);
        console.log(`[NotificationService] API Prefix: ${env.API_PREFIX}`);
    });
}

main().catch((err) => {
    console.error("[NotificationService] Failed to start:", err);
    process.exit(1);
});
