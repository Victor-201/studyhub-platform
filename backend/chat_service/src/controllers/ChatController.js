/**
 * ChatController
 * Handles HTTP requests for chat operations
 */
export class ChatController {
    /**
     * @param {Object} deps
     * @param {import("../services/ChatService.js").ChatService} deps.chatService
     */
    constructor({ chatService }) {
        this.chatService = chatService;
    }

    /**
     * GET /conversations - Get user's conversations
     */
    async getConversations(req, res) {
        try {
            const user_id = req.user.id;
            const { limit = 50, offset = 0 } = req.query;

            const conversations = await this.chatService.getConversations(user_id, {
                limit: Number(limit),
                offset: Number(offset),
            });

            res.json({ success: true, data: conversations });
        } catch (err) {
            res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }

    /**
     * GET /conversations/:id - Get conversation detail
     */
    async getConversation(req, res) {
        try {
            const user_id = req.user.id;
            const { id } = req.params;

            const conversation = await this.chatService.getConversation(id, user_id);

            res.json({ success: true, data: conversation });
        } catch (err) {
            res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }

    /**
     * GET /conversations/:id/messages - Get messages in conversation
     */
    async getMessages(req, res) {
        try {
            const user_id = req.user.id;
            const { id } = req.params;
            const { limit = 50, before } = req.query;

            const messages = await this.chatService.getMessages(id, user_id, {
                limit: Number(limit),
                before: before ? new Date(before) : null,
            });

            res.json({ success: true, data: messages });
        } catch (err) {
            res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }

    /**
     * POST /conversations - Create or get direct conversation
     */
    async createConversation(req, res) {
        try {
            const user_id = req.user.id;
            const { type, target_id, participant_ids } = req.body;

            let conversation;

            if (type === "direct") {
                if (!target_id) {
                    return res.status(400).json({
                        success: false,
                        message: "target_id required for direct conversation",
                    });
                }
                conversation = await this.chatService.getOrCreateDirectConversation(user_id, target_id);
            } else if (type === "group") {
                if (!target_id) {
                    return res.status(400).json({
                        success: false,
                        message: "target_id (group_id) required for group conversation",
                    });
                }
                conversation = await this.chatService.getOrCreateGroupConversation(
                    target_id,
                    participant_ids || [user_id]
                );
            } else {
                return res.status(400).json({
                    success: false,
                    message: "type must be 'direct' or 'group'",
                });
            }

            res.status(201).json({ success: true, data: conversation });
        } catch (err) {
            res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }

    /**
     * POST /messages - Send a message
     */
    async sendMessage(req, res) {
        try {
            const sender_id = req.user.id;
            const { conversation_id, content, type = "text" } = req.body;

            if (!conversation_id || !content) {
                return res.status(400).json({
                    success: false,
                    message: "conversation_id and content are required",
                });
            }

            const message = await this.chatService.sendMessage({
                sender_id,
                conversation_id,
                content,
                type,
            });

            res.status(201).json({ success: true, data: message });
        } catch (err) {
            res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }

    /**
     * POST /messages/direct - Send direct message to user
     */
    async sendDirectMessage(req, res) {
        try {
            const sender_id = req.user.id;
            const { receiver_id, content, type = "text" } = req.body;

            if (!receiver_id || !content) {
                return res.status(400).json({
                    success: false,
                    message: "receiver_id and content are required",
                });
            }

            const message = await this.chatService.sendDirectMessage({
                sender_id,
                receiver_id,
                content,
                type,
            });

            res.status(201).json({ success: true, data: message });
        } catch (err) {
            res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }

    /**
     * DELETE /messages/:id - Delete a message
     */
    async deleteMessage(req, res) {
        try {
            const user_id = req.user.id;
            const { id } = req.params;

            await this.chatService.deleteMessage(id, user_id);

            res.json({ success: true, message: "Message deleted" });
        } catch (err) {
            res.status(err.status || 500).json({ success: false, message: err.message });
        }
    }
}
