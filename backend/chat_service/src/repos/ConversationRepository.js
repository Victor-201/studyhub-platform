import Conversation from "../models/Conversation.js";

export class ConversationRepository {
    /**
     * Create a new conversation
     */
    async create(data) {
        const conversation = new Conversation(data);
        await conversation.save();
        return conversation;
    }

    /**
     * Find conversation by ID
     */
    async findById(id) {
        return Conversation.findById(id);
    }

    /**
     * Find direct conversation between two users
     */
    async findDirectConversation(user1_id, user2_id) {
        return Conversation.findOne({
            type: "direct",
            participants: { $all: [user1_id, user2_id], $size: 2 }
        });
    }

    /**
     * Find group conversation by target_id (group_id)
     */
    async findGroupConversation(group_id) {
        return Conversation.findOne({
            type: "group",
            target_id: group_id
        });
    }

    /**
     * Get all conversations for a user
     */
    async findByParticipant(user_id, { limit = 50, offset = 0 } = {}) {
        return Conversation.find({ participants: user_id })
            .sort({ last_message_at: -1 })
            .skip(offset)
            .limit(limit)
            .populate("last_message_id");
    }

    /**
     * Update last message info
     */
    async updateLastMessage(conversation_id, message_id) {
        return Conversation.findByIdAndUpdate(
            conversation_id,
            {
                last_message_id: message_id,
                last_message_at: new Date()
            },
            { new: true }
        );
    }

    /**
     * Add participant to conversation
     */
    async addParticipant(conversation_id, user_id) {
        return Conversation.findByIdAndUpdate(
            conversation_id,
            { $addToSet: { participants: user_id } },
            { new: true }
        );
    }

    /**
     * Remove participant from conversation
     */
    async removeParticipant(conversation_id, user_id) {
        return Conversation.findByIdAndUpdate(
            conversation_id,
            { $pull: { participants: user_id } },
            { new: true }
        );
    }
}
