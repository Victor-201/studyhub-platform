// src/utils/jwt.js
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccess(payload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES });
}
export function verifyAccess(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}
export function signRefresh(payload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: `${env.REFRESH_EXPIRES_DAYS}d` });
}
export function verifyRefresh(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
