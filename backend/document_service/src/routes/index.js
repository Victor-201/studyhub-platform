import express from "express";
import { createDocumentRouter } from "./documentRoutes.js";
import { createDocumentInteractionsRouter } from "./documentInteractionsRoutes.js";

/**
 * @param {Object} deps
 */
export function createRouter(deps) {
  const router = express.Router();

  router.use("", createDocumentRouter(deps));
  router.use("/interactions", createDocumentInteractionsRouter(deps));

  return router;
}
