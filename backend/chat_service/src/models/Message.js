import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender_id: {
        type: String,
        required: true,
        index: true
    },
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["text", "image", "file"],
        default: "text"
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    },
    updated_at: {
        type: Date,
        default: null
    },
    deleted_at: {
        type: Date,
        default: null
    }
});

// Compound index for fetching messages in a conversation
messageSchema.index({ conversation_id: 1, created_at: -1 });

export default mongoose.model("Message", messageSchema);
