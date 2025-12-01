import { Router } from "express";
import { FollowController } from "../controllers/FollowController.js";
import { verifyAccessToken } from "../middlewares/auth.js";

export function createFollowRouter({ followService }) {
  const router = Router();
  const controller = new FollowController({ followService });

  router.post("/follow", verifyAccessToken, controller.follow.bind(controller));
  router.post("/unfollow", verifyAccessToken, controller.unfollow.bind(controller));
  router.get("/:user_id/counts", verifyAccessToken, controller.getFollowCounts.bind(controller));
  router.get("/:user_id/friends", verifyAccessToken, controller.getFriends.bind(controller));
  router.get("/is-following", verifyAccessToken, controller.isFollowing.bind(controller));
  router.get("/is-friend", verifyAccessToken, controller.isFriend.bind(controller));

  return router;
}
