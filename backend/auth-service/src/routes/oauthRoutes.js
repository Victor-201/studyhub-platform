import express from "express";
export function createOAuthRouter(OAuthController) {
  const router = express.Router();

  router.post("/login", (req, res) => OAuthController.login(req, res));

  return router;
}
