import express from "express";
import { ChatController } from "../controllers/ChatController.js";
import { verifyAccessToken } from "../middlewares/auth.js";

/**
 * Create chat routes
 * @param {Object} deps
 * @param {import("../services/ChatService.js").ChatService} deps.chatService
 */
export function createChatRouter({ chatService }) {
    const router = express.Router();
    const controller = new ChatController({ chatService });

    // All routes require authentication
    router.use(verifyAccessToken);

    // =========================
    //     CONVERSATIONS
    // =========================
    router.get("/conversations", controller.getConversations.bind(controller));
    router.get("/conversations/:id", controller.getConversation.bind(controller));
    router.post("/conversations", controller.createConversation.bind(controller));

    // =========================
    //       MESSAGES
    // =========================
    router.get("/conversations/:id/messages", controller.getMessages.bind(controller));
    router.post("/messages", controller.sendMessage.bind(controller));
    router.post("/messages/direct", controller.sendDirectMessage.bind(controller));
    router.delete("/messages/:id", controller.deleteMessage.bind(controller));

    return router;
}
