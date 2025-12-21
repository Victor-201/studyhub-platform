import NotificationReceiver from "../models/NotificationReceiver.js";

export class NotificationReceiverRepository {
    /**
     * Create receiver entry
     * @param {Object} data - { notification_id, receiver_id }
     * @returns {Promise<Object>}
     */
    async create(data) {
        const receiver = new NotificationReceiver(data);
        await receiver.save();
        return receiver;
    }

    /**
     * Create multiple receiver entries at once
     * @param {Array} dataArray - Array of { notification_id, receiver_id }
     * @returns {Promise<Array>}
     */
    async createMany(dataArray) {
        return NotificationReceiver.insertMany(dataArray);
    }

    /**
     * Find by receiver with optional status filter
     * @param {string} receiver_id
     * @param {Object} options - { status, limit, offset }
     * @returns {Promise<Array>}
     */
    async findByReceiver(receiver_id, { status = null, limit = 50, offset = 0 } = {}) {
        const query = { receiver_id };

        if (status) {
            query.status = status;
        } else {
            // By default, exclude deleted
            query.status = { $ne: "deleted" };
        }

        return NotificationReceiver.find(query)
            .sort({ received_at: -1 })
            .skip(offset)
            .limit(limit)
            .populate("notification_id");
    }

    /**
     * Find by notification_id and receiver_id
     * @param {string} notification_id
     * @param {string} receiver_id
     * @returns {Promise<Object|null>}
     */
    async findOne(notification_id, receiver_id) {
        return NotificationReceiver.findOne({ notification_id, receiver_id });
    }

    /**
     * Find by ID
     * @param {string} id
     * @returns {Promise<Object|null>}
     */
    async findById(id) {
        return NotificationReceiver.findById(id).populate("notification_id");
    }

    /**
     * Mark notification as read
     * @param {string} id - NotificationReceiver ID
     * @returns {Promise<Object|null>}
     */
    async markAsRead(id) {
        return NotificationReceiver.findByIdAndUpdate(
            id,
            { status: "read", read_at: new Date() },
            { new: true }
        );
    }

    /**
     * Mark all notifications for receiver as read
     * @param {string} receiver_id
     * @returns {Promise<Object>} Update result
     */
    async markAllAsRead(receiver_id) {
        return NotificationReceiver.updateMany(
            { receiver_id, status: "unread" },
            { status: "read", read_at: new Date() }
        );
    }

    /**
     * Mark notification as deleted (soft delete)
     * @param {string} id - NotificationReceiver ID
     * @returns {Promise<Object|null>}
     */
    async markAsDeleted(id) {
        return NotificationReceiver.findByIdAndUpdate(
            id,
            { status: "deleted" },
            { new: true }
        );
    }

    /**
     * Count unread notifications for receiver
     * @param {string} receiver_id
     * @returns {Promise<number>}
     */
    async countUnread(receiver_id) {
        return NotificationReceiver.countDocuments({
            receiver_id,
            status: "unread"
        });
    }

    /**
     * Delete receivers by notification_id
     * @param {string} notification_id
     * @returns {Promise<Object>}
     */
    async deleteByNotification(notification_id) {
        return NotificationReceiver.deleteMany({ notification_id });
    }
}
