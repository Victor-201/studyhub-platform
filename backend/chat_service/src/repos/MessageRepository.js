import Message from "../models/Message.js";

export class MessageRepository {
    /**
     * Create a new message
     */
    async create(data) {
        const message = new Message(data);
        await message.save();
        return message;
    }

    /**
     * Find message by ID
     */
    async findById(id) {
        return Message.findById(id);
    }

    /**
     * Get messages in a conversation (paginated, newest first)
     */
    async findByConversation(conversation_id, { limit = 50, before = null } = {}) {
        const query = {
            conversation_id,
            deleted_at: null
        };

        if (before) {
            query.created_at = { $lt: before };
        }

        return Message.find(query)
            .sort({ created_at: -1 })
            .limit(limit);
    }

    /**
     * Soft delete a message
     */
    async softDelete(id) {
        return Message.findByIdAndUpdate(
            id,
            { deleted_at: new Date() },
            { new: true }
        );
    }

    /**
     * Update message content
     */
    async update(id, content) {
        return Message.findByIdAndUpdate(
            id,
            {
                content,
                updated_at: new Date()
            },
            { new: true }
        );
    }

    /**
     * Get latest message in conversation
     */
    async getLatestMessage(conversation_id) {
        return Message.findOne({
            conversation_id,
            deleted_at: null
        }).sort({ created_at: -1 });
    }

    /**
     * Count messages in conversation
     */
    async countByConversation(conversation_id) {
        return Message.countDocuments({
            conversation_id,
            deleted_at: null
        });
    }
}
