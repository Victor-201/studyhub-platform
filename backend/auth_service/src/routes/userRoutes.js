import express from "express";
import { UserController } from "../controllers/UserController.js";
import { verifyAccessToken } from "../middlewares/auth.js";

export function createUserRouter({ userService }) {
  const router = express.Router();
  const controller = new UserController({ userService });

  router.use(verifyAccessToken);

  router.get("/profile", controller.getProfile.bind(controller));
  router.patch("/profile", controller.updateProfile.bind(controller));
  router.get("/emails", controller.listEmails.bind(controller));
  router.post("/emails", controller.addEmail.bind(controller));
  router.patch("/emails/primary", controller.setPrimaryEmail.bind(controller));

  return router;
}
