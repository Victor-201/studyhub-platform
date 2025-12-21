/**
 * NotificationController
 * Handles HTTP requests for notification operations
 */
export class NotificationController {
    /**
     * @param {Object} deps
     * @param {import("../services/NotificationService.js").NotificationService} deps.notificationService
     */
    constructor({ notificationService }) {
        this.notificationService = notificationService;
    }

    /**
     * GET / - Get user's notifications
     */
    async getNotifications(req, res) {
        try {
            const user_id = req.user.id;
            const { status, limit = 50, offset = 0 } = req.query;

            const notifications = await this.notificationService.getNotificationsForUser(
                user_id,
                {
                    status,
                    limit: Number(limit),
                    offset: Number(offset),
                }
            );

            res.json({
                success: true,
                data: notifications,
            });
        } catch (err) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message,
            });
        }
    }

    /**
     * GET /:id - Get notification detail
     */
    async getNotificationDetail(req, res) {
        try {
            const user_id = req.user.id;
            const { id } = req.params;

            const notification = await this.notificationService.getNotificationDetail(id, user_id);

            res.json({
                success: true,
                data: notification,
            });
        } catch (err) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message,
            });
        }
    }

    /**
     * GET /unread-count - Get unread notification count
     */
    async getUnreadCount(req, res) {
        try {
            const user_id = req.user.id;
            const count = await this.notificationService.getUnreadCount(user_id);

            res.json({
                success: true,
                data: { count },
            });
        } catch (err) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message,
            });
        }
    }

    /**
     * POST / - Send notification (internal/admin use)
     */
    async sendNotification(req, res) {
        try {
            const { sender_id, content, target, type, receiver_ids } = req.body;

            if (!sender_id || !content || !target || !type || !receiver_ids) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: sender_id, content, target, type, receiver_ids",
                });
            }

            const notification = await this.notificationService.sendNotification({
                sender_id,
                content,
                target,
                type,
                receiver_ids,
            });

            res.status(201).json({
                success: true,
                data: notification,
            });
        } catch (err) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message,
            });
        }
    }

    /**
     * PATCH /:id/read - Mark notification as read
     */
    async markAsRead(req, res) {
        try {
            const user_id = req.user.id;
            const { id } = req.params;

            const updated = await this.notificationService.markAsRead(id, user_id);

            res.json({
                success: true,
                data: updated,
            });
        } catch (err) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message,
            });
        }
    }

    /**
     * PATCH /read-all - Mark all notifications as read
     */
    async markAllAsRead(req, res) {
        try {
            const user_id = req.user.id;
            const result = await this.notificationService.markAllAsRead(user_id);

            res.json({
                success: true,
                data: { modifiedCount: result.modifiedCount },
            });
        } catch (err) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message,
            });
        }
    }

    /**
     * DELETE /:id - Delete notification
     */
    async deleteNotification(req, res) {
        try {
            const user_id = req.user.id;
            const { id } = req.params;

            await this.notificationService.deleteNotification(id, user_id);

            res.json({
                success: true,
                message: "Notification deleted",
            });
        } catch (err) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message,
            });
        }
    }
}
