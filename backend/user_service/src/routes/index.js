import express from "express";
import { createProfileRouter } from "./profileRouter.js";
import { createFollowRouter } from "./followRouter.js";

export function createRoutes({ profileService, followService }) {
  const router = express.Router();

  router.use("/profile", createProfileRouter({ profileService }));
  router.use("/follow", createFollowRouter({ followService }));

  return router;
}
