import express from "express";
import { createAuthRouter } from "./authRoutes.js";
import { createOAuthRouter } from "./oauthRoutes.js";
import { createAdminRouter } from "./adminRoutes.js";
import { createUserRouter } from "./userRoutes.js";

/**
 * @param {Object} deps
 * @param {Object} deps.controllers
 * @param {Function} deps.verifyAccessToken
 */
export function createRoutes({ controllers, verifyAccessToken }) {
  const router = express.Router();

  router.use("/auth", createAuthRouter({ 
    authController: controllers.authController, 
    verifyAccessToken 
  }));

  router.use("/oauth", createOAuthRouter({ 
    oauthController: controllers.oauthController 
  }));

  router.use("/admin", createAdminRouter({ 
    adminController: controllers.adminController, 
    reportController: controllers.reportController, 
    verifyAccessToken 
  }));

  router.use("/users", createUserRouter({ 
    userController: controllers.userController, 
    verifyAccessToken 
  }));

  return router;
}