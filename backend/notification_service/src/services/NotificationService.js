/**
 * NotificationService
 * Business logic for notification operations
 */
export class NotificationService {
    /**
     * @param {Object} deps
     * @param {import("../repos/NotificationRepository.js").NotificationRepository} deps.notificationRepo
     * @param {import("../repos/NotificationReceiverRepository.js").NotificationReceiverRepository} deps.receiverRepo
     */
    constructor({ notificationRepo, receiverRepo }) {
        this.notificationRepo = notificationRepo;
        this.receiverRepo = receiverRepo;
    }

    /**
     * Send notification to multiple receivers
     * @param {Object} data
     * @param {string} data.sender_id - ID of sender
     * @param {string} data.content - Notification content
     * @param {Object} data.target - { type, id }
     * @param {string} data.type - Notification type
     * @param {Array<string>} data.receiver_ids - Array of receiver IDs
     * @returns {Promise<Object>} Created notification with receivers
     */
    async sendNotification({ sender_id, content, target, type, receiver_ids }) {
        // Create the notification
        const notification = await this.notificationRepo.create({
            sender_id,
            content,
            target,
            type,
        });

        // Create receiver entries for each receiver
        if (receiver_ids && receiver_ids.length > 0) {
            const receiverData = receiver_ids.map((receiver_id) => ({
                notification_id: notification._id,
                receiver_id,
            }));
            await this.receiverRepo.createMany(receiverData);
        }

        return notification;
    }

    /**
     * Get notifications for a user
     * @param {string} user_id - Receiver ID
     * @param {Object} options - { status, limit, offset }
     * @returns {Promise<Array>}
     */
    async getNotificationsForUser(user_id, { status = null, limit = 50, offset = 0 } = {}) {
        const receivers = await this.receiverRepo.findByReceiver(user_id, {
            status,
            limit,
            offset,
        });

        // Transform to include notification details
        return receivers.map((r) => ({
            id: r._id,
            notification: r.notification_id,
            status: r.status,
            received_at: r.received_at,
            read_at: r.read_at,
        }));
    }

    /**
     * Mark a notification as read for a specific user
     * @param {string} receiver_entry_id - NotificationReceiver document ID
     * @param {string} user_id - User requesting the action
     * @returns {Promise<Object>}
     */
    async markAsRead(receiver_entry_id, user_id) {
        const entry = await this.receiverRepo.findById(receiver_entry_id);

        if (!entry) {
            throw this._createError("Notification not found", 404);
        }

        if (entry.receiver_id !== user_id) {
            throw this._createError("Unauthorized", 403);
        }

        return this.receiverRepo.markAsRead(receiver_entry_id);
    }

    /**
     * Mark all notifications as read for a user
     * @param {string} user_id
     * @returns {Promise<Object>}
     */
    async markAllAsRead(user_id) {
        return this.receiverRepo.markAllAsRead(user_id);
    }

    /**
     * Delete (soft) a notification for a user
     * @param {string} receiver_entry_id
     * @param {string} user_id
     * @returns {Promise<Object>}
     */
    async deleteNotification(receiver_entry_id, user_id) {
        const entry = await this.receiverRepo.findById(receiver_entry_id);

        if (!entry) {
            throw this._createError("Notification not found", 404);
        }

        if (entry.receiver_id !== user_id) {
            throw this._createError("Unauthorized", 403);
        }

        return this.receiverRepo.markAsDeleted(receiver_entry_id);
    }

    /**
     * Get unread count for a user
     * @param {string} user_id
     * @returns {Promise<number>}
     */
    async getUnreadCount(user_id) {
        return this.receiverRepo.countUnread(user_id);
    }

    /**
     * Get notification detail by ID
     * @param {string} receiver_entry_id
     * @param {string} user_id
     * @returns {Promise<Object>}
     */
    async getNotificationDetail(receiver_entry_id, user_id) {
        const entry = await this.receiverRepo.findById(receiver_entry_id);

        if (!entry) {
            throw this._createError("Notification not found", 404);
        }

        if (entry.receiver_id !== user_id) {
            throw this._createError("Unauthorized", 403);
        }

        return {
            id: entry._id,
            notification: entry.notification_id,
            status: entry.status,
            received_at: entry.received_at,
            read_at: entry.read_at,
        };
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
