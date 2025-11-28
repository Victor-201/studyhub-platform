import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function verifyAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token" });

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = payload; // payload.userId
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}