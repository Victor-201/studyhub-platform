import express from "express";

/**
 * Auth Router
 * @param {Object} deps
 * @param {import("../controllers/AuthController.js").AuthController} deps.authController
 * @param {Function} deps.verifyAccessToken
 */
export function createAuthRouter({ authController, verifyAccessToken }) {
  const router = express.Router();

  router.post("/register", authController.register.bind(authController));
  router.post("/verify-email", authController.verifyEmail.bind(authController));
  router.post("/login", authController.login.bind(authController));
  router.post("/refresh", authController.refresh.bind(authController));
  router.post("/forgot-password", authController.forgotPassword.bind(authController));
  router.post("/reset-password", authController.resetPassword.bind(authController));

  router.use(verifyAccessToken);
  router.post("/change-password", authController.changePassword.bind(authController));
  router.get("/me", authController.me.bind(authController));

  return router;
}
