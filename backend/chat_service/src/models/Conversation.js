import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["direct", "group"],
        required: true,
        index: true
    },
    target_id: {
        type: String,
        default: null,
        index: true
    },
    participants: [{
        type: String,
        required: true
    }],
    last_message_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
    last_message_at: {
        type: Date,
        default: null,
        index: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Index for finding conversations by participant
conversationSchema.index({ participants: 1 });
// Index for finding group conversations
conversationSchema.index({ type: 1, target_id: 1 });

export default mongoose.model("Conversation", conversationSchema);
