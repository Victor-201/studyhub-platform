import mongoose from "mongoose";

const notificationReceiverSchema = new mongoose.Schema({
    notification_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
        required: true,
        index: true
    },
    receiver_id: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ["unread", "read", "deleted"],
        default: "unread",
        index: true
    },
    received_at: {
        type: Date,
        default: Date.now
    },
    read_at: {
        type: Date,
        default: null
    }
});

// Compound indexes for common queries
notificationReceiverSchema.index({ receiver_id: 1, status: 1 });
notificationReceiverSchema.index({ receiver_id: 1, received_at: -1 });

export default mongoose.model("NotificationReceiver", notificationReceiverSchema);
