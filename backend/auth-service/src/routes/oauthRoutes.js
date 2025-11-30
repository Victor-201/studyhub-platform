import express from "express";
import { OAuthController } from "../controllers/OAuthController.js";

export function createOAuthRouter({ oauthService, authService }) {
  const router = express.Router();
  const controller = new OAuthController({ oauthService, authService });

  router.post("/login", controller.login.bind(controller));

  return router;
}
