import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { verifyAccessToken } from "../middlewares/auth.js";

export function createAuthRouter({ authService }) {
  const router = express.Router();
  const controller = new AuthController({ authService });

  router.post("/register", controller.register.bind(controller));
  router.post("/verify-email", controller.verifyEmail.bind(controller));
  router.post("/login", controller.login.bind(controller));
  router.post("/refresh", controller.refresh.bind(controller));
  router.post("/forgot-password", controller.forgotPassword.bind(controller));
  router.post("/reset-password", controller.resetPassword.bind(controller));
  router.post("/logout", verifyAccessToken, controller.logout.bind(controller));

  router.post("/change-password", verifyAccessToken, controller.changePassword.bind(controller));
  router.get("/me", verifyAccessToken, controller.me.bind(controller));

  return router;
}
