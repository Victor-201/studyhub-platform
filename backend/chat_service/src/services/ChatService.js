/**
 * ChatService
 * Business logic for chat operations
 */
export class ChatService {
    /**
     * @param {Object} deps
     * @param {import("../repos/ConversationRepository.js").ConversationRepository} deps.conversationRepo
     * @param {import("../repos/MessageRepository.js").MessageRepository} deps.messageRepo
     */
    constructor({ conversationRepo, messageRepo }) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
    }

    /**
     * Get all conversations for a user
     */
    async getConversations(user_id, { limit = 50, offset = 0 } = {}) {
        return this.conversationRepo.findByParticipant(user_id, { limit, offset });
    }

    /**
     * Get or create a direct conversation between two users
     */
    async getOrCreateDirectConversation(user_id, target_user_id) {
        // Check if conversation already exists
        let conversation = await this.conversationRepo.findDirectConversation(
            user_id,
            target_user_id
        );

        if (!conversation) {
            // Create new direct conversation
            conversation = await this.conversationRepo.create({
                type: "direct",
                participants: [user_id, target_user_id],
            });
        }

        return conversation;
    }

    /**
     * Get or create a group conversation
     */
    async getOrCreateGroupConversation(group_id, participant_ids = []) {
        let conversation = await this.conversationRepo.findGroupConversation(group_id);

        if (!conversation) {
            conversation = await this.conversationRepo.create({
                type: "group",
                target_id: group_id,
                participants: participant_ids,
            });
        }

        return conversation;
    }

    /**
     * Get messages in a conversation
     */
    async getMessages(conversation_id, user_id, { limit = 50, before = null } = {}) {
        // Verify user is a participant
        const conversation = await this.conversationRepo.findById(conversation_id);

        if (!conversation) {
            throw this._createError("Conversation not found", 404);
        }

        if (!conversation.participants.includes(user_id)) {
            throw this._createError("Unauthorized", 403);
        }

        return this.messageRepo.findByConversation(conversation_id, { limit, before });
    }

    /**
     * Send a message
     */
    async sendMessage({ sender_id, conversation_id, content, type = "text" }) {
        // Verify sender is a participant
        const conversation = await this.conversationRepo.findById(conversation_id);

        if (!conversation) {
            throw this._createError("Conversation not found", 404);
        }

        if (!conversation.participants.includes(sender_id)) {
            throw this._createError("Unauthorized", 403);
        }

        // Create message
        const message = await this.messageRepo.create({
            sender_id,
            conversation_id,
            content,
            type,
        });

        // Update last message in conversation
        await this.conversationRepo.updateLastMessage(conversation_id, message._id);

        return message;
    }

    /**
     * Send message to a user (direct chat)
     */
    async sendDirectMessage({ sender_id, receiver_id, content, type = "text" }) {
        const conversation = await this.getOrCreateDirectConversation(sender_id, receiver_id);

        return this.sendMessage({
            sender_id,
            conversation_id: conversation._id,
            content,
            type,
        });
    }

    /**
     * Send message to a group
     */
    async sendGroupMessage({ sender_id, group_id, content, type = "text" }) {
        const conversation = await this.conversationRepo.findGroupConversation(group_id);

        if (!conversation) {
            throw this._createError("Group conversation not found", 404);
        }

        if (!conversation.participants.includes(sender_id)) {
            throw this._createError("Unauthorized", 403);
        }

        return this.sendMessage({
            sender_id,
            conversation_id: conversation._id,
            content,
            type,
        });
    }

    /**
     * Delete a message (soft delete)
     */
    async deleteMessage(message_id, user_id) {
        const message = await this.messageRepo.findById(message_id);

        if (!message) {
            throw this._createError("Message not found", 404);
        }

        if (message.sender_id !== user_id) {
            throw this._createError("Unauthorized", 403);
        }

        return this.messageRepo.softDelete(message_id);
    }

    /**
     * Get conversation by ID
     */
    async getConversation(conversation_id, user_id) {
        const conversation = await this.conversationRepo.findById(conversation_id);

        if (!conversation) {
            throw this._createError("Conversation not found", 404);
        }

        if (!conversation.participants.includes(user_id)) {
            throw this._createError("Unauthorized", 403);
        }

        return conversation;
    }

    /**
     * Create error with status code
     * @private
     */
    _createError(message, status = 400) {
        const error = new Error(message);
        error.status = status;
        return error;
    }
}
