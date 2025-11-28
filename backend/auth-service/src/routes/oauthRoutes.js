import express from "express";

/**
 * @param {Object} deps
 * @param {import("../controllers/OAuthController.js").OAuthController} deps.oauthController
 */
export function createOAuthRouter({ oauthController }) {
  const router = express.Router();
  router.post("/login", oauthController.login.bind(oauthController));
  return router;
}
