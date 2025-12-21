import express from "express";
import { NotificationController } from "../controllers/NotificationController.js";
import { verifyAccessToken } from "../middlewares/auth.js";

/**
 * Create notification routes
 * @param {Object} deps
 * @param {import("../services/NotificationService.js").NotificationService} deps.notificationService
 */
export function createNotificationRouter({ notificationService }) {
    const router = express.Router();
    const controller = new NotificationController({ notificationService });

    // All routes require authentication
    router.use(verifyAccessToken);

    // =========================
    //    GET NOTIFICATIONS
    // =========================
    router.get("/", controller.getNotifications.bind(controller));

    // =========================
    //    UNREAD COUNT
    // =========================
    router.get("/unread-count", controller.getUnreadCount.bind(controller));

    // =========================
    //    GET DETAIL
    // =========================
    router.get("/:id", controller.getNotificationDetail.bind(controller));

    // =========================
    //    SEND NOTIFICATION
    // =========================
    router.post("/", controller.sendNotification.bind(controller));

    // =========================
    //    MARK AS READ
    // =========================
    router.patch("/:id/read", controller.markAsRead.bind(controller));

    // =========================
    //    MARK ALL AS READ
    // =========================
    router.patch("/read-all", controller.markAllAsRead.bind(controller));

    // =========================
    //    DELETE NOTIFICATION
    // =========================
    router.delete("/:id", controller.deleteNotification.bind(controller));

    return router;
}
