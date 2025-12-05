import express from "express";
import { createGroupRouter } from "./groupRoutes.js";
import { createMemberRouter } from "./memberRoutes.js";

/**
 * @param {Object} deps
 */
export function createRouter(deps) {
  const router = express.Router();

  router.use("", createGroupRouter(deps));
  router.use("/members", createMemberRouter(deps));
  return router;
}
