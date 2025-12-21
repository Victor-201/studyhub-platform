import Notification from "../models/Notification.js";

export class NotificationRepository {
    /**
     * Create a new notification
     * @param {Object} data - Notification data
     * @returns {Promise<Object>} Created notification
     */
    async create(data) {
        const notification = new Notification(data);
        await notification.save();
        return notification;
    }

    /**
     * Find notification by ID
     * @param {string} id - Notification ID
     * @returns {Promise<Object|null>}
     */
    async findById(id) {
        return Notification.findById(id);
    }

    /**
     * Find notifications by sender
     * @param {string} sender_id
     * @param {Object} options - { limit, offset }
     * @returns {Promise<Array>}
     */
    async findBySender(sender_id, { limit = 50, offset = 0 } = {}) {
        return Notification.find({ sender_id })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(limit);
    }

    /**
     * Find notifications by target
     * @param {string} targetType - user/group/post/document
     * @param {string} targetId
     * @param {Object} options - { limit, offset }
     * @returns {Promise<Array>}
     */
    async findByTarget(targetType, targetId, { limit = 50, offset = 0 } = {}) {
        return Notification.find({
            "target.type": targetType,
            "target.id": targetId
        })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(limit);
    }

    /**
     * Delete notification by ID
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const result = await Notification.findByIdAndDelete(id);
        return !!result;
    }

    /**
     * Find notifications by IDs
     * @param {Array} ids - Array of notification IDs
     * @returns {Promise<Array>}
     */
    async findByIds(ids) {
        return Notification.find({ _id: { $in: ids } });
    }
}
