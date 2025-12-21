import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender_id: {
        type: String,
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    target: {
        type: {
            type: String,
            enum: ["user", "group", "post", "document"],
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    type: {
        type: String,
        required: true,
        index: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Compound index for efficient queries
notificationSchema.index({ "target.type": 1, "target.id": 1 });

export default mongoose.model("Notification", notificationSchema);
