// src/index.js
import { createApp } from "./app.js";
import { connectMongo } from "./config/db.js";
import { env } from "./config/env.js";
import { createSocketServer } from "./socket/socketServer.js";

async function main() {
    console.log("[ChatService] Starting...");

    // Connect to MongoDB
    await connectMongo();

    // Create Express app
    const app = createApp();

    // Start server
    const PORT = env.PORT || 3006;
    const server = app.listen(PORT, () => {
        console.log(`[ChatService] Server running on port ${PORT}`);
        console.log(`[ChatService] Environment: ${env.NODE_ENV}`);
        console.log(`[ChatService] API Prefix: ${env.API_PREFIX}`);
    });

    // Initialize Socket.IO
    const io = createSocketServer(server, app.locals.deps);
    app.locals.io = io;
}

main().catch((err) => {
    console.error("[ChatService] Failed to start:", err);
    process.exit(1);
});
