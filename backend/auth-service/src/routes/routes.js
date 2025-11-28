import express from "express";
import { createAuthRouter } from "./authRoutes.js";
import { createOAuthRouter } from "./oauthRoutes.js";
import { createAdminRouter } from "./adminRoutes.js";
import { verifyAccessToken } from "../middlewares/auth.js";

export function createRouter({ AuthController,OAuthController, AdminController, ReportController }) {
  const router = express.Router();

  router.use("/auth", createAuthRouter(AuthController, verifyAccessToken));
  router.use("/oauth", createOAuthRouter(OAuthController));
  router.use("/admin", createAdminRouter(AdminController, ReportController, verifyAccessToken));

  return router;
}
