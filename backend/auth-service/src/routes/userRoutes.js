import express from "express";

/**
 * @param {Object} deps
 * @param {import("../controllers/UserController.js").UserController} deps.userController
 * @param {Function} deps.verifyAccessToken
 */
export function createUserRouter({ userController, verifyAccessToken }) {
  const router = express.Router();
  router.use(verifyAccessToken);

  router.get("/profile", userController.getProfile.bind(userController));
  router.patch("/profile", userController.updateProfile.bind(userController));
  router.get("/emails", userController.listEmails.bind(userController));
  router.post("/emails", userController.addEmail.bind(userController));
  router.patch("/emails/primary", userController.setPrimaryEmail.bind(userController));

  return router;
}
