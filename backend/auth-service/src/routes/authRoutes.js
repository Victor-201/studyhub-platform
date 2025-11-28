// src/routes/authRoutes.js
import express from "express";

export function createAuthRouter(AuthController, verifyAccessToken) {
  const router = express.Router();

  router.post("/register", (req, res) => AuthController.register(req, res));
  router.post("/login", (req, res) => AuthController.login(req, res));
  router.post("/refresh", (req, res) => AuthController.refreshToken(req, res));
  router.post("/forgot-password", (req, res) => AuthController.forgotPassword(req, res));
  router.post("/reset-password", (req, res) => AuthController.resetPassword(req, res));
  router.post("/change-password", verifyAccessToken, (req, res) => AuthController.changePassword(req, res));
  router.get("/me", verifyAccessToken, (req, res) => AuthController.getMe(req, res));

  return router;
}
