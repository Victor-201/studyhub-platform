import express from "express";
import { createAuthRouter } from "./authRoutes.js";
import { createAdminRouter } from "./adminRoutes.js";
import { createOAuthRouter } from "./oauthRoutes.js";
import { createUserRouter } from "./userRoutes.js";

export function createRoutes({ authService, adminService, oauthService, userService }) {
  const router = express.Router();

  router.use("", createAuthRouter({ authService }));
  router.use("/admin", createAdminRouter({ adminService }));
  router.use("/oauth", createOAuthRouter({ oauthService, authService }));
  router.use("/user", createUserRouter({ userService }));

  return router;
}
